import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { resend } from "@/lib/resend";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Verify authenticated Clerk session
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const clerkUser = await currentUser();
    const userEmail = clerkUser?.emailAddresses[0]?.emailAddress || "";
    const fullName = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "User";

    // 2. Parse request payload
    let payload;
    try {
      payload = await request.json();
    } catch {
      payload = {};
    }

    const role = payload.role || "Frontend Developer";
    const location = payload.location || "India";
    const experience = payload.experience || "0-2 Years";
    const employmentType = payload.employmentType || "Full Time";

    // 3. Setup Gemini API
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

    const isIndia = location.toLowerCase().includes("india") || location.toLowerCase().includes("in");
    const currencySymbol = isIndia ? "₹" : "$";
    const salarySuffix = isIndia ? "LPA" : "k/yr";

    const prompt = `
You are an expert technical recruiter and industry research analyst.
Synthesize realistic, highly-informed, localized market analysis and insights data for the following search filter parameters:

- Role: ${role}
- Location: ${location}
- Experience Level: ${experience}
- Employment Type: ${employmentType}

Generate data that fits the target region (especially currency styling: use ${currencySymbol} and ${salarySuffix} prefix/suffix as appropriate).

Return a JSON object conforming exactly to this structure:
{
  "overview": {
    "averageSalary": "The average salary (e.g. ${currencySymbol}12 ${salarySuffix})",
    "salaryChange": "Percentage comparison (e.g. +8% compared to last month)",
    "activeJobs": "Number of job openings (e.g. 2,450 Jobs)",
    "hiringTrend": "Percentage growth indicator (e.g. ↑ 18%)",
    "hiringTrendSub": "Comparison baseline (e.g. Compared to previous month)",
    "topCompany": "Representative top hiring firm in target location",
    "topCompanyLogo": "Company domain name (e.g. google.com, stripe.com, vercel.com)"
  },
  "charts": {
    "salaryDistribution": [
      { "experience": "Fresher", "salary": number representing LPA or thousands USD (e.g. 6) },
      { "experience": "Mid Level", "salary": number (e.g. 14) },
      { "experience": "Senior", "salary": number (e.g. 28) }
    ],
    "hiringTrend": [
      { "month": "Jan", "openings": number },
      { "month": "Feb", "openings": number },
      { "month": "Mar", "openings": number },
      { "month": "Apr", "openings": number },
      { "month": "May", "openings": number },
      { "month": "Jun", "openings": number }
    ],
    "skills": [
      { "name": "Skill 1", "percentage": number (out of 100) },
      { "name": "Skill 2", "percentage": number },
      { "name": "Skill 3", "percentage": number },
      { "name": "Skill 4", "percentage": number },
      { "name": "Skill 5", "percentage": number },
      { "name": "Skill 6", "percentage": number }
    ],
    "cities": [
      { "name": "City 1", "jobs": number },
      { "name": "City 2", "jobs": number },
      { "name": "City 3", "jobs": number },
      { "name": "Remote", "jobs": number },
      { "name": "City 4", "jobs": number }
    ]
  },
  "trendingSkills": [
    {
      "name": "Skill Name 1",
      "percentage": number,
      "icon": "Emoji representation (e.g. 🔥)",
      "description": "Short explanation of the trend"
    },
    { "name": "Skill Name 2", "percentage": number, "icon": "🚀", "description": "Short explanation" },
    { "name": "Skill Name 3", "percentage": number, "icon": "⚡", "description": "Short explanation" }
  ],
  "topCompanies": [
    {
      "name": "Company Name 1",
      "openings": number,
      "salary": "Salary string (e.g. ${currencySymbol}24 ${salarySuffix})",
      "logo": "Domain name (e.g. google.com)"
    },
    {
      "name": "Company Name 2",
      "openings": number,
      "salary": "Salary string (e.g. ${currencySymbol}18 ${salarySuffix})",
      "logo": "stripe.com"
    },
    {
      "name": "Company Name 3",
      "openings": number,
      "salary": "Salary string (e.g. ${currencySymbol}20 ${salarySuffix})",
      "logo": "vercel.com"
    }
  ],
  "salaryBreakdown": [
    { "role": "Frontend Developer", "range": "LPA/USD range" },
    { "role": "Backend Developer", "range": "LPA/USD range" },
    { "role": "Full Stack Developer", "range": "LPA/USD range" },
    { "role": "AI Engineer", "range": "LPA/USD range" },
    { "role": "DevOps Engineer", "range": "LPA/USD range" }
  ],
  "popularTech": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9", "Skill 10"],
  "latestNews": [
    {
      "thumbnail": "High-quality topic-relevant unsplash image URL",
      "headline": "Trending headline relating to this role's ecosystem",
      "source": "E.g. TechCrunch, VentureBeat, InfoQ",
      "time": "Relative timeline e.g. 2 days ago",
      "url": "Relevant website URL"
    },
    { "thumbnail": "Unsplash URL", "headline": "Headline", "source": "Source", "time": "Time", "url": "URL" },
    { "thumbnail": "Unsplash URL", "headline": "Headline", "source": "Source", "time": "Time", "url": "URL" },
    { "thumbnail": "Unsplash URL", "headline": "Headline", "source": "Source", "time": "Time", "url": "URL" }
  ],
  "marketSummary": [
    "Market summary point 1 based on role and location",
    "Market summary point 2",
    "Market summary point 3",
    "Market summary point 4",
    "Market summary point 5",
    "Market summary point 6"
  ]
}

Return ONLY the raw JSON object. Do not format with markdown blocks.
`;

    try {
      const response = await model.generateContent(prompt);
      const textResponse = response.response.text();
      const insights = JSON.parse(textResponse.trim());

      // Send email using Resend
      try {
        if (userEmail) {
          const overview = insights.overview || {};
          const marketSummary = insights.marketSummary || [];
          const summaryListItems = marketSummary
            .map((point: string) => `<li>${point}</li>`)
            .join("");

          await resend.emails.send({
            from: "JobBoard <onboarding@resend.dev>",
            to: [userEmail],
            subject: `Industry Insights: ${role} in ${location}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2>Industry Insights Report</h2>
                <p>Hi ${fullName},</p>
                <p>Here is your localized market analysis and insights summary report for <strong>${role}</strong> in <strong>${location}</strong> (${experience}, ${employmentType}).</p>
                
                <div style="background-color: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="margin-top: 0; color: #0070f3;">Market Overview</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold; width: 40%;">Average Salary:</td>
                      <td style="padding: 6px 0;">${overview.averageSalary || "N/A"} (${overview.salaryChange || "N/A"})</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">Active Jobs:</td>
                      <td style="padding: 6px 0;">${overview.activeJobs || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">Hiring Trend:</td>
                      <td style="padding: 6px 0;">${overview.hiringTrend || "N/A"} (${overview.hiringTrendSub || "N/A"})</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">Top Hiring Company:</td>
                      <td style="padding: 6px 0;">${overview.topCompany || "N/A"}</td>
                    </tr>
                  </table>
                </div>

                ${summaryListItems ? `
                  <h3>Key Market Takeaways</h3>
                  <ul>${summaryListItems}</ul>
                ` : ""}
                
                <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                <p style="font-size: 12px; color: #888;">This report was generated using real-time AI market synthesis on your Job Board dashboard.</p>
              </div>
            `
          });
        }
      } catch (emailError) {
        console.error("Failed to send industry insights email:", emailError);
      }
      
      return NextResponse.json(insights);
    } catch (apiError: unknown) {
      console.error("Gemini API or JSON Parse Error:", apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      return NextResponse.json(
        { error: "AI Synthesis failed: " + errorMessage },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Industry Insights Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}
