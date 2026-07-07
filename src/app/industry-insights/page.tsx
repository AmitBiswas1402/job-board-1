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
    <div className="min-h-screen bg-[#070712] text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Radial glows */}
      <div className="absolute top-[72px] left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-violet-400" />
              Industry Insights
            </h1>
            <p className="text-xs text-neutral-400 mt-1.5">
              Live market intelligence, localized salary brackets, hiring analytics, and tech breakdowns.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-violet-300 bg-violet-500/5 border border-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.05)]">
            <Sparkles className="w-3.5 h-3.5" />
            AI Grounded Market Intel
          </div>
        </div>

        {/* Search & Filters Section */}
        <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Role Search */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 flex items-center gap-1.5 ml-1">
                <Search className="w-3 h-3 text-neutral-400" /> Role
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
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all font-medium placeholder-neutral-600"
              />
            </div>

            {/* Location Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 flex items-center gap-1.5 ml-1">
                <MapPin className="w-3 h-3 text-neutral-400" /> Location
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => handleFilterChange(role, e.target.value, experience, employmentType)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 appearance-none cursor-pointer font-medium"
                >
                  <option value="India" className="bg-[#0b0b18] text-white">India</option>
                  <option value="USA" className="bg-[#0b0b18] text-white">USA</option>
                  <option value="Remote" className="bg-[#0b0b18] text-white">Remote</option>
                  <option value="UK" className="bg-[#0b0b18] text-white">United Kingdom</option>
                  <option value="Canada" className="bg-[#0b0b18] text-white">Canada</option>
                  <option value="Germany" className="bg-[#0b0b18] text-white">Germany</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[8px]">▼</div>
              </div>
            </div>

            {/* Experience Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 flex items-center gap-1.5 ml-1">
                <Clock className="w-3 h-3 text-neutral-400" /> Experience
              </label>
              <div className="relative">
                <select
                  value={experience}
                  onChange={(e) => handleFilterChange(role, location, e.target.value, employmentType)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 appearance-none cursor-pointer font-medium"
                >
                  <option value="0-2 Years" className="bg-[#0b0b18] text-white">Fresher (0-2 Years)</option>
                  <option value="3-5 Years" className="bg-[#0b0b18] text-white">Mid Level (3-5 Years)</option>
                  <option value="6-9 Years" className="bg-[#0b0b18] text-white">Senior (6-9 Years)</option>
                  <option value="10+ Years" className="bg-[#0b0b18] text-white">Lead/Staff (10+ Years)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[8px]">▼</div>
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 flex items-center gap-1.5 ml-1">
                <Layers className="w-3 h-3 text-neutral-400" /> Employment Type
              </label>
              <div className="relative">
                <select
                  value={employmentType}
                  onChange={(e) => handleFilterChange(role, location, experience, e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 appearance-none cursor-pointer font-medium"
                >
                  <option value="Full Time" className="bg-[#0b0b18] text-white">Full Time</option>
                  <option value="Part Time" className="bg-[#0b0b18] text-white">Part Time</option>
                  <option value="Contract" className="bg-[#0b0b18] text-white">Contract</option>
                  <option value="Internship" className="bg-[#0b0b18] text-white">Internship</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[8px]">▼</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Loading / Error State Block */}
        {error && (
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs text-rose-400 font-semibold">{error}</span>
          </div>
        )}

        {isPending ? (
          /* Loading Dashboard Skeleton */
          <div className="min-h-[500px] flex flex-col items-center justify-center bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-8 animate-pulse">
            <div className="w-10 h-10 rounded-full border border-violet-500/10 border-t-violet-500 animate-spin mb-4" />
            <h3 className="text-sm font-bold text-white mb-1">Retrieving Market Analytics</h3>
            <p className="text-xs text-neutral-400">Grounding localized data indexes for {role}...</p>
          </div>
        ) : insights ? (
          /* Main Dashboard layout */
          <div className="space-y-8 animate-scale-up">
            
            {/* Overview Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Average Salary */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">
                    Average Salary
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-violet-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mt-3">{insights.overview.averageSalary}</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full inline-block mt-2">
                  {insights.overview.salaryChange}
                </span>
              </div>

              {/* Card 2: Active Job Openings */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">
                    Active Openings
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mt-3">{insights.overview.activeJobs}</h3>
                <span className="text-[10px] font-bold text-neutral-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full inline-block mt-2">
                  Real-time indexed
                </span>
              </div>

              {/* Card 3: Hiring Trend */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">
                    Hiring Trend
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-emerald-400 mt-3">{insights.overview.hiringTrend}</h3>
                <span className="text-[10px] font-bold text-neutral-500 inline-block mt-2">
                  {insights.overview.hiringTrendSub}
                </span>
              </div>

              {/* Card 4: Top Hiring Company */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">
                    Top Recruiter
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mt-3">{insights.overview.topCompany}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <img
                    src={`https://logo.clearbit.com/${insights.overview.topCompanyLogo}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${insights.overview.topCompany}&background=8B5CF6&color=fff&size=32`;
                    }}
                    alt="Company logo"
                    className="w-4 h-4 rounded object-contain shrink-0 bg-white/5"
                  />
                  <span className="text-[10px] font-bold text-neutral-400">{insights.overview.topCompanyLogo}</span>
                </div>
              </div>

            </div>

            {/* Recharts Sections: Two Grid Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Salary Distribution Bar Chart */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Salary Distribution ({salarySuffix})
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.charts.salaryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="experience" stroke="#52525b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0b0b18", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
                        labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 11 }}
                        itemStyle={{ color: "#a78bfa", fontSize: 11 }}
                      />
                      <Bar dataKey="salary" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                        {insights.charts.salaryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? "#8b5cf6" : index === 1 ? "#a78bfa" : "#c084fc"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Hiring Demand over time Line Chart */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Hiring Demand Timeline (Openings)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={insights.charts.hiringTrend} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0b0b18", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
                        labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 11 }}
                        itemStyle={{ color: "#06b6d4", fontSize: 11 }}
                      />
                      <Line type="monotone" dataKey="openings" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4, stroke: "#0891b2", strokeWidth: 1 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Skills requested horizontal bar chart */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Most Requested Skills (%)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={insights.charts.skills} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#52525b" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0b0b18", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
                        labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 11 }}
                        itemStyle={{ color: "#10b981", fontSize: 11 }}
                      />
                      <Bar dataKey="percentage" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Top hiring cities */}
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Top Hiring Hubs (Openings)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={insights.charts.cities} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                      <XAxis type="number" stroke="#52525b" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0b0b18", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
                        labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 11 }}
                        itemStyle={{ color: "#f59e0b", fontSize: 11 }}
                      />
                      <Bar dataKey="jobs" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Trending Skills Section */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Trending Technologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.trendingSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 hover:border-violet-500/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                          <span className="text-base">{skill.icon}</span>
                          {skill.name}
                        </h4>
                        <span className="text-[10px] font-bold text-violet-300 bg-violet-500/5 border border-violet-500/10 px-2.5 py-0.5 rounded-full">
                          Demand: {skill.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Companies Section */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Top Hiring Companies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.topCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-4"
                  >
                    <img
                      src={`https://logo.clearbit.com/${company.logo}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${company.name}&background=06B6D4&color=fff&size=48`;
                      }}
                      alt={company.name}
                      className="w-12 h-12 rounded-xl object-contain bg-white/5 p-2 shrink-0 border border-white/[0.06]"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">{company.name}</h4>
                      <p className="text-[10px] font-bold text-neutral-400">
                        {company.openings} Active Openings
                      </p>
                      <p className="text-[10px] font-extrabold text-cyan-400">
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
              <div className="lg:col-span-8 bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Salary Breakdown by Role
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-neutral-500">
                        <th className="pb-3 font-extrabold uppercase">Target Role</th>
                        <th className="pb-3 font-extrabold uppercase text-right">Benchmarked Salary Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-neutral-300 font-medium">
                      {insights.salaryBreakdown.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3.5 text-white font-bold">{row.role}</td>
                          <td className="py-3.5 text-right text-emerald-400 font-black">{row.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Popular Tech Chips */}
              <div className="lg:col-span-4 bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Key Ecosystem Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.popularTech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs font-bold text-neutral-300 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/20 hover:text-white transition-all duration-300 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Latest Industry News Section */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Latest Industry News
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {insights.latestNews.map((news, i) => (
                  <div
                    key={i}
                    className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.2)] hover:border-violet-500/20 transition-all duration-300 flex flex-col group"
                  >
                    <div className="h-40 w-full overflow-hidden relative">
                      <img
                        src={news.thumbnail}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=640";
                        }}
                        alt="News thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070712]/90 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[9px] font-bold text-neutral-400 uppercase bg-[#0b0b18] px-2 py-0.5 rounded border border-white/5">
                        {news.source}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors">
                          {news.headline}
                        </h4>
                        <span className="text-[9px] text-neutral-500 font-medium block">
                          {news.time}
                        </span>
                      </div>

                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-2 rounded-xl text-[10px] font-bold text-white bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Market Summary Block */}
            <div className="bg-gradient-to-br from-violet-600/[0.05] via-[#0b0b18] to-cyan-500/[0.02] border border-violet-500/15 rounded-2xl p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.3)]">
              <h3 className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                Recruiter AI Market Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed font-semibold text-neutral-300">
                {insights.marketSummary.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Empty / Initial State (Should not show normally unless error) */
          <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-base font-bold text-white mb-1">No Insights Loaded</h3>
            <p className="text-xs text-neutral-400">Please adjust your search criteria or retry.</p>
          </div>
        )}

      </main>
    </div>
  );
}