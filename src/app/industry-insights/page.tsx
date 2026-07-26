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
  AlertCircle,
  MessageSquare,
  Repeat,
  Heart,
  ExternalLink,
  ChevronRight
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

interface TrendingTweet {
  author: string;
  handle: string;
  content: string;
  likes: string;
  retweets: string;
  time: string;
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
  trendingTweets: TrendingTweet[];
  marketSummary: string[];
}

export default function IndustryInsightsPage() {
  const [mounted, setMounted] = useState(false);
  
  // Specific Tech Search State (Pre-filled with React)
  const [searchQuery, setSearchQuery] = useState("React");
  const [location, setLocation] = useState("USA");
  const [experience, setExperience] = useState("3-5 Years");
  const [employmentType, setEmploymentType] = useState("Full Time");

  // Insights State
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchInsights = (
    tech: string,
    loc: string,
    exp: string,
    emp: string
  ) => {
    startTransition(async () => {
      try {
        setError(null);
        const res = await fetch("/api/industry-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: tech.trim(),
            location: loc,
            experience: exp,
            employmentType: emp,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch tech insights.");
        }

        setInsights(data);
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || "An unexpected error occurred.");
      }
    });
  };

  // Fetch initial React insights
  useEffect(() => {
    if (mounted) {
      fetchInsights(searchQuery, location, experience, employmentType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchInsights(searchQuery, location, experience, employmentType);
  };

  if (!mounted) {
    return null; // Hydration guard
  }

  const isIndia = location.toLowerCase().includes("india") || location.toLowerCase().includes("in");
  const salarySuffix = isIndia ? "LPA" : "k/yr";

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] flex flex-col font-sans">
      <Navbar />

      <div className="vertex-container vertex-edge-glow">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14 space-y-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dashed border-[#334155] pb-6 animate-vertex-fade-in">
            <div>
              <h1 className="vertex-heading flex items-center gap-2">
                <TrendingUp className="size-8 text-[#89ceff]" />
                Tech Pulse & Industry Insights
              </h1>
              <p className="vertex-subtext mt-1.5">
                Stay updated with trending tech articles, developer community posts, and localized stack analytics.
              </p>
            </div>
            <div className="vertex-badge">
              <Sparkles className="size-3.5 text-[#89ceff]" />
              <span>Live Dev Ecosystem Feed</span>
            </div>
          </div>

          {/* TOP SECTION: News Feed & Twitter Pulse */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Latest Technical Articles (web.dev etc) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#89ceff]" />
                  Latest Technical News & Write-ups
                </h2>
                <span className="text-xs text-[#94A3B8] font-mono">Sources: web.dev, TechCrunch, Vercel, InfoQ</span>
              </div>

              {insights?.latestNews ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.latestNews.map((news, i) => (
                    <div
                      key={i}
                      className="vertex-card overflow-hidden flex flex-col group hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] transition-all"
                    >
                      {/* Image header */}
                      <div className="h-44 w-full overflow-hidden relative border-b border-dashed border-[#334155]">
                        <img
                          src={news.thumbnail}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=640";
                          }}
                          alt="Article thumbnail"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-[9px] font-bold text-white uppercase bg-black px-2 py-0.5 rounded border border-[#334155] font-mono">
                          {news.source}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#94A3B8] font-mono">{news.time}</span>
                          <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#89ceff] transition-colors font-heading">
                            {news.headline}
                          </h4>
                        </div>

                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-2 border border-dashed border-[#334155] hover:bg-white/5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
                        >
                          Read Article
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Skeleton Loader for News Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="border border-dashed border-[#334155] bg-[#121212] rounded-2xl h-72" />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Twitter Tech Pulse Feed */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#89ceff]" />
                  Developer Twitter Pulse
                </h2>
                <span className="text-xs text-[#89ceff] font-semibold font-mono">X/Twitter</span>
              </div>

              {insights?.trendingTweets ? (
                <div className="space-y-4">
                  {insights.trendingTweets.map((tweet, index) => (
                    <div
                      key={index}
                      className="vertex-card p-5 hover:border-white/20 text-left space-y-3"
                    >
                      {/* Tweet header (User metadata) */}
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-[#94A3B8]">
                          {tweet.author.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white font-heading">{tweet.author}</span>
                            <svg className="size-3 text-[#89ceff] fill-current" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                          <span className="text-[10px] text-[#94A3B8] font-semibold font-mono">{tweet.handle} · {tweet.time}</span>
                        </div>
                      </div>

                      {/* Tweet Content */}
                      <p className="text-xs text-[#e5e2e1]/90 leading-relaxed font-sans">
                        {tweet.content}
                      </p>

                      {/* Action Metrics Row */}
                      <div className="flex items-center justify-between pt-2 text-[#94A3B8] border-t border-dashed border-[#334155]">
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors text-[10px]">
                          <MessageSquare className="size-3.5" />
                          <span>42</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors text-[10px]">
                          <Repeat className="size-3.5" />
                          <span>{tweet.retweets}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#89ceff] transition-colors text-[10px]">
                          <Heart className="size-3.5" />
                          <span>{tweet.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Skeleton Loader for Twitter Feed */
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="border border-dashed border-[#334155] bg-[#121212] rounded-2xl h-36" />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* BOTTOM SECTION: Specific Stack Deep Dive Search */}
          <div className="border-t border-dashed border-[#334155] pt-12 space-y-8">
            
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="size-5 text-[#89ceff]" />
                Specific Tech Deep-Dive Search
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed font-sans">
                Query a specific stack, framework, or skill below to generate localized salary ranges, hiring hubs, demand indices, and recruiter AI takeaways.
              </p>
            </div>

            {/* Tech Search form */}
            <form onSubmit={handleSearchSubmit} className="max-w-4xl border border-dashed border-[#334155] bg-[#121212] p-5 rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Tech query box */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center gap-1.5 ml-1">
                    <Search className="size-3" /> Tech Stack
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Next.js, Go, Rust, React 19"
                    className="vertex-input h-10 font-sans"
                  />
                </div>

                {/* Location selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center gap-1.5 ml-1">
                    <MapPin className="size-3" /> Location
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="vertex-input h-10 appearance-none cursor-pointer font-sans"
                    >
                      <option value="USA">USA</option>
                      <option value="India">India</option>
                      <option value="Remote">Remote</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
                  </div>
                </div>

                {/* Experience selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center gap-1.5 ml-1">
                    <Clock className="size-3" /> Experience
                  </label>
                  <div className="relative">
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="vertex-input h-10 appearance-none cursor-pointer font-sans"
                    >
                      <option value="0-2 Years">Fresher (0-2 Years)</option>
                      <option value="3-5 Years">Mid Level (3-5 Years)</option>
                      <option value="6-9 Years">Senior (6-9 Years)</option>
                      <option value="10+ Years">Lead/Staff (10+ Years)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
                  </div>
                </div>

                {/* Search execution Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-white hover:bg-white/95 text-black rounded-lg font-semibold text-sm h-10 flex items-center justify-center gap-2 transition-all cursor-pointer border-0"
                >
                  {isPending ? (
                    <>
                      <div className="size-3.5 rounded-full border border-neutral-400 border-t-white animate-spin" />
                      Analysing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Deep-Dive Tech
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error notifications */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3 max-w-4xl">
                <AlertCircle className="size-5 text-destructive shrink-0" />
                <span className="text-xs text-destructive font-medium">{error}</span>
              </div>
            )}

            {/* Deep Dive Insights Display */}
            {insights ? (
              <div className="space-y-8 animate-vertex-slide-up">
                
                {/* Specific Tech Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Average Salary */}
                  <div className="vertex-card p-5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#94A3B8] font-mono">Average Salary</span>
                    <h3 className="text-2xl font-bold text-white mt-3 font-mono">{insights.overview.averageSalary}</h3>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-2">
                      {insights.overview.salaryChange}
                    </span>
                  </div>

                  {/* Card 2: Active Openings */}
                  <div className="vertex-card p-5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#94A3B8] font-mono">Active Job Openings</span>
                    <h3 className="text-2xl font-bold text-white mt-3 font-mono">{insights.overview.activeJobs}</h3>
                    <span className="text-[10px] text-neutral-500 font-semibold inline-block mt-2">Real-time indexed</span>
                  </div>

                  {/* Card 3: Hiring Trend */}
                  <div className="vertex-card p-5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#94A3B8] font-mono">Hiring Trend Index</span>
                    <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-3">{insights.overview.hiringTrend}</h3>
                    <span className="text-[10px] text-[#94A3B8] font-semibold inline-block mt-2">{insights.overview.hiringTrendSub}</span>
                  </div>

                  {/* Card 4: Top Recruiter */}
                  <div className="vertex-card p-5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#94A3B8] font-mono">Top Hiring Recruiter</span>
                    <h3 className="text-2xl font-bold text-white mt-3 font-heading">{insights.overview.topCompany}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <img
                        src={`https://logo.clearbit.com/${insights.overview.topCompanyLogo}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${insights.overview.topCompany}&background=f1f5f9&color=475569&size=32`;
                        }}
                        alt="Recruiter logo"
                        className="size-4 rounded object-contain shrink-0 bg-neutral-100 p-0.5 border"
                      />
                      <span className="text-[10px] font-semibold text-[#94A3B8] font-mono">{insights.overview.topCompanyLogo}</span>
                    </div>
                  </div>
                </div>

                {/* Analytical Charts for query stack */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart 1: Salary distribution bar chart */}
                  <div className="vertex-card p-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 font-heading">
                      <span className="size-1.5 rounded-full bg-[#89ceff]" />
                      Experience Salary Brackets ({salarySuffix})
                    </h3>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={insights.charts.salaryDistribution} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-800/40" vertical={false} />
                          <XAxis dataKey="experience" stroke="currentColor" className="text-[#94A3B8] font-mono" fontSize={10} tickLine={false} />
                          <YAxis stroke="currentColor" className="text-[#94A3B8] font-mono" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#121212", borderColor: "#334155", borderRadius: "8px" }}
                            labelStyle={{ color: "white", fontWeight: "bold", fontSize: 11 }}
                            itemStyle={{ color: "white", fontSize: 11 }}
                          />
                          <Bar dataKey="salary" fill="#ffffff" radius={[4, 4, 0, 0]}>
                            {insights.charts.salaryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 2 ? "#ffffff" : index === 1 ? "#89ceff" : "#334155"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Openings timeline line chart */}
                  <div className="vertex-card p-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 font-heading">
                      <span className="size-1.5 rounded-full bg-[#89ceff]" />
                      Job Openings Demand Timeline
                    </h3>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={insights.charts.hiringTrend} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-800/40" vertical={false} />
                          <XAxis dataKey="month" stroke="currentColor" className="text-[#94A3B8] font-mono" fontSize={10} tickLine={false} />
                          <YAxis stroke="currentColor" className="text-[#94A3B8] font-mono" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#121212", borderColor: "#334155", borderRadius: "8px" }}
                            labelStyle={{ color: "white", fontWeight: "bold", fontSize: 11 }}
                            itemStyle={{ color: "#89ceff", fontSize: 11 }}
                          />
                          <Line type="monotone" dataKey="openings" stroke="#89ceff" strokeWidth={2.5} dot={{ r: 3, stroke: "#89ceff", strokeWidth: 1 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Keywords and Cities Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Key Ecosystem Keywords */}
                  <div className="lg:col-span-5 vertex-card p-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-heading">
                      <span className="size-1.5 rounded-full bg-[#89ceff]" />
                      Ecosystem Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {insights.popularTech.map((tech, i) => (
                        <span
                          key={i}
                          className="vertex-badge"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Recruiter AI Takeaways */}
                  <div className="lg:col-span-7 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Sparkles className="size-4 animate-pulse" />
                      Recruiter AI Tech Takeaways
                    </h3>
                    <div className="space-y-3 text-xs leading-relaxed text-[#e5e2e1]/80">
                      {insights.marketSummary.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2.5 p-3 rounded-lg border border-dashed border-[#334155] bg-black/60"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Initial State message if no insights loaded */
              <div className="vertex-card p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                <Sparkles className="size-6 text-neutral-600 mb-2" />
                <h3 className="text-sm font-semibold text-white mb-1 font-heading">Enter a Tech Stack to Deep-Dive</h3>
                <p className="text-xs text-[#94A3B8] font-sans">Press the search button to generate personalized market analytics.</p>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}