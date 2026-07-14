"use client";

import React, { useState, useEffect } from "react";
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
  
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get("applicationId");
    if (appId) {
      setTimeout(() => setApplicationId(appId), 0);
      // Fetch details to auto-fill
      fetch(`/api/application-tracker`)
        .then((res) => res.json())
        .then((data) => {
          const matchedApp = data.find((a: { id: number; job: { title: string; description: string | null } }) => a.id === Number(appId));
          if (matchedApp) {
            setJobTitle(matchedApp.job.title);
            setJobDescription(matchedApp.job.description || "");
          }
        })
        .catch((err) => console.error("Auto-fill error:", err));
    }
  }, []);
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
      if (applicationId) {
        formData.append("applicationId", applicationId);
      }

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
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10";
    if (score >= 50) return "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10";
    return "text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500 dark:stroke-emerald-400";
    if (score >= 50) return "stroke-amber-500 dark:stroke-amber-400";
    return "stroke-red-500 dark:stroke-red-400";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="vertex-container">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14">
          {applicationId && (
            <div className="mb-6">
              <a
                href="/visual-whiteboard"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                ← Back to Application Tracker
              </a>
            </div>
          )}
          
          {/* Header Title section */}
          <div className="flex flex-col items-center text-center mb-10 md:mb-12 animate-vertex-fade-in">
            <div className="vertex-badge mb-4">
              <BrainCircuit className="size-3.5" />
              AI Resume Analyzer
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-3">
              Resume ATS Grader
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl text-balance">
              Check your matching rate against target descriptions, identify missing skills, and optimize your resume to pass automated filters.
            </p>
          </div>

          {/* Outer Split Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-vertex-slide-up">
            
            {/* LEFT: Inputs Form Column */}
            <div className="lg:col-span-6 vertex-card p-5 md:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                Configure Target Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Job Title */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="vertex-input"
                  />
                </div>

                {/* Job Type */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                    Job Type
                  </label>
                  <div className="relative">
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="vertex-input appearance-none cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-xs text-muted-foreground">▼</span>
                    </div>
                  </div>
                </div>

                {/* Target Job Description */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                    Target Job Description
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Paste the job requirements, responsibilities, and qualifications details here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="vertex-input resize-y leading-relaxed"
                  />
                </div>

                {/* File Upload Dropzone */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                    Upload Resume
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      file 
                        ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5" 
                        : "border-border hover:border-foreground/20 hover:bg-muted/50"
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
                          <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                            <FileCheck className="size-5" />
                          </div>
                          <span className="text-xs font-medium text-foreground max-w-[280px] truncate block">
                            {file.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground mt-1">
                            {(file.size / 1024).toFixed(1)} KB · Click to swap file
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="size-10 rounded-xl bg-muted border flex items-center justify-center text-muted-foreground mb-3">
                            <UploadCloud className="size-5" />
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            Drag & drop or click to browse
                          </span>
                          <span className="text-[11px] text-muted-foreground mt-1">
                            Supports PDF and TXT formats only
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error messages block */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2.5">
                    <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-xs text-destructive leading-relaxed font-medium">
                      {error}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full vertex-cta flex items-center justify-center gap-1.5 py-5 rounded-lg text-sm font-medium"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1.5 size-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Calculating Score...</span>
                    </>
                  ) : (
                    <>
                      <span>Calculate ATS Score</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* RIGHT: Results Display Column */}
            <div className="lg:col-span-6 h-full">
              {loading ? (
                /* Processing animated screen */
                <div className="vertex-card p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
                  <div className="relative mb-6">
                    <div className="size-16 rounded-full border-2 border-border border-t-foreground animate-spin" />
                    <Sparkles className="size-6 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Analyzing Resume Match</h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    {loadingStep}
                  </p>
                </div>
              ) : result ? (
                /* Report Dashboard Card */
                <div className="vertex-card p-5 md:p-6 space-y-6 animate-vertex-fade-in">
                  
                  {/* Score Header section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
                    {/* Gauge */}
                    <div className="relative size-28 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="stroke-muted"
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
                        <span className="text-2xl font-semibold text-foreground block leading-none">
                          {result.score}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-medium">
                          Match Rating
                        </span>
                      </div>
                    </div>

                    {/* Rating Description */}
                    <div className="text-center sm:text-left">
                      <h3 className="text-base font-semibold text-foreground mb-1.5 flex items-center justify-center sm:justify-start gap-2">
                        ATS Suitability Match
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getScoreColor(result.score)}`}>
                          {result.score >= 80 ? "Strong Match" : result.score >= 50 ? "Moderate Match" : "Weak Match"}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.feedback}
                      </p>
                    </div>
                  </div>

                  {/* Missing Keywords list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Missing Keywords & Skills
                    </h4>
                    {result.missingKeywords.length === 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-2.5 rounded-xl">
                        <CheckCircle2 className="size-4 shrink-0" />
                        Excellent! No critical missing keywords found.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingKeywords.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-[11px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-center gap-1"
                          >
                            <span className="size-1 rounded-full bg-red-500" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggestions List */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Recruiter Recommendations
                    </h4>
                    <div className="flex flex-col gap-2">
                      {result.suggestions.map((rec, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-relaxed text-foreground/80"
                        >
                          <ChevronRight className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="pt-4 border-t flex items-center justify-between">
                    <a
                      href={result.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vertex-outline inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium"
                    >
                      <Download className="size-3.5" />
                      Download Resume
                    </a>

                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <TrendingUp className="size-3.5" />
                      ATS Optimization System
                    </span>
                  </div>

                </div>
              ) : (
                /* Empty / Initial State */
                <div className="vertex-card p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
                  <div className="size-12 bg-muted border rounded-2xl flex items-center justify-center text-muted-foreground mb-4 animate-pulse">
                    <Sparkles className="size-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Ready for ATS Evaluation</h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Configure your target job specifications on the left, upload your resume file, and click parse to generate suitability matching ratings and recommendations.
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}