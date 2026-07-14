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
    { label: "Saved Jobs", value: stats.saved, color: "text-foreground" },
    { label: "Applications", value: stats.applied, color: "text-blue-600 dark:text-blue-400" },
    { label: "Interviews", value: stats.interview, color: "text-purple-600 dark:text-purple-400" },
    { label: "Offers", value: stats.offers, color: "text-emerald-600 dark:text-emerald-400" },
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="vertex-container">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14 space-y-10">
          
          {/* Welcome Header */}
          <div className="animate-vertex-fade-in">
            <div className="vertex-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className="size-14 rounded-xl object-cover border shrink-0"
                    alt="Profile picture"
                  />
                ) : (
                  <div className="size-14 rounded-xl bg-muted border flex items-center justify-center text-muted-foreground shrink-0">
                    <User className="size-7" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="vertex-badge mb-1">
                    <Sparkles className="size-3" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Career Hub</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                    {greeting}, {firstName}!
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back to your personalized AI Career Command Center.
                  </p>
                </div>
              </div>

              <Link
                href="/visual-whiteboard"
                className="vertex-cta inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg"
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
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <h3 className={`text-2xl font-semibold mt-1.5 ${stat.color}`}>
                  {loading ? (
                    <div className="w-8 h-6 bg-muted rounded animate-pulse" />
                  ) : stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Split Layout: Features + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-vertex-slide-up-delay">
            
            {/* LEFT: Feature Cards */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="size-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">AI Recruiting Toolkit</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featureCards.map((card) => (
                  <div key={card.title} className="group vertex-card p-6 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className={`size-10 rounded-xl ${card.iconBg} flex items-center justify-center ${card.accent} group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                          {card.description}
                        </p>
                      </div>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {card.features.map((f) => (
                          <li key={f} className="flex items-center gap-1.5">
                            <span className="size-1 rounded-full bg-emerald-500" />
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

              {/* Banner: Whiteboard Tracker */}
              <div className="group vertex-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3 max-w-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-foreground/5 flex items-center justify-center text-muted-foreground">
                      <GitCommit className="size-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Visual Whiteboard & Kanban Board</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Connect saved jobs, ATS report scores, draft letters, and personal reminders. Track your progress pipeline flow visually using a single whiteboard layout.
                  </p>
                </div>
                <Link
                  href="/visual-whiteboard"
                  className="vertex-outline inline-flex items-center gap-1 text-xs font-medium px-4 py-2.5 rounded-lg shrink-0"
                >
                  Launch Tracker
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* RIGHT: Sidebar Panels */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Checklist Panel */}
              <div className="vertex-card p-5 md:p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" /> Onboarding Checklist
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete these steps to prepare your pipeline
                  </p>
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
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" /> Recent Activity
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Latest updates from your visual board
                  </p>
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
                        className="flex justify-between items-center p-3 rounded-xl border hover:shadow-sm transition-shadow"
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
