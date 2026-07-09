"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Briefcase,
  FileCheck,
  FileText,
  TrendingUp,
  GitCommit,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  User,
  LayoutDashboard
} from "lucide-react";

// Define structures matching API responses
interface JobData {
  title: string;
  company: string;
  location: string | null;
}

interface Application {
  id: number;
  status: string;
  updatedAt: string;
  job: JobData;
  atsReportId?: number | null;
  coverLetterId?: number | null;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Greeting based on time of day
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      
      // Determine greeting
      const hrs = new Date().getHours();
      if (hrs < 12) setGreeting("Good morning");
      else if (hrs < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      // Fetch tracking stats
      fetch("/api/application-tracker")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setApplications(data);
          }
        })
        .catch((err) => console.error("Error loading tracker stats:", err))
        .finally(() => setLoading(false));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const firstName = user?.firstName || "Candidate";

  // Compute tracker stats
  const stats = {
    total: applications.filter(a => !a.status.includes("Archived")).length,
    saved: applications.filter(a => a.status === "Saved").length,
    applied: applications.filter(a => a.status === "Applied").length,
    interview: applications.filter(a => a.status === "Interview").length,
    offers: applications.filter(a => a.status === "Offer").length,
  };

  // Onboarding progress tasks check
  const hasSavedJob = applications.length > 0;
  const hasAtsChecked = applications.some(a => a.atsReportId !== null && a.atsReportId !== undefined);
  const hasCoverLetter = applications.some(a => a.coverLetterId !== null && a.coverLetterId !== undefined);
  const hasInterview = applications.some(a => a.status === "Interview");

  // Get recent activity (last 3 updated applications)
  const recentActivity = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Saved": return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
      case "Applied": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "Assessment": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Interview": return "text-violet-400 bg-violet-500/10 border-violet-500/20";
      case "HR": return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case "Offer": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Rejected": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-white bg-white/10 border-white/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#070712] text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Ambient background glows */}
      <div className="absolute top-[72px] left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[300px] right-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col space-y-10">
        
        {/* Welcome Header Profile Banner */}
        <div className="bg-gradient-to-r from-violet-950/15 via-white/[0.01] to-cyan-950/10 border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                className="w-16 h-16 rounded-2xl object-cover border border-violet-500/20 bg-white/5 shadow-lg shrink-0"
                alt="Profile picture"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 shadow-lg">
                <User className="w-8 h-8" />
              </div>
            )}
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold text-violet-400 bg-violet-500/5 border border-violet-500/10 mb-1 shadow-[0_0_15px_rgba(139,92,246,0.05)]">
                <Sparkles className="w-3 h-3 animate-pulse" /> Career Hub
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {greeting}, {firstName}!
              </h1>
              <p className="text-xs text-neutral-400 font-medium">
                Welcome back to your personalized AI Career Command Center. Let&apos;s prepare you for your next dream role.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 border-white/[0.05] pt-4 md:pt-0 w-full md:w-auto">
            <Link
              href="/visual-whiteboard"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 transition-all w-full md:w-auto justify-center"
            >
              Open Whiteboard Tracker
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dashboard Realtime Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b0b18]/85 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Saved Jobs</span>
            <h3 className="text-2xl font-black text-white mt-1.5">
              {loading ? (
                <div className="w-8 h-6 bg-white/5 rounded animate-pulse" />
              ) : stats.saved}
            </h3>
          </div>
          <div className="bg-[#0b0b18]/85 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400">Applications Sent</span>
            <h3 className="text-2xl font-black text-cyan-400 mt-1.5">
              {loading ? (
                <div className="w-8 h-6 bg-cyan-500/5 rounded animate-pulse" />
              ) : stats.applied}
            </h3>
          </div>
          <div className="bg-[#0b0b18]/85 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-violet-400">Interviews</span>
            <h3 className="text-2xl font-black text-violet-400 mt-1.5">
              {loading ? (
                <div className="w-8 h-6 bg-violet-500/5 rounded animate-pulse" />
              ) : stats.interview}
            </h3>
          </div>
          <div className="bg-[#0b0b18]/85 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">Offers Received</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1.5">
              {loading ? (
                <div className="w-8 h-6 bg-emerald-500/5 rounded animate-pulse" />
              ) : stats.offers}
            </h3>
          </div>
        </div>

        {/* Dynamic Split Layout: Core Tools Grid vs Checklist/Activity Side-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Showcased Features Cards Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-black text-white">AI Recruiting Toolkit</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Job Board */}
              <div className="group bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/30 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-violet-500/[0.02]">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">AI Job Board</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium mt-1">
                      Find, search, and parse real-time global jobs. Save direct matches straight into your application tracker with a single click.
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-[10px] font-bold text-neutral-500">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-violet-400" /> High salary filtering
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-violet-400" /> Save jobs directly to tracker
                    </li>
                  </ul>
                </div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-violet-400 hover:text-violet-300 transition-all pt-2"
                >
                  Explore Jobs <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 2: ATS Grader */}
              <div className="group bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/30 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-violet-500/[0.02]">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">ATS Resume Grader</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium mt-1">
                      Analyze resume compatibility. Gemini will scan keywords, calculate matching rate percentages, and suggest revisions to pass automated HR filters.
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-[10px] font-bold text-neutral-500">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" /> Scan missing keywords
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" /> Real-time feedback reports
                    </li>
                  </ul>
                </div>
                <Link
                  href="/ats-score"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 hover:text-cyan-300 transition-all pt-2"
                >
                  Scan Resume <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 3: Cover Letter Writer */}
              <div className="group bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/30 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-violet-500/[0.02]">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Cover Letter Builder</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium mt-1">
                      Generate high-impact cover letters in multiple tones (Direct, Persuasive, Longer, Shorter) tailored precisely to job roles. Download in PDF.
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-[10px] font-bold text-neutral-500">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" /> Direct & Persuasive modes
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" /> Multi-page PDF formatting
                    </li>
                  </ul>
                </div>
                <Link
                  href="/cover-letter"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-all pt-2"
                >
                  Draft Cover Letter <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 4: Industry Insights */}
              <div className="group bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/30 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-violet-500/[0.02]">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Industry Insights</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium mt-1">
                      Get a visual analytical summary of the current job market. Browse trending frameworks, tech stacks, salary distributions, and top articles.
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-[10px] font-bold text-neutral-500">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400" /> Interactive Recharts graph analytics
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400" /> Curated tech trend reports
                    </li>
                  </ul>
                </div>
                <Link
                  href="/industry-insights"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 hover:text-amber-300 transition-all pt-2"
                >
                  Market Trends <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Banner card 5: Whiteboard Tracker */}
            <div className="group bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/30 transition-all duration-300 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="space-y-3 max-w-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <GitCommit className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Visual whiteboard & kanban board</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  Connect saved jobs, ATS report scores, draft letters, and personal reminders. Track your progress pipeline flow visually using a single whiteboard layout.
                </p>
              </div>
              <Link
                href="/visual-whiteboard"
                className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl border border-white/[0.06] transition-all inline-flex items-center gap-1 shrink-0"
              >
                Launch Tracker
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>

          </div>

          {/* RIGHT: Checklist & Recent Activity widget panels */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Checklist panel */}
            <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" /> Onboarding Checklist
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1 font-semibold uppercase tracking-wider">
                  Complete these steps to prepare your pipeline
                </p>
              </div>

              <div className="space-y-4">
                
                <div className="flex items-start gap-3 text-xs">
                  {hasSavedJob ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-neutral-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold ${hasSavedJob ? "text-neutral-500 line-through" : "text-white"}`}>
                      Save a job listing
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed font-medium">
                      Browse jobs and click Save to create your first application folder.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  {hasAtsChecked ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-neutral-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold ${hasAtsChecked ? "text-neutral-500 line-through" : "text-white"}`}>
                      Grade your Resume
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed font-medium">
                      Grade resume against listing descriptions to check keyword fits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  {hasCoverLetter ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-neutral-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold ${hasCoverLetter ? "text-neutral-500 line-through" : "text-white"}`}>
                      Draft Cover Letter
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed font-medium">
                      Draft a custom Cover Letter tailored to your target company listing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  {hasInterview ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-neutral-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold ${hasInterview ? "text-neutral-500 line-through" : "text-white"}`}>
                      Schedule an interview
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed font-medium">
                      Move your application stage to Interview in the Board workspace.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Recent Activity panel */}
            <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" /> Recent Activity
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1 font-semibold uppercase tracking-wider">
                  Latest updates from your visual board
                </p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/[0.04] rounded-2xl">
                  <p className="text-xs text-neutral-500 font-bold">No recent activity detected.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl hover:border-violet-500/20 transition-all font-sans"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-white truncate">{activity.job.company}</p>
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">{activity.job.title}</p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
