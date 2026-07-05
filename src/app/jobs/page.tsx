"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  Heart,
  ArrowUpRight,
  DollarSign,
  RefreshCw,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  description?: string;
  applyUrl?: string;
  source?: string;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");

  // Saved jobs local state for toggle animation demo
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  // Function to fetch jobs from API
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (role.trim()) queryParams.append("role", role.trim());
      if (location.trim()) queryParams.append("location", location.trim());
      if (experience !== "all") queryParams.append("experience", experience);
      if (employmentType !== "all")
        queryParams.append("employmentType", employmentType);

      const res = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch jobs");
      }
      const data = await res.json();
      setJobs(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  }, [role, location, experience, employmentType]);

  // Run search on state change with a slight delay (debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [fetchJobs]);

  const handleReset = () => {
    setRole("");
    setLocation("");
    setExperience("all");
    setEmploymentType("all");
  };

  const toggleSaveJob = (id: number) => {
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter((savedId) => savedId !== id));
    } else {
      setSavedJobIds([...savedJobIds, id]);
    }
  };

  // Get initials for companies without a valid logo url
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#070712] text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Background glow effects */}
      <div className="absolute top-[72px] left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[250px] right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 mb-4 animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI-Native Job Matcher Active
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Find Your Next Breakthrough Role
          </h1>

          <p className="text-sm md:text-base text-neutral-400 max-w-2xl text-balance leading-relaxed">
            Discover verified tech positions, tailor search criteria for your
            expertise levels, and apply instantly to high-growth teams.
          </p>
        </div>

        {/* Premium Search Panel */}
        <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] mb-8 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Role / Keywords */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                Keywords / Role
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-hover:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. React, Developer, Stripe"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-hover:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Remote, San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                Experience Level
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-hover:text-violet-400 pointer-events-none transition-colors" />
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-[#0c0c1b] appearance-none cursor-pointer transition-all"
                >
                  <option value="all" className="bg-[#0b0b18] text-white">
                    All Experience Levels
                  </option>
                  <option value="entry" className="bg-[#0b0b18] text-white">
                    Entry-level / Junior
                  </option>
                  <option value="mid" className="bg-[#0b0b18] text-white">
                    Mid-Level
                  </option>
                  <option value="senior" className="bg-[#0b0b18] text-white">
                    Senior / Lead / Staff
                  </option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/5 pl-2">
                  <span className="text-[10px] text-neutral-400">▼</span>
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                Employment Type
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-hover:text-violet-400 pointer-events-none transition-colors" />
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-[#0c0c1b] appearance-none cursor-pointer transition-all"
                >
                  <option value="all" className="bg-[#0b0b18] text-white">
                    All Types
                  </option>
                  <option value="full-time" className="bg-[#0b0b18] text-white">
                    Full-time
                  </option>
                  <option value="part-time" className="bg-[#0b0b18] text-white">
                    Part-time
                  </option>
                  <option value="contract" className="bg-[#0b0b18] text-white">
                    Contract
                  </option>
                  <option value="remote" className="bg-[#0b0b18] text-white">
                    Remote Only
                  </option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/5 pl-2">
                  <span className="text-[10px] text-neutral-400">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Filters Option */}
          {(role ||
            location ||
            experience !== "all" ||
            employmentType !== "all") && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-400 bg-violet-500/5 border border-violet-500/10 hover:bg-violet-600/10 hover:border-violet-400 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between mb-6 px-1.5">
          <div className="text-xs md:text-sm text-neutral-400 font-medium">
            Showing <span className="text-white font-bold">{jobs.length}</span>{" "}
            matching opportunities
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sorted by relevance
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-center my-6">
            <p className="text-rose-400 text-sm font-semibold">{error}</p>
            <Button
              onClick={fetchJobs}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Main Content Grid */}
        {loading ? (
          /* Loading Skeleton State */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0b0b18]/45 border border-white/[0.03] rounded-2xl p-6 h-[260px] flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                    <div className="h-3.5 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-white/5 rounded-full w-20" />
                  <div className="h-6 bg-white/5 rounded-full w-24" />
                </div>
                <div className="h-8 bg-white/5 rounded-lg w-full mt-2" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl py-16 px-4 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-neutral-500 mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No Matching Jobs Found
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              We couldn&apos;t find any job opportunities matching your
              criteria. Try adjusting your keywords, locations, or clearing your
              active filters.
            </p>
            <Button onClick={handleReset} variant="outline" size="sm">
              Clear All Filters
            </Button>
          </div>
        ) : (
          /* Jobs List Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {jobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-[#0b0b18]/50 border border-white/[0.04] hover:border-violet-500/35 hover:bg-[#0b0b1a] rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(139,92,246,0.06)] flex flex-col justify-between relative group/card overflow-hidden hover:-translate-y-0.5"
                >
                  {/* Subtle top light bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent translate-y-[-1px] group-hover/card:translate-y-0 transition-transform duration-300" />

                  {/* Core Card Section */}
                  <div>
                    {/* Header: Logo & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] bg-neutral-900 group-hover/card:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center font-bold text-violet-300 text-sm">
                          {getInitials(job.company)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base md:text-lg font-bold text-white truncate group-hover/card:text-violet-300 transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-xs md:text-sm font-semibold text-neutral-400 mt-0.5">
                          {job.company}
                        </p>
                      </div>

                      {/* Save Job Button */}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                          isSaved
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                            : "bg-white/[0.02] border-white/[0.06] text-neutral-500 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.location && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neutral-400 bg-white/[0.02] border border-white/[0.04]">
                          <MapPin className="w-3 h-3 text-neutral-500" />
                          {job.location}
                        </span>
                      )}
                      {job.employmentType && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-violet-400 bg-violet-600/5 border border-violet-500/10">
                          <Briefcase className="w-3 h-3" />
                          {job.employmentType}
                        </span>
                      )}
                      {job.salary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs md:text-sm text-neutral-400 line-clamp-3 leading-relaxed mb-6 font-medium">
                      {job.description}
                    </p>
                  </div>

                  {/* Apply Action Link Button */}
                  <div className="pt-2 border-t border-white/[0.03] mt-auto">
                    <a
                      href={job.applyUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.03] hover:bg-violet-600 border border-white/[0.06] hover:border-violet-500 transition-all duration-300 group/btn shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    >
                      Apply Instantly
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
