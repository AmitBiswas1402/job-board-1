"use client";

import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Briefcase,
  FileText,
  GitCommit,
  Mail,
  TrendingUp,
  Palette,
  Search,
  Sparkles,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Bookmark,
  Send,
  Users,
  Trophy,
} from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section - White Canvas */}
        <Hero />

        {/* Section 1: Jobs - Surface Card (Light Gray) - Feature Card Style */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="jobs" 
          className="cal-section bg-surface-card"
        >
          <div className="cal-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="cal-badge">
                  <Briefcase className="size-3.5" />
                  <span>Job Discovery Engine</span>
                </span>
                <h2 className="cal-display-lg text-ink">
                  Smart Job Matching Built For Developers
                </h2>
                <p className="cal-body text-muted-foreground">
                  Stop scrolling blindly. Our intelligent discovery engine scans developer job portals, matches them against your skills, and grades your fit in real time.
                </p>
                <div className="pt-2">
                  <Link href="/jobs" className="cal-button-secondary inline-flex items-center gap-2">
                    Find Matched Jobs
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="cal-mockup-card">
                  {/* Window chrome bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                    </div>
                    <div className="flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1 rounded-md text-[11px] text-muted-foreground font-mono">
                      <Search className="size-3" />
                      <span>pathfinder.co/jobs</span>
                    </div>
                    <div className="w-6" />
                  </div>

                  {/* Mock Job Dashboard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-hairline bg-canvas hover:border-surface-strong transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-sm">V</div>
                        <div>
                          <h4 className="cal-title-sm text-ink">Senior React Developer</h4>
                          <p className="cal-caption text-muted-foreground">Vercel · Remote · Full-time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="cal-badge-pill cal-badge-pill-emerald">
                          <CheckCircle2 className="size-3" />
                          96% Match
                        </span>
                        <span className="cal-caption text-muted-foreground font-mono">$140k - $170k</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-hairline bg-canvas hover:border-surface-strong transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-[#635bff]/10 text-[#635bff] rounded-lg flex items-center justify-center font-bold text-sm">S</div>
                        <div>
                          <h4 className="cal-title-sm text-ink">Frontend Infrastructure Engineer</h4>
                          <p className="cal-caption text-muted-foreground">Stripe · San Francisco · Hybrid</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="cal-badge-pill cal-badge-pill-emerald">
                          <CheckCircle2 className="size-3" />
                          91% Match
                        </span>
                        <span className="cal-caption text-muted-foreground font-mono">$150k - $185k</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-hairline bg-canvas hover:border-surface-strong transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-surface-strong text-ink rounded-lg flex items-center justify-center font-bold text-sm">L</div>
                        <div>
                          <h4 className="cal-title-sm text-ink">Product Software Engineer</h4>
                          <p className="cal-caption text-muted-foreground">Linear · Remote · Contract</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="cal-badge-pill">
                          <CheckCircle2 className="size-3" />
                          84% Match
                        </span>
                        <span className="cal-caption text-muted-foreground font-mono">$120k - $145k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: ATS Score - White Canvas - Product Mockup Card */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="ats-score" 
          className="cal-section bg-canvas"
        >
          <div className="cal-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 order-last lg:order-first">
                <div className="cal-mockup-card">
                  {/* Window chrome bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                    </div>
                    <div className="flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1 rounded-md text-[11px] text-muted-foreground font-mono">
                      <span>pathfinder.co/ats-score</span>
                    </div>
                    <div className="w-6" />
                  </div>

                  {/* ATS Mock Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* SVG Score Gauge */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border border-hairline rounded-lg bg-surface-soft text-center">
                      <div className="relative size-28 flex items-center justify-center mb-3">
                        <svg className="size-28 gauge-svg">
                          <circle cx="56" cy="56" r="48" strokeWidth="6" stroke="var(--hairline)" fill="transparent" />
                          <circle 
                            cx="56" 
                            cy="56" 
                            r="48" 
                            strokeWidth="6" 
                            stroke="var(--brand-accent)"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 48}
                            strokeDashoffset={2 * Math.PI * 48 * (1 - 0.85)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="cal-display-sm text-ink font-mono">85</span>
                          <span className="cal-caption text-muted-foreground uppercase tracking-wider">ATS Score</span>
                        </div>
                      </div>
                      <span className="cal-caption text-success font-bold">✓ ATS Highly Compatible</span>
                    </div>

                    {/* Score Recommendations */}
                    <div className="md:col-span-7 space-y-3">
                      <h5 className="cal-caption text-muted-foreground uppercase tracking-wider font-mono">Key Enhancements</h5>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg border border-hairline bg-canvas">
                        <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                        <div>
                          <h6 className="cal-title-sm text-ink">Next.js Keywords Verified</h6>
                          <p className="cal-body-sm text-muted-foreground mt-1">Keywords match 90% of job description density.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg border border-hairline bg-canvas">
                        <Sparkles className="size-5 text-brand-accent shrink-0 mt-0.5" />
                        <div>
                          <h6 className="cal-title-sm text-ink">Action Verb Upgrades Needed</h6>
                          <p className="cal-body-sm text-muted-foreground mt-1">Replace &ldquo;responsible for&rdquo; with &ldquo;designed and deployed&rdquo;.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <span className="cal-badge">
                  <FileText className="size-3.5" />
                  <span>ATS Score Audit</span>
                </span>
                <h2 className="cal-display-lg text-ink">
                  Analyze and Improve Your ATS Rating
                </h2>
                <p className="cal-body text-muted-foreground">
                  Many employers filter resumes with Automated Tracking Systems. Our system grades your resume against specific target descriptions, flags missing keywords, and optimizes formatting.
                </p>
                <div className="pt-2">
                  <Link href="/ats-score" className="cal-button-secondary inline-flex items-center gap-2">
                    Audit Your Resume
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Cover Letter - Surface Card (Light Gray) - Feature Card Style */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="cover-letter" 
          className="cal-section bg-surface-card"
        >
          <div className="cal-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="cal-badge">
                  <Mail className="size-3.5" />
                  <span>AI Pitch Writer</span>
                </span>
                <h2 className="cal-display-lg text-ink">
                  Tailor Cover Letters In Seconds
                </h2>
                <p className="cal-body text-muted-foreground">
                  Generating tailored cover letters that match the exact tone of a company has never been simpler. Pick a developer voice, match parameters, and generate high-impact pitches.
                </p>
                <div className="pt-2">
                  <Link href="/cover-letter" className="cal-button-secondary inline-flex items-center gap-2">
                    Draft Pitch Letter
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="cal-mockup-card">
                  {/* Window chrome bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                    </div>
                    <div className="flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1 rounded-md text-[11px] text-muted-foreground font-mono">
                      <span>pathfinder.co/cover-letter</span>
                    </div>
                    <div className="w-6" />
                  </div>

                  {/* Cover Letter Split-pane Design */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Form Controls */}
                    <div className="md:col-span-5 space-y-3 p-4 border border-hairline rounded-lg bg-canvas">
                      <div className="space-y-1.5">
                        <label className="cal-caption text-muted-foreground uppercase tracking-wider font-mono">Company Name</label>
                        <div className="cal-input bg-surface-soft border-hairline text-ink font-normal">Google</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="cal-caption text-muted-foreground uppercase tracking-wider font-mono">Target Role</label>
                        <div className="cal-input bg-surface-soft border-hairline text-ink font-normal">React Developer</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="cal-caption text-muted-foreground uppercase tracking-wider font-mono">Voice Tone</label>
                        <div className="cal-input bg-surface-soft border-hairline text-ink font-mono">Direct & Persuasive</div>
                      </div>
                    </div>

                    {/* Live Paper Preview */}
                    <div className="md:col-span-7 bg-canvas border border-hairline p-4 rounded-lg font-mono text-sm leading-relaxed text-muted-foreground max-h-[160px] overflow-y-auto">
                      <p className="cal-title-sm text-ink mb-2">Subject: Application for React Developer position</p>
                      <p className="text-ink">Dear Google Careers Team,</p>
                      <p className="mt-2">
                        I am writing to express my enthusiasm for the Senior React Developer role. Having designed responsive frontend systems using React Server Components, I bring strong expertise in building developer-focused tooling...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Industry Insights - White Canvas - Product Mockup Card */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="industry-insights" 
          className="cal-section bg-canvas"
        >
          <div className="cal-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 order-last lg:order-first">
                <div className="cal-mockup-card">
                  {/* Window chrome bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                      <div className="size-2.5 rounded-full bg-surface-strong" />
                    </div>
                    <div className="flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1 rounded-md text-[11px] text-muted-foreground font-mono">
                      <span>pathfinder.co/insights</span>
                    </div>
                    <div className="w-6" />
                  </div>

                  {/* Insights Mock Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-hairline rounded-lg bg-surface-soft">
                      <span className="cal-caption text-muted-foreground uppercase tracking-wider font-mono block mb-1">Average Salary</span>
                      <div className="flex items-baseline gap-2">
                        <span className="cal-display-sm text-ink font-mono">$146,800</span>
                        <span className="cal-caption text-success font-bold font-mono">+4.2% YoY</span>
                      </div>
                    </div>
                    <div className="p-4 border border-hairline rounded-lg bg-surface-soft">
                      <span className="cal-caption text-muted-foreground uppercase tracking-wider font-mono block mb-1">Active Roles</span>
                      <div className="flex items-baseline gap-2">
                        <span className="cal-display-sm text-ink font-mono">1,248</span>
                        <span className="cal-caption text-brand-accent font-bold font-mono">Hiring Surge</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Salary Trend Line Chart */}
                  <div className="border border-hairline p-4 rounded-lg bg-surface-soft">
                    <span className="cal-caption text-muted-foreground uppercase tracking-wider font-mono block mb-4">Frontend Salary by Experience</span>
                    <div className="h-24 w-full flex items-end justify-between px-2 pt-2 relative">
                      <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-dashed border-hairline w-full" />
                        <div className="border-t border-dashed border-hairline w-full" />
                      </div>
                      <div className="w-10 bg-canvas hover:bg-surface-soft border border-hairline h-[25%] rounded-t flex items-center justify-center cal-caption text-muted-foreground font-mono">Entry</div>
                      <div className="w-10 bg-canvas hover:bg-surface-soft border border-hairline h-[45%] rounded-t flex items-center justify-center cal-caption text-muted-foreground font-mono">Mid</div>
                      <div className="w-10 bg-canvas hover:bg-surface-soft border border-hairline h-[70%] rounded-t flex items-center justify-center cal-caption text-muted-foreground font-mono">Senior</div>
                      <div className="w-10 bg-primary hover:bg-primary-active h-[90%] rounded-t flex items-center justify-center cal-caption text-on-primary font-bold font-mono">Lead</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <span className="cal-badge">
                  <TrendingUp className="size-3.5" />
                  <span>Market Analytics</span>
                </span>
                <h2 className="cal-display-lg text-ink">
                  Track Trends & Salaries In Realtime
                </h2>
                <p className="cal-body text-muted-foreground">
                  Stay ahead of hiring cycles. Access salary distributions, regional benchmarks, stack demand tracking, and specific requirements demanded by high-growth startups.
                </p>
                <div className="pt-2">
                  <Link href="/industry-insights" className="cal-button-secondary inline-flex items-center gap-2">
                    View Market Insights
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Visual Whiteboard / Tracker - Surface Card (Light Gray) - Feature Card Style */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="visual-whiteboard" 
          className="cal-section bg-surface-card"
        >
          <div className="cal-container">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="cal-badge">
                <Palette className="size-3.5" />
                <span>Application Kanban Board</span>
              </span>
              <h2 className="cal-display-lg text-ink mt-4">
                Track Applications Visually
              </h2>
              <p className="cal-body text-muted-foreground mt-4">
                Manage your job search pipeline in a beautiful drag-and-drop workspace. Group jobs into wishlist, applied, interviewing, and offers. Add custom notes, track requirements, and organize documents.
              </p>
            </div>

            {/* Application Tracker Banner */}
            <div className="cal-mockup-card group overflow-hidden relative">
              {/* Decorative accent */}
              <div className="absolute -top-24 -right-24 size-72 rounded-full bg-violet-500/[0.07] blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                {/* Left Content */}
                <div className="max-w-2xl space-y-5 relative">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                      <GitCommit className="size-6" />
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold">
                        Application Workspace
                      </span>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                        Application Tracker
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track every application from <span className="font-medium text-ink">Saved</span> to{" "}
                        <span className="font-medium text-ink">Offer</span>.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    Every saved job becomes an application workspace where you can organize
                    resumes, ATS reports, cover letters, personal notes, recruiter updates,
                    and monitor your hiring progress through a visual Kanban board.
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Saved Jobs
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> ATS Reports
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Cover Letters
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Personal Notes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs font-medium text-foreground/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Kanban Workflow
                    </span>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex flex-col items-start lg:items-end gap-4 relative">
                  <div className="rounded-2xl border border-hairline bg-surface-soft p-4 w-full lg:w-72">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                      Workflow
                    </p>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-foreground/5 flex items-center justify-center">
                          <Bookmark className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-ink">Saved</span>
                      </div>

                      <ArrowDown className="size-3.5 text-muted-foreground ml-6" />

                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Send className="size-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-ink">Applied</span>
                      </div>

                      <ArrowDown className="size-3.5 text-muted-foreground ml-6" />

                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <Users className="size-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="font-medium text-ink">Interview</span>
                      </div>

                      <ArrowDown className="size-3.5 text-muted-foreground ml-6" />

                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Trophy className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-ink">Offer</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/visual-whiteboard"
                    className="cal-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                  >
                    Open Application Tracker
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Band - Surface Card (Light Gray) */}
        <section className="cal-cta-band mx-auto max-w-[1200px] px-6 mb-[96px]">
          <div className="max-w-2xl mx-auto">
            <h2 className="cal-display-sm text-ink mb-4">
              Ready to land your dream job?
            </h2>
            <p className="cal-body text-muted-foreground mb-8">
              Join thousands of developers who&apos;ve accelerated their job search with AI-powered matching, ATS optimization, and tailored cover letters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home