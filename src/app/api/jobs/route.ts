import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface AdzunaJob {
  id: string | number;
  title: string;
  description: string;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
  };
  contract_time?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

const stripHtml = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role")?.trim() || "";
    const experience = searchParams.get("experience")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const employmentType = searchParams.get("employmentType")?.trim() || "";

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      console.warn("ADZUNA_APP_ID or ADZUNA_APP_KEY is missing from environment variables.");
      return NextResponse.json(
        { 
          error: "Missing credentials. Please configure ADZUNA_APP_ID and ADZUNA_APP_KEY in your .env file." 
        },
        { status: 400 }
      );
    }

    // Build the request parameters for Adzuna
    const country = "us"; // Default country
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
    
    url.searchParams.append("app_id", appId);
    url.searchParams.append("app_key", appKey);
    url.searchParams.append("results_per_page", "20");
    url.searchParams.append("content-type", "application/json");
    url.searchParams.append("category", "it-jobs");

    // Map role and experience filter into 'what' query parameter
    const whatParts = [];
    if (role) whatParts.push(role);
    if (experience && experience.toLowerCase() !== "all") {
      whatParts.push(experience);
    }
    if (whatParts.length > 0) {
      url.searchParams.append("what", whatParts.join(" "));
    }

    // Map location filter into 'where' query parameter
    if (location) {
      url.searchParams.append("where", location);
    }

    // Map employmentType filter
    if (employmentType && employmentType.toLowerCase() !== "all") {
      const typeLower = employmentType.toLowerCase();
      if (typeLower === "full-time") {
        url.searchParams.append("full_time", "1");
      } else if (typeLower === "part-time") {
        url.searchParams.append("part_time", "1");
      } else if (typeLower === "contract") {
        url.searchParams.append("contract", "1");
      } else if (typeLower === "remote") {
        // If they ask for remote, we also check if Adzuna has remote tags or put remote into search query
        url.searchParams.append("what_and", "remote");
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Adzuna API Error (${response.status}):`, errorText);
      throw new Error(`Adzuna API responded with status ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    // Map Adzuna schema to Frontend UI schema
    const mappedJobs = results.map((item: AdzunaJob) => {
      // Format salary range
      let salary = "Competitive";
      if (item.salary_min && item.salary_max) {
        salary = `$${Math.round(item.salary_min).toLocaleString()} - $${Math.round(item.salary_max).toLocaleString()}`;
      } else if (item.salary_min) {
        salary = `$${Math.round(item.salary_min).toLocaleString()}+`;
      }

      // Map employment type
      let type = "Full-time";
      if (item.contract_time === "part_time") {
        type = "Part-time";
      } else if (item.contract_type === "contract") {
        type = "Contract";
      }

      return {
        id: item.id,
        title: stripHtml(item.title),
        company: item.company?.display_name || "Unknown Company",
        location: item.location?.display_name || "Remote",
        employmentType: type,
        salary,
        description: stripHtml(item.description),
        applyUrl: item.redirect_url,
        source: "Adzuna",
        createdAt: item.created,
      };
    });

    return NextResponse.json(mappedJobs);
  } catch (error: unknown) {
    console.error("Error fetching jobs from Adzuna:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch jobs from API: " + errorMessage },
      { status: 500 }
    );
  }
}
