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
  ArrowDown,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  User,
  LayoutDashboard,
  Bookmark,
  Send,
  Users,
  Trophy,
  ClipboardCheck,
  Activity
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
      case "Saved": return "text-muted-foreground bg-muted";
      case "Applied": return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10";
      case "Assessment": return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10";
      case "Interview": return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10";
      case "HR": return "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10";
      case "Offer": return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10";
      case "Rejected": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const statCards = [
    {
      label: "Saved Jobs",
      value: stats.saved,
      color: "text-foreground",
      icon: Bookmark,
      iconColor: "text-muted-foreground",
      hint: "Awaiting your next move",
    },
    {
      label: "Applications",
      value: stats.applied,
      color: "text-blue-600 dark:text-blue-400",
      icon: Send,
      iconColor: "text-blue-500",
      hint: "Out to employers",
    },
    {
      label: "Interviews",
      value: stats.interview,
      color: "text-violet-600 dark:text-violet-400",
      icon: Users,
      iconColor: "text-violet-500",
      hint: "Scheduled or in progress",
    },
    {
      label: "Offers",
      value: stats.offers,
      color: "text-emerald-600 dark:text-emerald-400",
      icon: Trophy,
      iconColor: "text-emerald-500",
      hint: "Celebrate & negotiate",
    },
  ];

  const featureCards = [
    {
      icon: Briefcase,
      title: "AI Job Board",
      description: "Find, search, and parse real-time global jobs. Save direct matches straight into your application tracker.",
      features: ["High salary filtering", "Save jobs directly to tracker"],
      href: "/jobs",
      linkText: "Explore Jobs",
      accent: "text-foreground",
      iconBg: "bg-foreground/5",
    },
    {
      icon: FileCheck,
      title: "ATS Resume Grader",
      description: "Analyze resume compatibility. Gemini will scan keywords, calculate matching percentages, and suggest revisions.",
      features: ["Scan missing keywords", "Real-time feedback reports"],
      href: "/ats-score",
      linkText: "Scan Resume",
      accent: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    {
      icon: FileText,
      title: "Cover Letter Builder",
      description: "Generate high-impact cover letters in multiple tones tailored precisely to job roles. Download in PDF.",
      features: ["Direct & Persuasive modes", "Multi-page PDF formatting"],
      href: "/cover-letter",
      linkText: "Draft Cover Letter",
      accent: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: TrendingUp,
      title: "Industry Insights",
      description: "Get visual analytical summaries of the current job market. Browse trending frameworks, salaries, and articles.",
      features: ["Interactive chart analytics", "Curated tech trend reports"],
      href: "/industry-insights",
      linkText: "Market Trends",
      accent: "text-foreground",
      iconBg: "bg-foreground/5",
    },
  ];

  const checklistItems = [
    { done: hasSavedJob, title: "Save a job listing", desc: "Browse jobs and click Save to create your first application folder." },
    { done: hasAtsChecked, title: "Grade your Resume", desc: "Grade resume against listing descriptions to check keyword fits." },
    { done: hasCoverLetter, title: "Draft Cover Letter", desc: "Draft a custom Cover Letter tailored to your target company listing." },
    { done: hasInterview, title: "Schedule an interview", desc: "Move your application stage to Interview in the Board workspace." },
  ];

  const checklistDone = checklistItems.filter((item) => item.done).length;
  const checklistPct = Math.round((checklistDone / checklistItems.length) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="vertex-container">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14 space-y-10">
          
          {/* Welcome Header */}
          <div className="animate-vertex-fade-in">
            <div className="group vertex-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative">
              {/* Decorative accent */}
              <div className="absolute -top-24 -right-24 size-72 rounded-full bg-violet-500/6 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-5 relative">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className="size-14 rounded-2xl object-cover border shrink-0"
                    alt="Profile picture"
                  />
                ) : (
                  <div className="size-14 rounded-2xl bg-violet-500/10 border flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                    <User className="size-7" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                    <Sparkles className="size-3" /> Career Hub
                  </span>
                  <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                    {greeting}, {firstName}!
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back to your personalized AI Career Command Center.
                  </p>
                </div>
              </div>

              <Link
                href="/visual-whiteboard"
                className="vertex-cta inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
              >
                Open Tracker
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-vertex-slide-up">
            {statCards.map((stat) => (
              <div key={stat.label} className="vertex-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{stat.label}</span>
                    <div className="size-8 rounded-xl bg-foreground/5 flex items-center justify-center">
                      <stat.icon className={`size-4 ${stat.iconColor}`} />
                    </div>
                  </div>
                <h3 className={`text-3xl font-semibold mt-2 ${stat.color}`}>
                  {loading ? (
                    <div className="w-10 h-7 bg-muted rounded animate-pulse" />
                  ) : stat.value}
                </h3>
                <span className="text-[10px] font-medium text-muted-foreground mt-1 block">{stat.hint}</span>
              </div>
            ))}
          </div>

          {/* Split Layout: Features + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-vertex-slide-up-delay">
            
            {/* LEFT: Feature Cards */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <LayoutDashboard className="size-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">AI Recruiting Toolkit</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featureCards.map((card) => (
                  <div key={card.title} className="group vertex-card vertex-card-hover p-6 flex flex-col justify-between space-y-5 hover:-translate-y-0.5 hover:border-foreground/20 transition-all duration-300">
                    <div className="space-y-4">
                      <div className={`size-11 rounded-2xl ${card.iconBg} flex items-center justify-center ${card.accent} group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                          {card.description}
                        </p>
                      </div>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {card.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={card.href}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.accent} hover:underline underline-offset-4 pt-2`}
                    >
                      {card.linkText} <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Application Tracker Banner */}
              <div className="group vertex-card vertex-card-hover p-7 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 overflow-hidden relative">

                {/* Decorative accent */}
                <div className="absolute -top-24 -right-24 size-72 rounded-full bg-violet-500/[0.07] blur-3xl pointer-events-none" />

                {/* Left Content */}
                <div className="max-w-2xl space-y-5 relative">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                      <GitCommit className="size-6" />
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                        Application Workspace
                      </span>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                        Application Tracker
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track every application from <span className="font-medium text-foreground">Saved</span> to{" "}
                        <span className="font-medium text-foreground">Offer</span>.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    Every saved job becomes an application workspace where you can organize
                    resumes, ATS reports, cover letters, personal notes, recruiter updates,
                    and monitor your hiring progress through a visual Kanban board.
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Saved Jobs
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> ATS Reports
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Cover Letters
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Personal Notes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Kanban Workflow
                    </span>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex flex-col items-start lg:items-end gap-4 relative">
                  <div className="rounded-2xl border border-hairline bg-surface-soft p-4 w-full lg:w-72">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                      Workflow
                    </p>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-foreground/5 flex items-center justify-center">
                          <Bookmark className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">Saved</span>
                      </div>

                      <ArrowDown className="size-3.5 text-muted-foreground ml-6" />

                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Send className="size-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-foreground">Applied</span>
                      </div>

                      <ArrowDown className="size-3.5 text-muted-foreground ml-6" />

                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <Users className="size-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="font-medium text-foreground">Interview</span>
                      </div>

                      <ArrowDown className="size-3.5 text-muted-foreground ml-6" />

                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Trophy className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-foreground">Offer</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/visual-whiteboard"
                    className="vertex-cta inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                  >
                    Open Application Tracker
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

              </div>
            </div>

            {/* RIGHT: Sidebar Panels */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Checklist Panel */}
              <div className="vertex-card p-5 md:p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                    <ClipboardCheck className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Onboarding Checklist</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Complete these steps to prepare your pipeline
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground mb-1.5">
                    <span>{checklistDone} of {checklistItems.length} completed</span>
                    <span>{checklistPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${checklistPct}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {checklistItems.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 text-xs">
                      {item.done ? (
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="size-4 rounded-full border-2 border-border shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {item.title}
                        </p>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Panel */}
              <div className="vertex-card p-5 md:p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Activity className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Latest updates from your visual board
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    <div className="h-12 bg-muted rounded-xl animate-pulse" />
                    <div className="h-12 bg-muted rounded-xl animate-pulse" />
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed rounded-xl">
                    <p className="text-xs text-muted-foreground font-medium">No recent activity detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-center p-3 rounded-xl border border-hairline bg-surface-soft hover:shadow-sm hover:border-foreground/20 transition-all"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-medium text-foreground truncate">{activity.job.company}</p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{activity.job.title}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
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
    </div>
  );
}
