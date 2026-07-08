import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/index";
import { 
  usersTable, 
  jobsTable, 
  applicationsTable, 
  resumesTable, 
  atsReportsTable, 
  coverLettersTable 
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

async function getOrCreateDbUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  // Find user in DB
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  // Get user details from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Clerk User";
  const imageUrl = clerkUser.imageUrl || null;

  // Create new user in DB
  const [newUser] = await db
    .insert(usersTable)
    .values({
      clerkId,
      fullName,
      email,
      imageUrl,
    })
    .returning();

  return newUser;
}

// 1. GET: Retrieve all applications linked to user
export async function GET() {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userApplications = await db
      .select({
        id: applicationsTable.id,
        status: applicationsTable.status,
        notes: applicationsTable.notes,
        archived: applicationsTable.archived,
        appliedAt: applicationsTable.appliedAt,
        createdAt: applicationsTable.createdAt,
        updatedAt: applicationsTable.updatedAt,
        job: {
          id: jobsTable.id,
          externalJobId: jobsTable.externalJobId,
          title: jobsTable.title,
          company: jobsTable.company,
          companyLogo: jobsTable.companyLogo,
          location: jobsTable.location,
          employmentType: jobsTable.employmentType,
          salary: jobsTable.salary,
          description: jobsTable.description,
          applyUrl: jobsTable.applyUrl,
          source: jobsTable.source,
        },
        resume: {
          id: resumesTable.id,
          title: resumesTable.title,
          fileName: resumesTable.fileName,
          fileUrl: resumesTable.fileUrl,
        },
        coverLetter: {
          id: coverLettersTable.id,
          title: coverLettersTable.title,
          content: coverLettersTable.content,
        },
        atsReport: {
          id: atsReportsTable.id,
          score: atsReportsTable.score,
          missingKeywords: atsReportsTable.missingKeywords,
          suggestions: atsReportsTable.suggestions,
        }
      })
      .from(applicationsTable)
      .innerJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
      .leftJoin(resumesTable, eq(applicationsTable.resumeId, resumesTable.id))
      .leftJoin(atsReportsTable, eq(applicationsTable.atsReportId, atsReportsTable.id))
      .leftJoin(coverLettersTable, eq(applicationsTable.coverLetterId, coverLettersTable.id))
      .where(eq(applicationsTable.userId, dbUser.id));

    return NextResponse.json(userApplications);
  } catch (error: unknown) {
    console.error("Application Tracker GET Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}

// 2. POST: Create a saved job application
export async function POST(request: Request) {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { job } = payload;

    if (!job || !job.title || !job.company) {
      return NextResponse.json(
        { error: "Invalid job payload details." },
        { status: 400 }
      );
    }

    // A. Check if the job is already stored in jobsTable
    let jobId: number;
    let existingJobs = [];

    if (job.externalJobId) {
      existingJobs = await db
        .select()
        .from(jobsTable)
        .where(eq(jobsTable.externalJobId, job.externalJobId))
        .limit(1);
    } else {
      existingJobs = await db
        .select()
        .from(jobsTable)
        .where(
          and(
            eq(jobsTable.title, job.title),
            eq(jobsTable.company, job.company)
          )
        )
        .limit(1);
    }

    if (existingJobs.length > 0) {
      jobId = existingJobs[0].id;
    } else {
      const [insertedJob] = await db
        .insert(jobsTable)
        .values({
          externalJobId: job.externalJobId || null,
          title: job.title,
          company: job.company,
          companyLogo: job.companyLogo || null,
          location: job.location || null,
          employmentType: job.employmentType || null,
          salary: job.salary || null,
          description: job.description || null,
          applyUrl: job.applyUrl || null,
          source: job.source || null,
        })
        .returning();
      jobId = insertedJob.id;
    }

    // B. Check if this user already has an application folder for this jobId
    const [existingApp] = await db
      .select()
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.userId, dbUser.id),
          eq(applicationsTable.jobId, jobId)
        )
      )
      .limit(1);

    if (existingApp) {
      return NextResponse.json(
        { 
          message: "Application is already in tracker.",
          application: existingApp
        },
        { status: 200 }
      );
    }

    // C. Create application with status = "Saved"
    const [newApp] = await db
      .insert(applicationsTable)
      .values({
        userId: dbUser.id,
        jobId: jobId,
        status: "Saved",
        notes: null,
      })
      .returning();

    return NextResponse.json({
      message: "Job saved to application tracker.",
      application: newApp
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Application Tracker POST Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}

// 3. PATCH: Update application fields (status, notes, resumeId, coverLetterId, archived)
export async function PATCH(request: Request) {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { applicationId, status, notes, resumeId, coverLetterId, atsReportId, archived } = payload;

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required for updates." },
        { status: 400 }
      );
    }

    // Verify application ownership
    const [targetApp] = await db
      .select()
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.id, Number(applicationId)),
          eq(applicationsTable.userId, dbUser.id)
        )
      )
      .limit(1);

    if (!targetApp) {
      return NextResponse.json(
        { error: "Application folder not found." },
        { status: 404 }
      );
    }

    const updateFields: Record<string, unknown> = {};
    if (status !== undefined) {
      updateFields.status = status;
      if (status === "Applied" && !targetApp.appliedAt) {
        updateFields.appliedAt = new Date();
      }
    }
    if (notes !== undefined) updateFields.notes = notes;
    if (resumeId !== undefined) updateFields.resumeId = resumeId ? Number(resumeId) : null;
    if (coverLetterId !== undefined) updateFields.coverLetterId = coverLetterId ? Number(coverLetterId) : null;
    if (atsReportId !== undefined) updateFields.atsReportId = atsReportId ? Number(atsReportId) : null;
    if (archived !== undefined) updateFields.archived = Boolean(archived);

    updateFields.updatedAt = new Date();

    const [updatedApp] = await db
      .update(applicationsTable)
      .set(updateFields)
      .where(
        and(
          eq(applicationsTable.id, Number(applicationId)),
          eq(applicationsTable.userId, dbUser.id)
        )
      )
      .returning();

    return NextResponse.json({
      message: "Application updated successfully.",
      application: updatedApp
    });

  } catch (error: unknown) {
    console.error("Application Tracker PATCH Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}
