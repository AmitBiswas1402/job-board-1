"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="vertex-section relative">
      {/* Intersection grid crosshairs */}
      <div className="absolute -top-[5px] -left-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute -top-[5px] -right-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="vertex-badge">
            <Sparkles className="size-3.5" />
            <span>AI-powered career automation</span>
          </div>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl text-foreground"
        >
          Land your dream job with intelligent assistance
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-balance max-w-2xl text-lg leading-relaxed"
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
            className="vertex-cta rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            Start free trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/jobs" />}
            nativeButton={false}
            className="vertex-outline rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            Browse Jobs
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>

        {/* Mockup Card — Job Match Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-3xl mt-8"
        >
          <div className="border border-foreground/15 bg-card rounded-2xl shadow-xl overflow-hidden">
            {/* Window chrome bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-foreground/10" />
                <div className="size-2.5 rounded-full bg-foreground/10" />
                <div className="size-2.5 rounded-full bg-foreground/10" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-medium">AI Job Board — Dashboard</span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Job match row */}
              <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">G</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Senior Frontend Engineer</p>
                    <p className="text-xs text-muted-foreground">Google · Mountain View, CA · Remote</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">92% Match</span>
                </div>
              </div>

              {/* Job match row 2 */}
              <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">S</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Full Stack Developer</p>
                    <p className="text-xs text-muted-foreground">Stripe · San Francisco, CA · Hybrid</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">87% Match</span>
                </div>
              </div>

              {/* Job match row 3 */}
              <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">V</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">React Engineer</p>
                    <p className="text-xs text-muted-foreground">Vercel · Remote</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">78% Match</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center gap-4 text-muted-foreground pt-4"
        >
          <div className="flex items-center -space-x-2">
            <div className="size-7 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-semibold text-foreground/60 border-2 border-background">JD</div>
            <div className="size-7 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-semibold text-foreground/60 border-2 border-background">SM</div>
            <div className="size-7 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-semibold text-foreground/60 border-2 border-background">TR</div>
            <div className="size-7 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-semibold text-foreground/60 border-2 border-background">MK</div>
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
