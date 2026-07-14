import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/index";
import { usersTable, coverLettersTable, applicationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "node:module";

const requireShim = createRequire(import.meta.url);
const pdfParse = requireShim("pdf-parse");

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
    const approach = formData.get("approach") as string || "Direct";
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

    // 4. Extract text content from the resume
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

    // 5. Generate cover letter using Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured in the server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Determine constraints by approach
    let tonePrompt = "";
    switch (approach) {
      case "Longer":
        tonePrompt = "Write a comprehensive and highly detailed cover letter. Fully elaborate on matching projects, details, and achievements. Keep the response word count under 400 words.";
        break;
      case "Shorter":
        tonePrompt = "Write a highly concise, bulleted and punchy cover letter. Focus on a brief summary of top achievements and a quick call-to-action. Keep it around 200 words.";
        break;
      case "Persuasive":
        tonePrompt = "Write an enthusiastic and highly engaging narrative-style cover letter. Emphasize how your background aligns with the company's mission and values. Keep it around 300 words.";
        break;
      case "Direct":
      default:
        tonePrompt = "Write a straightforward, clear, and professional cover letter that directly maps your matching technical skills and experiences to the job description bullet points. Keep it around 250 words.";
        break;
    }

    const prompt = `
You are a professional recruiter and career coach.
Using the candidate's resume and the target job description details, write a professional cover letter.

Target Job Details:
- Title: ${jobTitle}
- Description:
${jobDescription}

Resume Text Content:
${resumeText}

Approach Guidelines:
${tonePrompt}

Additional Instructions:
- Highlight matching skills and experiences from the resume.
- Do not invent experience or add qualifications that are not present in the resume.
- Maintain a highly professional and standard layout (including salutation, body paragraphs, and sign-off).
- Output the cover letter text directly. Do not add markdown backticks (like \`\`\`), code block tags, or conversational intro/outro text.
`;

    try {
      const response = await model.generateContent(prompt);
      const textResponse = response.response.text();
      
      // Clean up any markdown code block formatting if returned by mistake
      const coverLetter = textResponse.trim().replace(/^```[a-zA-Z]*\s*|```$/g, "");

      // Resolve jobId from application if applicationId is provided
      let linkedJobId: number | null = null;
      if (applicationId) {
        const [app] = await db
          .select()
          .from(applicationsTable)
          .where(
            and(
              eq(applicationsTable.id, Number(applicationId)),
              eq(applicationsTable.userId, dbUser.id)
            )
          )
          .limit(1);
        if (app) {
          linkedJobId = app.jobId;
        }
      }

      // Store cover letter in database
      const [insertedLetter] = await db
        .insert(coverLettersTable)
        .values({
          userId: dbUser.id,
          jobId: linkedJobId,
          title: jobTitle ? `${jobTitle} Cover Letter` : "Cover Letter",
          content: coverLetter,
        })
        .returning();

      // Link to application if provided
      if (applicationId) {
        await db
          .update(applicationsTable)
          .set({
            coverLetterId: insertedLetter.id,
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
        coverLetter,
        coverLetterId: insertedLetter.id
      });
    } catch (apiError: unknown) {
      console.error("Gemini API Error:", apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      return NextResponse.json(
        { error: "AI Cover Letter generation failed: " + errorMessage },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("Cover Letter Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}
