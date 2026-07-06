"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Download,
  BrainCircuit,
  FileCheck,
  ChevronRight
} from "lucide-react";

interface EvaluationResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  feedback: string;
  fileUrl: string;
}

export default function ATSScorePage() {
  // Form states
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Upload/evaluation states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ["application/pdf", "text/plain"];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".txt") && !selectedFile.name.endsWith(".pdf")) {
        setError("Invalid file format. Please upload a PDF or TXT file.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ["application/pdf", "text/plain"];
      if (!validTypes.includes(droppedFile.type) && !droppedFile.name.endsWith(".txt") && !droppedFile.name.endsWith(".pdf")) {
        setError("Invalid file format. Please upload a PDF or TXT file.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your resume file.");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Please enter the target job title.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter the target job description.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Step 1: Uploading to storage
      setLoadingStep("Uploading resume to Cloudinary...");
      await new Promise((r) => setTimeout(r, 1000)); // micro-animation buffer

      // Step 2: Parsing & Analyzing
      setLoadingStep("Extracting text and analyzing with Gemini AI...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobTitle", jobTitle.trim());
      formData.append("jobDescription", jobDescription.trim());
      formData.append("jobType", jobType);

      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze ATS score.");
      }

      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Determine score color accent
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-rose-400 border-rose-500/30 bg-rose-500/5";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-400";
    if (score >= 50) return "stroke-amber-400";
    return "stroke-rose-400";
  };

  return (
    <div className="min-h-screen bg-[#070712] text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Decorative Blur glows */}
      <div className="absolute top-[72px] left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[300px] right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Header Title section */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-violet-400 bg-violet-500/5 border border-violet-500/10 mb-4 shadow-[0_0_15px_rgba(139,92,246,0.05)]">
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Resume Analyzer
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Resume ATS Grader
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl text-balance">
            Check your matching rate against target descriptions, identify missing skills, and optimize your resume to pass automated filters.
          </p>
        </div>

        {/* Outer Split Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Inputs Form Column */}
          <div className="lg:col-span-6 bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Configure Target Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Job Title */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                  Target Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-white/[0.04] transition-all font-medium"
                />
              </div>

              {/* Job Type */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                  Job Type
                </label>
                <div className="relative">
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-[#0c0c1b] appearance-none cursor-pointer transition-all font-medium"
                  >
                    <option value="Full-time" className="bg-[#0b0b18] text-white">Full-time</option>
                    <option value="Part-time" className="bg-[#0b0b18] text-white">Part-time</option>
                    <option value="Contract" className="bg-[#0b0b18] text-white">Contract</option>
                    <option value="Internship" className="bg-[#0b0b18] text-white">Internship</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/5 pl-3">
                    <span className="text-[9px] text-neutral-400">▼</span>
                  </div>
                </div>
              </div>

              {/* Target Job Description */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                  Target Job Description
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste the job requirements, responsibilities, and qualifications details here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:bg-white/[0.04] transition-all resize-y leading-relaxed font-medium"
                />
              </div>

              {/* File Upload Dropzone */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                  Upload Resume
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    file 
                      ? "border-violet-500/40 bg-violet-600/[0.02]" 
                      : "border-white/[0.08] hover:border-violet-500/30 hover:bg-white/[0.01]"
                  }`}
                  onClick={() => document.getElementById("resume-upload")?.click()}
                >
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col items-center">
                    {file ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3 shadow-[0_0_12px_rgba(139,92,246,0.1)]">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-white max-w-[280px] truncate block">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 mt-1">
                          {(file.size / 1024).toFixed(1)} KB • Click to swap file
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-violet-400 transition-colors mb-3">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-neutral-300">
                          Drag & drop or click to browse
                        </span>
                        <span className="text-[10px] text-neutral-500 mt-1">
                          Supports PDF and TXT formats only
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Error messages block */}
              {error && (
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-rose-400 leading-relaxed font-semibold">
                    {error}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.25)]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Calculating Score...</span>
                  </>
                ) : (
                  <>
                    <span>Calculate ATS Score</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* RIGHT: Results Display Column */}
          <div className="lg:col-span-6 h-full">
            {loading ? (
              /* Processing animated screen */
              <div className="bg-[#0b0b18]/50 border border-white/[0.04] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[500px] animate-pulse">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border border-violet-500/10 border-t-violet-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Analyzing Resume Match</h3>
                <p className="text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
                  {loadingStep}
                </p>
              </div>
            ) : result ? (
              /* Report Dashboard Card */
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-scale-up space-y-6">
                
                {/* Score Header section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/[0.04]">
                  {/* Gauge */}
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="stroke-white/[0.02]"
                        strokeWidth="2.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${getScoreProgressColor(result.score)} transition-all duration-1000 ease-out`}
                        strokeWidth="2.5"
                        strokeDasharray={`${result.score}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-2xl font-extrabold text-white block leading-none">
                        {result.score}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold">
                        Match Rating
                      </span>
                    </div>
                  </div>

                  {/* Rating Description */}
                  <div className="text-center sm:text-left">
                    <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-center sm:justify-start gap-2">
                      ATS Suitability Match
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getScoreColor(result.score)}`}>
                        {result.score >= 80 ? "Strong Match" : result.score >= 50 ? "Moderate Match" : "Weak Match"}
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                      {result.feedback}
                    </p>
                  </div>
                </div>

                {/* Missing Keywords list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1">
                    Missing Keywords & Skills
                  </h4>
                  {result.missingKeywords.length === 0 ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Excellent! No critical missing keywords found.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center gap-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-rose-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions List */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1">
                    Recruiter Recommendations
                  </h4>
                  <div className="flex flex-col gap-2">
                    {result.suggestions.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs leading-relaxed font-medium text-neutral-300"
                      >
                        <ChevronRight className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                  <a
                    href={result.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Resume
                  </a>

                  <span className="text-[10px] text-neutral-500 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    ATS Optimization System
                  </span>
                </div>

              </div>
            ) : (
              /* Empty / Initial State */
              <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-neutral-500 mb-4 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Ready for ATS Evaluation</h3>
                <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-medium">
                  Configure your target job specifications on the left, upload your resume file, and click parse to generate suitability matching ratings and recommendations.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}