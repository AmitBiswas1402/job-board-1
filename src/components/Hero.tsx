"use client";

import { motion } from "motion/react";
import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";

const Hero = () => {
  return (
    <section className="px-6 py-32 flex flex-col items-center max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-full border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Job Recommendations
            </span>
          </div>

          <h1 className="font-heading font-bold text-5xl sm:text-6xl leading-tight tracking-tight">
            Land Your Dream Job With <br />
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl rounded-3xl" />
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                Intelligent Assistance
              </span>
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Stop scrolling through endless listings. Our AI analyzes your
            profile and matches you with jobs that fit your skills and
            aspirations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
            <Button size="lg" render={<Link href="/dashboard" />}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/jobs" />}>
              Browse Jobs
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4 text-muted-foreground">
            <div className="flex items-center -space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-background">
                JD
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold border-2 border-background">
                SM
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold border-2 border-background">
                TR
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-background">
                MK
              </div>
            </div>
            <p className="text-sm">
              Join 10,000+ professionals finding their next opportunity
            </p>
          </div>
        </motion.div>

        {/* Right:Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl animate-pulse"></div>
          <div className="relative bg-card border rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-heading text-xl">
                Job Match Score
              </h3>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <FaLinkedin className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageSquareText className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.031 23.031 0 013 15.75c-3.086 0-5.904-.837-8.488-2.245M21 13.255V21h-8.248M21 13.255C20.485 12.46 19.73 11.756 18.813 11.25M15 10.5h.01M18 10.5h.01M13 15h.01M16 15h.01M21 13.255C21 12.46 20.255 11.756 19.338 11.25M3 15.75v-8.248c0-1.132.39-2.175 1.039-3.03M3 15.75c-1.039 1.355-1.664 3.062-1.664 4.75m16.536-10.61A8.965 8.965 0 0021 9.75c0 2.103-.857 4.01-2.223 5.448M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0a3 3 0 11-6 0 3 3 0 016 0zM9 15a3 3 0 11-6 0 3 3 0 016 0zm4.5 0a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Senior Backend Engineer
                    </p>
                    <p className="text-xs text-muted-foreground">
                      TechCorp Solutions • Remote
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary">85%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
