import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/index";
import { 
  usersTable, 
  jobsTable, 
  applicationsTable, 
  resumesTable, 
  atsReportsTable, 
  coverLettersTable,
  statusHistoryTable
} from "@/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";
import { resend } from "@/lib/resend";

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

/**
 * Rich HTML Email Builder for Application Confirmation
 */
async function sendRichApplicationEmail({
  userEmail,
  userName,
  companyName,
  companyLogo,
  jobTitle,
  location,
  employmentType,
  salary,
  status,
  appliedAt,
  resume,
  coverLetter,
  notes,
}: {
  userEmail: string;
  userName: string;
  companyName: string;
  companyLogo?: string | null;
  jobTitle: string;
  location?: string | null;
  employmentType?: string | null;
  salary?: string | null;
  status: string;
  appliedAt: Date | string;
  resume?: { fileName: string; fileUrl: string } | null;
  coverLetter?: { title: string; content: string } | null;
  notes?: string | null;
}) {
  const formattedDate = new Date(appliedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const logoHtml = companyLogo
    ? `<img src="${companyLogo}" alt="${companyName}" style="height: 44px; width: 44px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; margin-right: 12px;" />`
    : `<div style="display: inline-block; width: 44px; height: 44px; background-color: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center; line-height: 44px; font-weight: bold; font-size: 14px; color: #475569; margin-right: 12px;">${companyName.substring(0, 2).toUpperCase()}</div>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Details - ${companyName}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
      <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        
        <!-- HEADER -->
        <div style="background-color: #0f172a; padding: 32px; color: #ffffff;">
          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #38bdf8; text-transform: uppercase;">Job Application Receipt</p>
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.2;">${jobTitle}</h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; color: #94a3b8;">Company: <strong style="color: #f8fafc;">${companyName}</strong></p>
        </div>

        <div style="padding: 32px;">
          <p style="margin-top: 0; font-size: 15px; line-height: 1.5; color: #334155;">Hi <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Here is your complete application detail summary submitted and synced in your career tracker on <strong>${formattedDate}</strong>.
          </p>

          <!-- JOB OVERVIEW CARD -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: top;">
                  ${logoHtml}
                </td>
                <td style="vertical-align: top; width: 100%;">
                  <h3 style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 700;">${companyName}</h3>
                  <p style="margin: 2px 0 6px 0; font-size: 13px; color: #64748b;">${jobTitle}</p>
                  <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px;">Stage: ${status}</span>
                </td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />

            <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; width: 35%; color: #64748b;">Role:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${jobTitle}</td>
              </tr>
              ${location ? `<tr><td style="padding: 6px 0; font-weight: 600; color: #64748b;">Location:</td><td style="padding: 6px 0; color: #0f172a;">${location}</td></tr>` : ""}
              ${employmentType ? `<tr><td style="padding: 6px 0; font-weight: 600; color: #64748b;">Employment Type:</td><td style="padding: 6px 0; color: #0f172a;">${employmentType}</td></tr>` : ""}
              ${salary ? `<tr><td style="padding: 6px 0; font-weight: 600; color: #64748b;">Salary Range:</td><td style="padding: 6px 0; color: #16a34a; font-weight: 700;">${salary}</td></tr>` : ""}
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Timestamp:</td>
                <td style="padding: 6px 0; color: #0f172a;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <!-- ATTACHED RESUME -->
          ${resume ? `
            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Attached Resume</h4>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <p style="margin: 0; font-size: 13px; font-weight: 600; color: #0f172a;">📄 ${resume.fileName}</p>
                  <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Linked Resume File</p>
                </div>
                ${resume.fileUrl ? `<a href="${resume.fileUrl}" target="_blank" style="font-size: 12px; color: #2563eb; font-weight: 600; text-decoration: none;">View Document &rarr;</a>` : ""}
              </div>
            </div>
          ` : ""}

          <!-- COVER LETTER -->
          ${coverLetter ? `
            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Cover Letter (${coverLetter.title})</h4>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; font-size: 13px; color: #334155; line-height: 1.65; white-space: pre-wrap;">
                ${coverLetter.content}
              </div>
            </div>
          ` : ""}

          <!-- PERSONAL NOTES -->
          ${notes ? `
            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Personal Notes</h4>
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #92400e; line-height: 1.55;">
                ${notes}
              </div>
            </div>
          ` : ""}

          <!-- CTA FOOTER -->
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">Track status changes and candidate updates in your central workspace.</p>
            <a href="http://localhost:3000/visual-whiteboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 600;">Open Application Tracker &rarr;</a>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "JobBoard <onboarding@resend.dev>",
    to: [userEmail],
    subject: `Application Submitted: ${jobTitle} at ${companyName}`,
    html: htmlContent,
  });
}

// 1. GET: Retrieve all applications linked to user along with status history
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

    // Fetch status history items for all applications
    const appIds = userApplications.map(app => app.id);
    let historyRecords: Array<typeof statusHistoryTable.$inferSelect> = [];
    if (appIds.length > 0) {
      try {
        historyRecords = await db
          .select()
          .from(statusHistoryTable)
          .where(inArray(statusHistoryTable.applicationId, appIds))
          .orderBy(asc(statusHistoryTable.changedAt));
      } catch (historyErr) {
        console.error("Could not fetch status history records:", historyErr);
      }
    }

    // Attach statusHistory array to each application
    const applicationsWithHistory = userApplications.map(app => {
      const history = historyRecords.filter(h => h.applicationId === app.id);
      return {
        ...app,
        statusHistory: history,
      };
    });

    return NextResponse.json(applicationsWithHistory);
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

    // D. Insert initial status history entry
    try {
      await db.insert(statusHistoryTable).values({
        applicationId: newApp.id,
        fromStatus: null,
        toStatus: "Saved",
        notes: "Job saved to workspace",
      });
    } catch (historyErr) {
      console.error("Could not insert initial status history:", historyErr);
    }

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

// 3. PATCH: Update application fields (status, notes, resumeId, coverLetterId, archived, sendEmail)
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
    const { applicationId, status, notes, resumeId, coverLetterId, atsReportId, archived, sendEmail } = payload;

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

    if (status !== undefined && status !== targetApp.status) {
      updateFields.status = status;
      if (status === "Applied" && !targetApp.appliedAt) {
        updateFields.appliedAt = new Date();
      }

      // Record status transition in statusHistoryTable
      try {
        await db.insert(statusHistoryTable).values({
          applicationId: Number(applicationId),
          fromStatus: targetApp.status,
          toStatus: status,
          notes: `Stage shifted from ${targetApp.status} to ${status}`,
        });
      } catch (historyErr) {
        console.error("Could not insert status history record:", historyErr);
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

    // Trigger Rich Email Notification if status changed to Applied OR explicitly requested via sendEmail
    if (dbUser.email && (status === "Applied" || sendEmail === true)) {
      try {
        const [job] = await db
          .select()
          .from(jobsTable)
          .where(eq(jobsTable.id, targetApp.jobId))
          .limit(1);

        let resumeData = null;
        const currentResumeId = resumeId !== undefined ? Number(resumeId) : targetApp.resumeId;
        if (currentResumeId) {
          const [res] = await db
            .select()
            .from(resumesTable)
            .where(eq(resumesTable.id, currentResumeId))
            .limit(1);
          if (res) resumeData = { fileName: res.fileName, fileUrl: res.fileUrl };
        }

        let coverLetterData = null;
        const currentCoverLetterId = coverLetterId !== undefined ? Number(coverLetterId) : targetApp.coverLetterId;
        if (currentCoverLetterId) {
          const [cl] = await db
            .select()
            .from(coverLettersTable)
            .where(eq(coverLettersTable.id, currentCoverLetterId))
            .limit(1);
          if (cl) coverLetterData = { title: cl.title, content: cl.content };
        }

        await sendRichApplicationEmail({
          userEmail: dbUser.email,
          userName: dbUser.fullName,
          companyName: job?.company || "Target Company",
          companyLogo: job?.companyLogo || null,
          jobTitle: job?.title || "Target Position",
          location: job?.location || null,
          employmentType: job?.employmentType || null,
          salary: job?.salary || null,
          status: updatedApp.status,
          appliedAt: updatedApp.appliedAt || updatedApp.updatedAt || new Date(),
          resume: resumeData,
          coverLetter: coverLetterData,
          notes: updatedApp.notes || null,
        });
      } catch (emailError) {
        console.error("Failed to send rich application email:", emailError);
      }
    }

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

// 4. DELETE: Remove job application folder
export async function DELETE(request: Request) {
  try {
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required for deletion." },
        { status: 400 }
      );
    }

    // Delete associated status history records
    await db
      .delete(statusHistoryTable)
      .where(eq(statusHistoryTable.applicationId, Number(applicationId)));

    // Delete application record
    const deleted = await db
      .delete(applicationsTable)
      .where(
        and(
          eq(applicationsTable.id, Number(applicationId)),
          eq(applicationsTable.userId, dbUser.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Application folder not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Application deleted successfully.",
      deletedId: Number(applicationId)
    });

  } catch (error: unknown) {
    console.error("Application Tracker DELETE Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}
