/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useTransition } from "react";
import Navbar from "@/components/Navbar";
import {
  TrendingUp,
  Briefcase,
  Building2,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  DollarSign,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from "recharts";

interface OverviewData {
  averageSalary: string;
  salaryChange: string;
  activeJobs: string;
  hiringTrend: string;
  hiringTrendSub: string;
  topCompany: string;
  topCompanyLogo: string;
}

interface ChartSalary {
  experience: string;
  salary: number;
}

interface ChartHiring {
  month: string;
  openings: number;
}

interface ChartSkill {
  name: string;
  percentage: number;
}

interface ChartCity {
  name: string;
  jobs: number;
}

interface TrendingSkill {
  name: string;
  percentage: number;
  icon: string;
  description: string;
}

interface TopCompany {
  name: string;
  openings: number;
  salary: string;
  logo: string;
}

interface SalaryBreakdown {
  role: string;
  range: string;
}

interface IndustryNews {
  thumbnail: string;
  headline: string;
  source: string;
  time: string;
  url: string;
}

interface InsightsData {
  overview: OverviewData;
  charts: {
    salaryDistribution: ChartSalary[];
    hiringTrend: ChartHiring[];
    skills: ChartSkill[];
    cities: ChartCity[];
  };
  trendingSkills: TrendingSkill[];
  topCompanies: TopCompany[];
  salaryBreakdown: SalaryBreakdown[];
  popularTech: string[];
  latestNews: IndustryNews[];
  marketSummary: string[];
}

export default function IndustryInsightsPage() {
  const [mounted, setMounted] = useState(false);
  
  // Search Filter States
  const [role, setRole] = useState("Frontend Developer");
  const [location, setLocation] = useState("India");
  const [experience, setExperience] = useState("0-2 Years");
  const [employmentType, setEmploymentType] = useState("Full Time");

  const isIndia = location.toLowerCase().includes("india") || location.toLowerCase().includes("in");
  const salarySuffix = isIndia ? "LPA" : "k/yr";

  // Insights State
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const fetchInsights = (
    currentRole: string,
    currentLoc: string,
    currentExp: string,
    currentEmp: string
  ) => {
    startTransition(async () => {
      try {
        setError(null);
        const res = await fetch("/api/industry-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: currentRole.trim(),
            location: currentLoc,
            experience: currentExp,
            employmentType: currentEmp,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch market insights.");
        }

        setInsights(data);
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || "An unexpected error occurred.");
      }
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchInsights(role, location, experience, employmentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (
    newRole: string,
    newLoc: string,
    newExp: string,
    newEmp: string
  ) => {
    setRole(newRole);
    setLocation(newLoc);
    setExperience(newExp);
    setEmploymentType(newEmp);
    fetchInsights(newRole, newLoc, newExp, newEmp);
  };

  if (!mounted) {
    return null; // Hydration guard
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <div className="vertex-container">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 animate-vertex-fade-in">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <TrendingUp className="size-8 text-muted-foreground" />
                Industry Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Live market intelligence, localized salary brackets, hiring analytics, and tech breakdowns.
              </p>
            </div>
            <div className="vertex-badge">
              <Sparkles className="size-3.5" />
              AI Grounded Market Intel
            </div>
          </div>

          {/* Search & Filters Section */}
          <div className="vertex-card p-5 animate-vertex-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Role Search */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 ml-1">
                  <Search className="size-3" /> Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onBlur={() => handleFilterChange(role, location, experience, employmentType)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilterChange(role, location, experience, employmentType);
                    }
                  }}
                  placeholder="e.g. Frontend Developer"
                  className="vertex-input"
                />
              </div>

              {/* Location Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 ml-1">
                  <MapPin className="size-3" /> Location
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => handleFilterChange(role, e.target.value, experience, employmentType)}
                    className="vertex-input appearance-none cursor-pointer"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="Remote">Remote</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Experience Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 ml-1">
                  <Clock className="size-3" /> Experience
                </label>
                <div className="relative">
                  <select
                    value={experience}
                    onChange={(e) => handleFilterChange(role, location, e.target.value, employmentType)}
                    className="vertex-input appearance-none cursor-pointer"
                  >
                    <option value="0-2 Years">Fresher (0-2 Years)</option>
                    <option value="3-5 Years">Mid Level (3-5 Years)</option>
                    <option value="6-9 Years">Senior (6-9 Years)</option>
                    <option value="10+ Years">Lead/Staff (10+ Years)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 ml-1">
                  <Layers className="size-3" /> Employment Type
                </label>
                <div className="relative">
                  <select
                    value={employmentType}
                    onChange={(e) => handleFilterChange(role, location, experience, e.target.value)}
                    className="vertex-input appearance-none cursor-pointer"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Loading / Error State Block */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="size-5 text-destructive shrink-0" />
              <span className="text-xs text-destructive font-medium">{error}</span>
            </div>
          )}

          {isPending ? (
            /* Loading Dashboard Skeleton */
            <div className="min-h-[500px] flex flex-col items-center justify-center vertex-card p-8 animate-pulse">
              <div className="size-10 rounded-full border-2 border-border border-t-foreground animate-spin mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Retrieving Market Analytics</h3>
              <p className="text-xs text-muted-foreground">Grounding localized data indexes for {role}...</p>
            </div>
          ) : insights ? (
            /* Main Dashboard layout */
            <div className="space-y-8 animate-vertex-slide-up">
              
              {/* Overview Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Average Salary */}
                <div className="vertex-card p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Average Salary
                    </span>
                    <div className="size-7 rounded-lg bg-muted border flex items-center justify-center text-muted-foreground">
                      <DollarSign className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mt-3">{insights.overview.averageSalary}</h3>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-2">
                    {insights.overview.salaryChange}
                  </span>
                </div>

                {/* Card 2: Active Job Openings */}
                <div className="vertex-card p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Active Openings
                    </span>
                    <div className="size-7 rounded-lg bg-muted border flex items-center justify-center text-muted-foreground">
                      <Briefcase className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mt-3">{insights.overview.activeJobs}</h3>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted border px-2 py-0.5 rounded-full inline-block mt-2">
                    Real-time indexed
                  </span>
                </div>

                {/* Card 3: Hiring Trend */}
                <div className="vertex-card p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Hiring Trend
                    </span>
                    <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-3">{insights.overview.hiringTrend}</h3>
                  <span className="text-[10px] font-medium text-muted-foreground inline-block mt-2">
                    {insights.overview.hiringTrendSub}
                  </span>
                </div>

                {/* Card 4: Top Hiring Company */}
                <div className="vertex-card p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Top Recruiter
                    </span>
                    <div className="size-7 rounded-lg bg-muted border flex items-center justify-center text-muted-foreground">
                      <Building2 className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mt-3">{insights.overview.topCompany}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <img
                      src={`https://logo.clearbit.com/${insights.overview.topCompanyLogo}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${insights.overview.topCompany}&background=e2e8f0&color=475569&size=32`;
                      }}
                      alt="Company logo"
                      className="size-4 rounded object-contain shrink-0 bg-muted border"
                    />
                    <span className="text-[10px] font-medium text-muted-foreground">{insights.overview.topCompanyLogo}</span>
                  </div>
                </div>

              </div>

              {/* Recharts Sections: Two Grid Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Salary Distribution Bar Chart */}
                <div className="vertex-card p-5 md:p-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Salary Distribution ({salarySuffix})
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insights.charts.salaryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                        <XAxis dataKey="experience" stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} />
                        <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                          labelStyle={{ color: "var(--foreground)", fontWeight: "bold", fontSize: 11 }}
                          itemStyle={{ color: "var(--foreground)", fontSize: 11 }}
                        />
                        <Bar dataKey="salary" fill="#10b981" radius={[4, 4, 0, 0]}>
                          {insights.charts.salaryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 2 ? "#10b981" : index === 1 ? "#34d399" : "#6ee7b7"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Hiring Demand over time Line Chart */}
                <div className="vertex-card p-5 md:p-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Hiring Demand Timeline (Openings)
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={insights.charts.hiringTrend} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                        <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} />
                        <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                          labelStyle={{ color: "var(--foreground)", fontWeight: "bold", fontSize: 11 }}
                          itemStyle={{ color: "#10b981", fontSize: 11 }}
                        />
                        <Line type="monotone" dataKey="openings" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, stroke: "#059669", strokeWidth: 1 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Skills requested horizontal bar chart */}
                <div className="vertex-card p-5 md:p-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Most Requested Skills (%)
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={insights.charts.skills} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                          labelStyle={{ color: "var(--foreground)", fontWeight: "bold", fontSize: 11 }}
                          itemStyle={{ color: "#10b981", fontSize: 11 }}
                        />
                        <Bar dataKey="percentage" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 4: Top hiring cities */}
                <div className="vertex-card p-5 md:p-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Top Hiring Hubs (Openings)
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={insights.charts.cities} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" horizontal={false} />
                        <XAxis type="number" stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke="currentColor" className="text-muted-foreground" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                          labelStyle={{ color: "var(--foreground)", fontWeight: "bold", fontSize: 11 }}
                          itemStyle={{ color: "#10b981", fontSize: 11 }}
                        />
                        <Bar dataKey="jobs" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Trending Skills Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  Trending Technologies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.trendingSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="vertex-card p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            <span className="text-base">{skill.icon}</span>
                            {skill.name}
                          </h4>
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            Demand: {skill.percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Companies Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  Top Hiring Companies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.topCompanies.map((company, index) => (
                    <div
                      key={index}
                      className="vertex-card p-5 flex items-center gap-4"
                    >
                      <img
                        src={`https://logo.clearbit.com/${company.logo}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${company.name}&background=f1f5f9&color=475569&size=48`;
                        }}
                        alt={company.name}
                        className="size-12 rounded-xl object-contain bg-muted p-2 shrink-0 border"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-foreground">{company.name}</h4>
                        <p className="text-[10px] font-medium text-muted-foreground">
                          {company.openings} Active Openings
                        </p>
                        <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Average: {company.salary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table and Tech Chips Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Salary Breakdown Table */}
                <div className="lg:col-span-8 vertex-card p-5 md:p-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Salary Breakdown by Role
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="pb-3 font-semibold uppercase">Target Role</th>
                          <th className="pb-3 font-semibold uppercase text-right">Benchmarked Salary Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-foreground/80 font-medium">
                        {insights.salaryBreakdown.map((row, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3.5 text-foreground font-semibold">{row.role}</td>
                            <td className="py-3.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">{row.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Popular Tech Chips */}
                <div className="lg:col-span-4 vertex-card p-5 md:p-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Key Ecosystem Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.popularTech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted border rounded-xl hover:text-foreground hover:border-foreground/30 transition-all duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Latest Industry News Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  Latest Industry News
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {insights.latestNews.map((news, i) => (
                    <div
                      key={i}
                      className="vertex-card overflow-hidden flex flex-col group"
                    >
                      <div className="h-40 w-full overflow-hidden relative border-b">
                        <img
                          src={news.thumbnail}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=640";
                          }}
                          alt="News thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-[9px] font-semibold text-muted-foreground uppercase bg-card px-2 py-0.5 rounded border">
                          {news.source}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-foreground/80 transition-colors">
                            {news.headline}
                          </h4>
                          <span className="text-[9px] text-muted-foreground font-medium block">
                            {news.time}
                          </span>
                        </div>

                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-2 vertex-outline rounded-lg text-[10px] font-medium"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Market Summary Block */}
              <div className="vertex-card p-5 md:p-6 border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/[0.02]">
                <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Sparkles className="size-4 animate-pulse" />
                  Recruiter AI Market Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-foreground/80">
                  {insights.marketSummary.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2.5 rounded-lg border bg-card"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Empty / Initial State (Should not show normally unless error) */
            <div className="vertex-card p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-base font-semibold text-foreground mb-1">No Insights Loaded</h3>
              <p className="text-xs text-muted-foreground">Please adjust your search criteria or retry.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}