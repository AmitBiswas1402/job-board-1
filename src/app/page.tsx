"use client";

import Hero from '@/components/Hero'
import HomeNavbar from '@/components/HomeNavbar'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Briefcase,
  FileText,
  Mail,
  TrendingUp,
  Palette,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] flex flex-col">
      <HomeNavbar />
      
      {/* Root layout container aligned with the Cal.com design grid */}
      <div className="vertex-container vertex-edge-glow flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Section 1: Jobs - Soft Dark Floor */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="jobs" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Intersection grid crosshairs at corners */}
          <div className="absolute -top-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <Briefcase className="size-3.5" />
              <span>Job Discovery Engine</span>
            </div>
            <h2 className="vertex-heading">
              Smart Job Matching Built For Developers
            </h2>
            <p className="vertex-subtext">
              Stop scrolling blindly. Our intelligent discovery engine scans developer job portals, matches them against your skills, and grades your fit in real time.
            </p>
            <div className="pt-2">
              <Link href="/jobs" className="vertex-cta inline-flex items-center gap-2">
                Find Matched Jobs
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="vertex-card p-6 relative overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#334155] mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                </div>
                <div className="flex items-center gap-2 bg-[#1c1b1b] border border-dashed border-[#334155] px-3 py-1 rounded-md text-[11px] text-[#94A3B8] font-mono">
                  <Search className="size-3" />
                  <span>pathfinder.co/jobs</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Mock Job Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#131313] border border-dashed border-[#334155] p-4 rounded-xl hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-black border border-dashed border-[#334155] flex items-center justify-center font-bold text-white text-sm">V</div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Senior React Developer</h4>
                      <p className="text-[10px] text-[#94A3B8]">Vercel · Remote · Full-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#89ceff]/10 text-[#89ceff] border border-[#89ceff]/20 px-2.5 py-0.5 rounded-full font-semibold font-mono uppercase">96% Match</span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">$140k - $170k</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#131313] border border-dashed border-[#334155] p-4 rounded-xl hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-black border border-dashed border-[#334155] flex items-center justify-center font-bold text-white text-sm">S</div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Frontend Infrastructure Engineer</h4>
                      <p className="text-[10px] text-[#94A3B8]">Stripe · San Francisco · Hybrid</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#89ceff]/10 text-[#89ceff] border border-[#89ceff]/20 px-2.5 py-0.5 rounded-full font-semibold font-mono uppercase">91% Match</span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">$150k - $185k</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#131313] border border-dashed border-[#334155] p-4 rounded-xl hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-black border border-dashed border-[#334155] flex items-center justify-center font-bold text-white text-sm">L</div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Product Software Engineer</h4>
                      <p className="text-[10px] text-[#94A3B8]">Linear · Remote · Contract</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/10 text-white border border-white/20 px-2.5 py-0.5 rounded-full font-semibold font-mono uppercase">84% Match</span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">$120k - $145k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: ATS Score */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="ats-score" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Intersection grid crosshairs at corners */}
          <div className="absolute -top-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-7 order-last lg:order-first">
            <div className="vertex-card p-6 relative overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#334155] mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                </div>
                <div className="flex items-center gap-2 bg-[#1c1b1b] border border-dashed border-[#334155] px-3 py-1 rounded-md text-[11px] text-[#94A3B8] font-mono">
                  <span>pathfinder.co/ats-score</span>
                </div>
                <div className="w-6" />
              </div>

              {/* ATS Mock Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* SVG Score Gauge */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border border-dashed border-[#334155] rounded-xl bg-black/40 text-center">
                  <div className="relative size-28 flex items-center justify-center">
                    <svg className="size-28 gauge-svg">
                      <circle cx="56" cy="56" r="48" strokeWidth="6" stroke="#1c1b1b" fill="transparent" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        strokeWidth="6" 
                        stroke="#89ceff"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - 0.85)}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white font-mono">85</span>
                      <span className="text-[8px] uppercase tracking-wider text-[#94A3B8] font-bold">ATS Score</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#89ceff] font-bold mt-2">✓ ATS Highly Compatible</span>
                </div>

                {/* Score Recommendations */}
                <div className="md:col-span-7 space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono">Key Enhancements</h5>
                  
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#89ceff]/5 border border-dashed border-[#89ceff]/20">
                    <CheckCircle2 className="size-3.5 text-[#89ceff] shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[10px] font-bold text-white font-heading">Next.js Keywords Verified</h6>
                      <p className="text-[9px] text-[#94A3B8]">Keywords match 90% of job description density.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-dashed border-white/10">
                    <Sparkles className="size-3.5 text-white shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[10px] font-bold text-white font-heading">Action Verb Upgrades Needed</h6>
                      <p className="text-[9px] text-[#94A3B8]">Replace "responsible for" with "designed and deployed".</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <FileText className="size-3.5" />
              <span>ATS Score Audit</span>
            </div>
            <h2 className="vertex-heading">
              Analyze and Improve Your ATS Rating
            </h2>
            <p className="vertex-subtext">
              Many employers filter resumes with Automated Tracking Systems. Our system grades your resume against specific target descriptions, flags missing keywords, and optimizes formatting.
            </p>
            <div className="pt-2">
              <Link href="/ats-score" className="vertex-outline inline-flex items-center gap-2">
                Audit Your Resume
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Cover Letter */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="cover-letter" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Intersection grid crosshairs at corners */}
          <div className="absolute -top-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <Mail className="size-3.5" />
              <span>AI Pitch Writer</span>
            </div>
            <h2 className="vertex-heading">
              Tailor Cover Letters In Seconds
            </h2>
            <p className="vertex-subtext">
              Generating tailored cover letters that match the exact tone of a company has never been simpler. Pick a developer voice, match parameters, and generate high-impact pitches.
            </p>
            <div className="pt-2">
              <Link href="/cover-letter" className="vertex-outline inline-flex items-center gap-2">
                Draft Pitch Letter
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="vertex-card p-6 relative overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#334155] mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                </div>
                <div className="flex items-center gap-2 bg-[#1c1b1b] border border-dashed border-[#334155] px-3 py-1 rounded-md text-[11px] text-[#94A3B8] font-mono">
                  <span>pathfinder.co/cover-letter</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Cover Letter Split-pane Design */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Form Controls */}
                <div className="md:col-span-5 space-y-3 p-3 bg-black border border-dashed border-[#334155] rounded-xl">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold font-mono">Company Name</label>
                    <div className="bg-[#121212] border border-dashed border-[#334155] rounded px-2.5 py-1.5 text-[10px] font-semibold text-white">Google</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold font-mono">Target Role</label>
                    <div className="bg-[#121212] border border-dashed border-[#334155] rounded px-2.5 py-1.5 text-[10px] font-semibold text-white">React Developer</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold font-mono">Voice Tone</label>
                    <div className="bg-[#121212] border border-dashed border-[#334155] rounded px-2.5 py-1.5 text-[10px] font-semibold text-white font-mono">Direct & Persuasive</div>
                  </div>
                </div>

                {/* Live Paper Preview */}
                <div className="md:col-span-7 bg-[#131313] border border-dashed border-[#334155] p-4 rounded-xl font-mono text-[9px] leading-relaxed text-[#94A3B8] max-h-[160px] overflow-y-auto">
                  <p className="font-semibold text-white mb-2">Subject: Application for React Developer position</p>
                  <p>Dear Google Careers Team,</p>
                  <p className="mt-1.5">
                    I am writing to express my enthusiasm for the Senior React Developer role. Having designed responsive frontend systems using React Server Components, I bring strong expertise in building developer-focused tooling... <span className="typing-cursor"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Industry Insights */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="industry-insights" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Intersection grid crosshairs at corners */}
          <div className="absolute -top-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-7 order-last lg:order-first">
            <div className="vertex-card p-6 relative overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#334155] mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                </div>
                <div className="flex items-center gap-2 bg-[#1c1b1b] border border-dashed border-[#334155] px-3 py-1 rounded-md text-[11px] text-[#94A3B8] font-mono">
                  <span>pathfinder.co/insights</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Insights Mock Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-dashed border-[#334155] p-3 rounded-xl bg-black text-left">
                  <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold font-mono block mb-0.5">Average Salary</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-white font-mono">$146,800</span>
                    <span className="text-[8px] text-[#89ceff] font-bold font-mono">+4.2% YoY</span>
                  </div>
                </div>
                <div className="border border-dashed border-[#334155] p-3 rounded-xl bg-black text-left">
                  <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold font-mono block mb-0.5">Active Roles</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-white font-mono">1,248</span>
                    <span className="text-[8px] text-[#89ceff] font-bold font-mono">Hiring Surge</span>
                  </div>
                </div>
              </div>

              {/* SVG Salary Trend Line Chart */}
              <div className="border border-dashed border-[#334155] p-3 rounded-xl bg-black text-left">
                <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold font-mono block mb-2">Frontend Salary by Experience</span>
                <div className="h-20 w-full flex items-end justify-between px-2 pt-2 relative">
                  <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-t border-dashed border-[#334155]/20 w-full" />
                    <div className="border-t border-dashed border-[#334155]/20 w-full" />
                  </div>
                  <div className="w-8 bg-[#121212] hover:bg-[#1c1b1b] border border-dashed border-[#334155] h-[25%] rounded-t flex items-center justify-center text-[7px] text-[#94A3B8] font-mono">Entry</div>
                  <div className="w-8 bg-[#121212] hover:bg-[#1c1b1b] border border-dashed border-[#334155] h-[45%] rounded-t flex items-center justify-center text-[7px] text-[#94A3B8] font-mono">Mid</div>
                  <div className="w-8 bg-[#121212] hover:bg-[#1c1b1b] border border-dashed border-[#334155] h-[70%] rounded-t flex items-center justify-center text-[7px] text-[#94A3B8] font-mono">Senior</div>
                  <div className="w-8 bg-white/10 hover:bg-white/15 border border-dashed border-white/20 h-[90%] rounded-t flex items-center justify-center text-[7px] font-bold text-white font-mono">Lead</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <TrendingUp className="size-3.5" />
              <span>Market Analytics</span>
            </div>
            <h2 className="vertex-heading">
              Track Trends & Salaries In Realtime
            </h2>
            <p className="vertex-subtext">
              Stay ahead of hiring cycles. Access salary distributions, regional benchmarks, stack demand tracking, and specific requirements demanded by high-growth startups.
            </p>
            <div className="pt-2">
              <Link href="/industry-insights" className="vertex-outline inline-flex items-center gap-2">
                View Market Insights
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Whiteboard / Tracker */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="visual-whiteboard" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Intersection grid crosshairs at corners */}
          <div className="absolute -top-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -left-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -bottom-[5px] -right-[5px] text-[#334155] font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <Palette className="size-3.5" />
              <span>Application Kanban Board</span>
            </div>
            <h2 className="vertex-heading">
              Track Applications Visually
            </h2>
            <p className="vertex-subtext">
              Manage your job search pipeline in a beautiful drag-and-drop workspace. Group jobs into wishlist, applied, interviewing, and offers. Add custom notes, track requirements, and organize documents.
            </p>
            <div className="pt-2">
              <Link href="/visual-whiteboard" className="vertex-outline inline-flex items-center gap-2">
                Open Visual Tracker
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="vertex-card p-6 relative overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#334155] mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                  <div className="size-2 rounded-full bg-neutral-800" />
                </div>
                <div className="flex items-center gap-2 bg-[#1c1b1b] border border-dashed border-[#334155] px-3 py-1 rounded-md text-[11px] text-[#94A3B8] font-mono">
                  <span>pathfinder.co/tracker</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Kanban Columns Mockup */}
              <div className="grid grid-cols-3 gap-3">
                
                {/* Column 1: Wishlist */}
                <div className="space-y-2 p-2 border border-dashed border-[#334155]/40 rounded-xl bg-black min-h-[140px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">Wishlist (2)</span>
                  <div className="bg-[#121212] border border-dashed border-[#334155] p-2.5 rounded-lg text-left">
                    <span className="text-[7px] text-[#89ceff] font-bold bg-[#89ceff]/5 border border-[#89ceff]/20 px-1.5 py-0.5 rounded-sm font-mono uppercase">Google</span>
                    <h5 className="text-[10px] font-bold text-white mt-1 font-heading">React Lead</h5>
                  </div>
                  <div className="bg-[#121212] border border-dashed border-[#334155] p-2.5 rounded-lg text-left opacity-60">
                    <span className="text-[7px] text-white/60 font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-sm font-mono uppercase">Amazon</span>
                    <h5 className="text-[10px] font-bold text-white/80 mt-1 font-heading">Full Stack</h5>
                  </div>
                </div>

                {/* Column 2: Applied */}
                <div className="space-y-2 p-2 border border-dashed border-[#334155]/40 rounded-xl bg-black min-h-[140px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">Applied (1)</span>
                  <div className="bg-[#121212] border border-dashed border-[#334155] p-2.5 rounded-lg text-left">
                    <span className="text-[7px] text-white font-bold bg-white/10 border border-white/20 px-1.5 py-0.5 rounded-sm font-mono uppercase">Vercel</span>
                    <h5 className="text-[10px] font-bold text-white mt-1 font-heading">Next Developer</h5>
                  </div>
                </div>

                {/* Column 3: Interview */}
                <div className="space-y-2 p-2 border border-dashed border-[#334155]/40 rounded-xl bg-black min-h-[140px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">Interview (1)</span>
                  <div className="bg-[#121212] border border-solid border-[#89ceff] p-2.5 rounded-lg text-left">
                    <span className="text-[7px] text-[#89ceff] font-bold bg-[#89ceff]/5 border border-[#89ceff]/20 px-1.5 py-0.5 rounded-sm font-mono uppercase">Stripe</span>
                    <h5 className="text-[10px] font-bold text-white mt-1 font-heading">Frontend Infra</h5>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  )
}

export default Home