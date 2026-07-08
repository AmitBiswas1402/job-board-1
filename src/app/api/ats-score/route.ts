import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/index";
import { usersTable, resumesTable, atsReportsTable, applicationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "node:module";

const requireShim = createRequire(import.meta.url);
const pdfParse = requireShim("pdf-parse");

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export async function POST(request: Request) {
  try {
    // 1. Get current database user
    const dbUser = await getOrCreateDbUser();
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = formData.get("jobTitle") as string || "";
    const jobDescription = formData.get("jobDescription") as string || "";
    const jobType = formData.get("jobType") as string || "";
    const applicationId = formData.get("applicationId") as string || "";

    if (!file) {
      return NextResponse.json(
        { error: "No resume file was uploaded." },
        { status: 400 }
      );
    }

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Job title and job description are required." },
        { status: 400 }
      );
    }

    // 3. Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Upload to Cloudinary
    let fileUrl = "";
    try {
      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: "raw", 
            folder: "resumes",
            public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        ).end(buffer);
      });
      fileUrl = uploadResult.secure_url;
    } catch (uploadError: unknown) {
      console.error("Cloudinary Upload Error:", uploadError);
      const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
      return NextResponse.json(
        { error: "Failed to upload resume file to Cloudinary: " + errorMessage },
        { status: 500 }
      );
    }

    // 5. Store resume in database
    const [insertedResume] = await db
      .insert(resumesTable)
      .values({
        userId: dbUser.id,
        title: jobTitle ? `${file.name} - ${jobTitle}` : file.name,
        fileName: file.name,
        fileUrl: fileUrl,
      })
      .returning();

    // 6. Extract text content from the resume
    let resumeText = "";
    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        resumeText = new TextDecoder().decode(bytes);
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const parser = new pdfParse.PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        resumeText = pdfData.text;
      } else {
        // Fallback fallback: decode as text
        resumeText = new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes);
      }
    } catch (parseError: unknown) {
      console.error("File Parse Error:", parseError);
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      return NextResponse.json(
        { error: "Failed to parse resume text content: " + errorMessage },
        { status: 500 }
      );
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Could not extract any text from the uploaded file." },
        { status: 400 }
      );
    }

    // 7. Calculate ATS score and evaluation using Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured in the server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are an expert ATS (Applicant Tracking System) parser and technical recruiter.
Analyze the following candidate's resume text against the target job description details.

Target Job Details:
- Title: ${jobTitle}
- Type: ${jobType}
- Description:
${jobDescription}

Resume Text Content:
${resumeText}

Evaluate the match and return a JSON object with:
1. "score": An integer from 0 to 100 representing the ATS suitability match score.
2. "missingKeywords": An array of strings representing critical keywords, tools, or skills from the job description missing or underrepresented in the resume.
3. "suggestions": An array of strings representing specific, actionable suggestions/revisions to improve the resume match.
4. "feedback": A brief paragraph summarizing overall feedback.

Return only valid JSON.
`;

    let analysisResult;
    try {
      const response = await model.generateContent(prompt);
      const textResponse = response.response.text();
      analysisResult = JSON.parse(textResponse.trim());
    } catch (apiError: unknown) {
      console.error("Gemini API or Parse Error:", apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      return NextResponse.json(
        { error: "AI Evaluation failed: " + errorMessage },
        { status: 500 }
      );
    }

    // 8. Store ATS report in database
    const [insertedReport] = await db
      .insert(atsReportsTable)
      .values({
        userId: dbUser.id,
        resumeId: insertedResume.id,
        score: Number(analysisResult.score || 0),
        missingKeywords: JSON.stringify(analysisResult.missingKeywords || []),
        suggestions: JSON.stringify(analysisResult.suggestions || []),
      })
      .returning();

    if (applicationId) {
      await db
        .update(applicationsTable)
        .set({
          resumeId: insertedResume.id,
          atsReportId: insertedReport.id,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(applicationsTable.id, Number(applicationId)),
            eq(applicationsTable.userId, dbUser.id)
          )
        );
    }

    return NextResponse.json({
      reportId: insertedReport.id,
      resumeId: insertedResume.id,
      score: analysisResult.score,
      missingKeywords: analysisResult.missingKeywords || [],
      suggestions: analysisResult.suggestions || [],
      feedback: analysisResult.feedback || "",
      fileUrl: fileUrl
    });

  } catch (error: unknown) {
    console.error("ATS Calculator Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}
