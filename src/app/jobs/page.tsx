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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="vertex-container">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-10 md:mb-14 animate-vertex-fade-in">
            <div className="vertex-badge mb-4">
              <Sparkles className="size-3.5" />
              AI-Native Job Matcher Active
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-4">
              Find your next breakthrough role
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-2xl text-balance leading-relaxed">
              Discover verified tech positions, tailor search criteria for your
              expertise levels, and apply instantly to high-growth teams.
            </p>
          </div>

          {/* Search Panel */}
          <div className="vertex-card p-5 md:p-6 mb-8 animate-vertex-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Role / Keywords */}
              <div className="relative group">
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                  Keywords / Role
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. React, Developer, Stripe"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="vertex-input pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="relative group">
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. Remote, San Francisco"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="vertex-input pl-10"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div className="relative group">
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                  Experience Level
                </label>
                <div className="relative">
                  <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="vertex-input pl-10 pr-10 appearance-none cursor-pointer"
                  >
                    <option value="all">All Experience Levels</option>
                    <option value="entry">Entry-level / Junior</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior / Lead / Staff</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-xs text-muted-foreground">▼</span>
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div className="relative group">
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                  Employment Type
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="vertex-input pl-10 pr-10 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote Only</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-xs text-muted-foreground">▼</span>
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border transition-all cursor-pointer"
                >
                  <RefreshCw className="size-3" />
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Results Info Bar */}
          <div className="flex items-center justify-between mb-6 px-1.5">
            <div className="text-xs md:text-sm text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{jobs.length}</span>{" "}
              matching opportunities
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />
              Sorted by relevance
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center my-6">
              <p className="text-destructive text-sm font-medium">{error}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="vertex-card p-6 h-[260px] flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-muted rounded-xl" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3.5 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-20" />
                    <div className="h-6 bg-muted rounded-full w-24" />
                  </div>
                  <div className="h-8 bg-muted rounded-lg w-full mt-2" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State */
            <div className="vertex-card py-16 px-4 text-center max-w-xl mx-auto">
              <div className="size-12 bg-muted border rounded-2xl flex items-center justify-center text-muted-foreground mx-auto mb-4">
                <Briefcase className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Matching Jobs Found
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {jobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="group/card vertex-card p-6 flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Core Card Section */}
                    <div>
                      {/* Header: Logo & Title */}
                      <div className="flex items-start gap-4 mb-4">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={`${job.company} logo`}
                            className="size-12 rounded-xl object-cover border bg-muted group-hover/card:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="size-12 rounded-xl bg-muted border flex items-center justify-center font-semibold text-muted-foreground text-sm">
                            {getInitials(job.company)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base md:text-lg font-semibold text-foreground truncate group-hover/card:text-foreground/80 transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">
                            {job.company}
                          </p>
                        </div>

                        {/* Save Job Button */}
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`size-8 rounded-full flex items-center justify-center border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                            isSaved
                              ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-500"
                              : "bg-muted border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Heart
                            className={`size-4 ${isSaved ? "fill-red-500" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Metadata tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.location && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-muted-foreground bg-muted border">
                            <MapPin className="size-3" />
                            {job.location}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-foreground bg-muted border">
                            <Briefcase className="size-3" />
                            {job.employmentType}
                          </span>
                        )}
                        {job.salary && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                            <DollarSign className="size-3" />
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Description Snippet */}
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                        {job.description}
                      </p>
                    </div>

                    {/* Apply Action Link Button */}
                    <div className="pt-3 border-t mt-auto">
                      <a
                        href={job.applyUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 group/btn"
                      >
                        Apply Instantly
                        <ArrowUpRight className="size-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
