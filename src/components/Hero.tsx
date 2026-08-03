"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface JobMatch {
  initial: string;
  role: string;
  company: string;
  details: string;
  match: string;
  logoBg: string;
  logoText: string;
}

const Hero = () => {
  const [activeTab, setActiveTab] = useState<"react" | "backend" | "design">("react");

  const jobMatches: Record<"react" | "backend" | "design", JobMatch[]> = {
    react: [
      {
        initial: "V",
        role: "Senior React Developer",
        company: "Vercel",
        details: "Remote · Full-time",
        match: "96% Match",
        logoBg: "bg-black text-white",
        logoText: "text-white",
      },
      {
        initial: "S",
        role: "Frontend Infrastructure Engineer",
        company: "Stripe",
        details: "San Francisco, CA · Hybrid",
        match: "91% Match",
        logoBg: "bg-[#635bff]/10",
        logoText: "text-[#635bff]",
      },
      {
        initial: "L",
        role: "Product Software Engineer",
        company: "Linear",
        details: "Remote · Contract",
        match: "84% Match",
        logoBg: "bg-surface-strong text-ink",
        logoText: "text-ink",
      },
    ],
    backend: [
      {
        initial: "C",
        role: "Senior Go/gRPC Engineer",
        company: "Cockroach Labs",
        details: "New York, NY · Hybrid",
        match: "94% Match",
        logoBg: "bg-[#f26522]/10",
        logoText: "text-[#f26522]",
      },
      {
        initial: "S",
        role: "Infrastructure Platform Engineer",
        company: "Supabase",
        details: "Remote · Full-time",
        match: "89% Match",
        logoBg: "bg-[#3ecf8e]/10",
        logoText: "text-[#3ecf8e]",
      },
      {
        initial: "N",
        role: "Database Reliability Engineer",
        company: "Neon",
        details: "Remote · Full-time",
        match: "82% Match",
        logoBg: "bg-[#00e599]/10",
        logoText: "text-[#00e599]",
      },
    ],
    design: [
      {
        initial: "F",
        role: "Staff UI/UX Designer",
        company: "Figma",
        details: "San Francisco, CA · Hybrid",
        match: "97% Match",
        logoBg: "bg-[#f24e1e]/10",
        logoText: "text-[#f24e1e]",
      },
      {
        initial: "A",
        role: "Product Designer (Design Systems)",
        company: "Airbnb",
        details: "Remote · Full-time",
        match: "92% Match",
        logoBg: "bg-[#ff5a5f]/10",
        logoText: "text-[#ff5a5f]",
      },
      {
        initial: "L",
        role: "Brand Designer",
        company: "Linear",
        details: "Remote · Full-time",
        match: "85% Match",
        logoBg: "bg-surface-strong text-ink",
        logoText: "text-ink",
      },
    ],
  };

  return (
    <section className="cal-section relative">
      <div className="cal-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - 7/12 (approx 7/5 split) */}
          <div className="lg:col-span-7 space-y-8 pt-4 lg:pt-0">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex"
            >
              <span className="cal-badge">
                <Sparkles className="size-3.5 text-brand-accent" />
                <span>AI-powered career automation</span>
              </span>
            </motion.div>

            {/* Hero Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="cal-display-xl text-ink text-balance"
            >
              Land your dream job with intelligent assistance
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="cal-body text-muted-foreground max-w-xl"
            >
              Stop scrolling through endless listings. Our AI analyzes your profile,
              grades your resume, drafts cover letters, and matches you with jobs
              that fit your skills and aspirations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                render={<Link href="/dashboard" />}
                nativeButton={false}
                className="cal-button-primary"
              >
                Start free trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/jobs" />}
                nativeButton={false}
                className="cal-button-secondary inline-flex items-center gap-2"
              >
                Browse Jobs
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>

            {/* Nav Pill Group */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="cal-nav-pill-group"
            >
              <button
                onClick={() => setActiveTab("react")}
                className={`cal-nav-pill ${activeTab === "react" ? "cal-nav-pill-active" : ""}`}
              >
                React Developers
              </button>
              <button
                onClick={() => setActiveTab("backend")}
                className={`cal-nav-pill ${activeTab === "backend" ? "cal-nav-pill-active" : ""}`}
              >
                Backend Engineers
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={`cal-nav-pill ${activeTab === "design" ? "cal-nav-pill-active" : ""}`}
              >
                Product Designers
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-4 text-muted-foreground pt-4"
            >
              <div className="flex items-center -space-x-2">
                <div className="cal-avatar border-2 border-canvas">JD</div>
                <div className="cal-avatar border-2 border-canvas">SM</div>
                <div className="cal-avatar border-2 border-canvas">TR</div>
                <div className="cal-avatar border-2 border-canvas">MK</div>
              </div>
              <p className="cal-body-sm">
                Join 10,000+ professionals finding their next opportunity
              </p>
            </motion.div>
          </div>

          {/* Right Column - 5/12 - Hero App Mockup Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="cal-mockup-card min-h-105">
                {/* Window chrome bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-surface-soft rounded-t-xl">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-surface-strong" />
                    <div className="size-2.5 rounded-full bg-surface-strong" />
                    <div className="size-2.5 rounded-full bg-surface-strong" />
                  </div>
                  <span className="cal-caption text-muted-foreground ml-2 font-mono">AI Job Board — Dashboard</span>
                </div>

                {/* Content Container with animation */}
                <div className="p-6 space-y-4 min-h-85 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      {jobMatches[activeTab].map((job, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-lg border border-hairline bg-canvas hover:border-surface-strong transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`size-10 ${job.logoBg} rounded-lg flex items-center justify-center font-bold`}>
                              <span className={`${job.logoText} text-sm`}>{job.initial}</span>
                            </div>
                            <div className="text-left">
                              <p className="cal-title-sm text-ink">{job.role}</p>
                              <p className="cal-caption text-muted-foreground">{job.company} · {job.details}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="cal-badge-pill cal-badge-pill-emerald">
                              <CheckCircle2 className="size-3" />
                              {job.match}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;