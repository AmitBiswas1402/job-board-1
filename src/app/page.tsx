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
  UploadCloud,
  CheckCircle2,
  ListFilter,
  DollarSign,
  LineChart as ChartIcon,
  MousePointer,
  HelpCircle,
  Plus
} from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar />
      
      {/* Centralized container with signature dashed borders and blue edge glows */}
      <div className="vertex-container vertex-edge-glow">
        {/* Hero Section */}
        <Hero />

        {/* Section 1: Jobs */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          id="jobs" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        >
          {/* Intersection grid crosshairs */}
          <div className="absolute -top-[5px] -left-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <Briefcase className="size-3.5 text-foreground/75" />
              <span>Job Discovery Engine</span>
            </div>
            <h2 className="vertex-heading">
              Smart Job Matching Built For Developers
            </h2>
            <p className="vertex-subtext">
              Stop scrolling blindly. Our intelligent discovery engine scans developer job portals, matches them against your skills, and grades your fit in real time.
            </p>
            <div className="pt-2">
              <Link href="/jobs" className="vertex-cta inline-flex items-center gap-2 rounded-lg text-sm font-medium">
                Find Matched Jobs
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-border/60 bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-[11px] text-muted-foreground">
                  <Search className="size-3" />
                  <span>pathfinder.co/jobs</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Mock Job Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-background/40 border border-border/40 p-4 rounded-xl hover:border-foreground/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-sm">V</div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">Senior React Developer</h4>
                      <p className="text-[10px] text-muted-foreground">Vercel · Remote · Full-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">96% Match</span>
                    <span className="text-[10px] text-muted-foreground">$140k - $170k</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-background/40 border border-border/40 p-4 rounded-xl hover:border-foreground/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-sm">S</div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">Frontend Infrastructure Engineer</h4>
                      <p className="text-[10px] text-muted-foreground">Stripe · San Francisco · Hybrid</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">91% Match</span>
                    <span className="text-[10px] text-muted-foreground">$150k - $185k</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-background/40 border border-border/40 p-4 rounded-xl hover:border-foreground/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">L</div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">Product Software Engineer</h4>
                      <p className="text-[10px] text-muted-foreground">Linear · Remote · Contract</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">84% Match</span>
                    <span className="text-[10px] text-muted-foreground">$120k - $145k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: ATS Score */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          id="ats-score" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        >
          {/* Intersection grid crosshairs */}
          <div className="absolute -top-[5px] -left-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-7 order-last lg:order-first">
            <div className="border border-border/60 bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-[11px] text-muted-foreground">
                  <span>pathfinder.co/ats-score</span>
                </div>
                <div className="w-6" />
              </div>

              {/* ATS Mock Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* SVG Score Gauge */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border border-border/40 rounded-xl bg-background/30 text-center">
                  <div className="relative size-28 flex items-center justify-center">
                    <svg className="size-28 gauge-svg">
                      <circle cx="56" cy="56" r="48" strokeWidth="6" className="gauge-bg" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        strokeWidth="6" 
                        className="gauge-fg text-emerald-400 stroke-current"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - 0.85)}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">85</span>
                      <span className="text-[8px] uppercase tracking-wider text-muted-foreground">ATS Score</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium mt-2">✓ ATS Highly Compatible</span>
                </div>

                {/* Score Recommendations */}
                <div className="md:col-span-7 space-y-3">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Key Enhancements</h5>
                  
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[10px] font-semibold text-foreground">Next.js Keywords Verified</h6>
                      <p className="text-[9px] text-muted-foreground">Keywords match 90% of job description density.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <Sparkles className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[10px] font-semibold text-foreground">Action Verb Upgrades Needed</h6>
                      <p className="text-[9px] text-muted-foreground">Replace "responsible for" with "designed and deployed".</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <FileText className="size-3.5 text-foreground/75" />
              <span>ATS Score Audit</span>
            </div>
            <h2 className="vertex-heading">
              Analyze and Improve Your ATS Rating
            </h2>
            <p className="vertex-subtext">
              Many employers filter resumes with Automated Tracking Systems. Our system grades your resume against specific target descriptions, flags missing keywords, and optimizes formatting.
            </p>
            <div className="pt-2">
              <Link href="/ats-score" className="vertex-cta inline-flex items-center gap-2 rounded-lg text-sm font-medium">
                Audit Your Resume
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Cover Letter */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          id="cover-letter" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        >
          {/* Intersection grid crosshairs */}
          <div className="absolute -top-[5px] -left-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <Mail className="size-3.5 text-foreground/75" />
              <span>AI Pitch Writer</span>
            </div>
            <h2 className="vertex-heading">
              Tailor Cover Letters In Seconds
            </h2>
            <p className="vertex-subtext">
              Generating tailored cover letters that match the exact tone of a company has never been simpler. Pick a developer voice, match parameters, and generate high-impact pitches.
            </p>
            <div className="pt-2">
              <Link href="/cover-letter" className="vertex-cta inline-flex items-center gap-2 rounded-lg text-sm font-medium">
                Draft Pitch Letter
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-border/60 bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-[11px] text-muted-foreground">
                  <span>pathfinder.co/cover-letter</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Cover Letter Split-pane Design */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Form Controls */}
                <div className="md:col-span-5 space-y-3 p-3 bg-background/20 border border-border/40 rounded-xl">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Company Name</label>
                    <div className="bg-background border border-border/40 rounded px-2.5 py-1.5 text-[10px] font-medium text-foreground">Google</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Target Role</label>
                    <div className="bg-background border border-border/40 rounded px-2.5 py-1.5 text-[10px] font-medium text-foreground">React Developer</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Voice Tone</label>
                    <div className="bg-background border border-border/40 rounded px-2.5 py-1.5 text-[10px] font-medium text-foreground">Direct & Persuasive</div>
                  </div>
                </div>

                {/* Live Paper Preview */}
                <div className="md:col-span-7 bg-background/80 border border-border/40 p-4 rounded-xl font-mono text-[9px] leading-relaxed text-muted-foreground max-h-[160px] overflow-y-auto">
                  <p className="font-semibold text-foreground mb-2">Subject: Application for React Developer position</p>
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          id="industry-insights" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        >
          {/* Intersection grid crosshairs */}
          <div className="absolute -top-[5px] -left-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-7 order-last lg:order-first">
            <div className="border border-border/60 bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-[11px] text-muted-foreground">
                  <span>pathfinder.co/insights</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Insights Mock Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-border/40 p-3 rounded-xl bg-background/30 text-left">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-0.5">Average Salary</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-foreground">$146,800</span>
                    <span className="text-[8px] text-emerald-400 font-medium">+4.2% YoY</span>
                  </div>
                </div>
                <div className="border border-border/40 p-3 rounded-xl bg-background/30 text-left">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-0.5">Active Roles</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-foreground">1,248</span>
                    <span className="text-[8px] text-emerald-400 font-medium">Hiring Surge</span>
                  </div>
                </div>
              </div>

              {/* SVG Salary Trend Line Chart */}
              <div className="border border-border/40 p-3 rounded-xl bg-background/30 text-left">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-2">Frontend Salary by Experience</span>
                <div className="h-20 w-full flex items-end justify-between px-2 pt-2 relative">
                  <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-t border-border/20 w-full" />
                    <div className="border-t border-border/20 w-full" />
                    <div className="border-t border-border/20 w-full" />
                  </div>
                  <div className="w-8 bg-foreground/5 hover:bg-foreground/15 border border-border/30 h-[25%] rounded-t flex items-center justify-center text-[7px] text-muted-foreground">Entry</div>
                  <div className="w-8 bg-foreground/5 hover:bg-foreground/15 border border-border/30 h-[45%] rounded-t flex items-center justify-center text-[7px] text-muted-foreground">Mid</div>
                  <div className="w-8 bg-foreground/5 hover:bg-foreground/15 border border-border/30 h-[70%] rounded-t flex items-center justify-center text-[7px] text-muted-foreground">Senior</div>
                  <div className="w-8 bg-foreground/10 hover:bg-foreground/20 border border-border/40 h-[90%] rounded-t flex items-center justify-center text-[7px] font-semibold text-foreground">Lead</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <TrendingUp className="size-3.5 text-foreground/75" />
              <span>Market Analytics</span>
            </div>
            <h2 className="vertex-heading">
              Track Trends & Salaries In Realtime
            </h2>
            <p className="vertex-subtext">
              Stay ahead of hiring cycles. Access salary distributions, regional benchmarks, stack demand tracking, and specific requirements demanded by high-growth startups.
            </p>
            <div className="pt-2">
              <Link href="/industry-insights" className="vertex-cta inline-flex items-center gap-2 rounded-lg text-sm font-medium">
                View Market Insights
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Whiteboard / Tracker */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          id="visual-whiteboard" 
          className="vertex-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative border-b-0"
        >
          {/* Intersection grid crosshairs */}
          <div className="absolute -top-[5px] -left-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>
          <div className="absolute -top-[5px] -right-[5px] text-muted-foreground/30 font-mono text-[10px] select-none pointer-events-none">+</div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vertex-badge">
              <Palette className="size-3.5 text-foreground/75" />
              <span>Application Kanban Board</span>
            </div>
            <h2 className="vertex-heading">
              Track Applications Visually
            </h2>
            <p className="vertex-subtext">
              Manage your job search pipeline in a beautiful drag-and-drop workspace. Group jobs into wishlist, applied, interviewing, and offers. Add custom notes, track requirements, and organize documents.
            </p>
            <div className="pt-2">
              <Link href="/visual-whiteboard" className="vertex-cta inline-flex items-center gap-2 rounded-lg text-sm font-medium">
                Open Visual Tracker
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-border/60 bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
              {/* Window chrome bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                  <div className="size-2.5 rounded-full bg-foreground/10" />
                </div>
                <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3 py-1 rounded-md text-[11px] text-muted-foreground">
                  <span>pathfinder.co/tracker</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Kanban Columns Mockup */}
              <div className="grid grid-cols-3 gap-3">
                
                {/* Column 1: Wishlist */}
                <div className="space-y-2 p-2 border border-border/20 rounded-xl bg-background/20 min-h-[140px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Wishlist (2)</span>
                  <div className="bg-card border border-border/40 p-2.5 rounded-lg text-left shadow-sm">
                    <span className="text-[7px] text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded-full">Google</span>
                    <h5 className="text-[10px] font-bold text-foreground mt-1">React Lead</h5>
                  </div>
                  <div className="bg-card border border-border/40 p-2.5 rounded-lg text-left shadow-sm opacity-60">
                    <span className="text-[7px] text-purple-400 font-semibold bg-purple-500/5 border border-purple-500/10 px-1.5 py-0.5 rounded-full">Amazon</span>
                    <h5 className="text-[10px] font-bold text-foreground mt-1">Full Stack</h5>
                  </div>
                </div>

                {/* Column 2: Applied */}
                <div className="space-y-2 p-2 border border-border/20 rounded-xl bg-background/20 min-h-[140px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Applied (1)</span>
                  <div className="bg-card border border-border/40 p-2.5 rounded-lg text-left shadow-sm">
                    <span className="text-[7px] text-cyan-400 font-semibold bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.5 rounded-full">Vercel</span>
                    <h5 className="text-[10px] font-bold text-foreground mt-1">Next Developer</h5>
                  </div>
                </div>

                {/* Column 3: Interview */}
                <div className="space-y-2 p-2 border border-border/20 rounded-xl bg-background/20 min-h-[140px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Interview (1)</span>
                  <div className="bg-card border border-border/50 p-2.5 rounded-lg text-left shadow-md border-l-2 border-l-emerald-400">
                    <span className="text-[7px] text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded-full">Stripe</span>
                    <h5 className="text-[10px] font-bold text-foreground mt-1">Frontend Infra</h5>
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