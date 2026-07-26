"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
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
        logoBg: "bg-black text-white border border-neutral-800",
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
        logoBg: "bg-white/10 text-white",
        logoText: "text-white",
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
        logoBg: "bg-white/10 text-white",
        logoText: "text-white",
      },
    ],
  };

  return (
    <section className="vertex-section bg-black text-[#e5e2e1]">
      {/* Intersection grid crosshairs at corners */}
      <div className="absolute -top-1.25 -left-1.25 text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute -top-1.25 -right-1.25 text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute -bottom-1.25 -left-1.25 text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute -bottom-1.25 -right-1.25 text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="vertex-badge">
            <Sparkles className="size-3.5 text-[#89ceff]" />
            <span>AI-powered career automation</span>
          </div>
        </motion.div>

        {/* Hero Heading (Space Grotesk Headline) */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl text-white font-heading leading-[1.1]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Land your dream job with intelligent assistance
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#94A3B8] text-balance max-w-2xl text-base md:text-lg leading-relaxed font-sans"
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
            className="vertex-cta"
          >
            Start free trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/jobs" />}
            nativeButton={false}
            className="vertex-outline"
          >
            Browse Jobs
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>

        {/* Interactive Cal.com Signature nav-pill-group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-[#1c1b1b] p-1 rounded-full flex items-center gap-1 border border-neutral-800"
        >
          <button
            onClick={() => setActiveTab("react")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeTab === "react"
                ? "bg-white text-black shadow-sm"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            React Developers
          </button>
          <button
            onClick={() => setActiveTab("backend")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeTab === "backend"
                ? "bg-white text-black shadow-sm"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Backend Engineers
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeTab === "design"
                ? "bg-white text-black shadow-sm"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Product Designers
          </button>
        </motion.div>

        {/* Mockup Card — Job Match Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-3xl mt-4"
        >
          <div className="border border-dashed border-[#334155] bg-[#121212] rounded-2xl shadow-sm overflow-hidden text-[#e5e2e1]">
            {/* Window chrome bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-dashed border-[#334155] bg-[#1c1b1b]">
              <div className="flex gap-1.5">
                <div className="size-2 rounded-full bg-neutral-800" />
                <div className="size-2 rounded-full bg-neutral-800" />
                <div className="size-2 rounded-full bg-neutral-800" />
              </div>
              <span className="text-xs text-[#94A3B8] ml-2 font-medium font-mono">AI Job Board — Dashboard</span>
            </div>

            {/* Content Container with animation */}
            <div className="p-6 space-y-4 min-h-62.5 relative bg-black/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {jobMatches[activeTab].map((job, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-dashed border-[#334155] bg-[#131313] hover:border-white/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`size-10 ${job.logoBg} rounded-lg flex items-center justify-center font-bold`}>
                          <span className={`${job.logoText} text-sm`}>{job.initial}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{job.role}</p>
                          <p className="text-xs text-[#94A3B8]">{job.company} · {job.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-[#89ceff] bg-[#89ceff]/10 px-2.5 py-1 rounded-full border border-[#89ceff]/20 font-mono uppercase">
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

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center gap-4 text-[#94A3B8] pt-4"
        >
          <div className="flex items-center -space-x-2">
            <div className="size-7 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] border-2 border-black">JD</div>
            <div className="size-7 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] border-2 border-black">SM</div>
            <div className="size-7 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] border-2 border-black">TR</div>
            <div className="size-7 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] border-2 border-black">MK</div>
          </div>
          <p className="text-sm">
            Join 10,000+ professionals finding their next opportunity
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
