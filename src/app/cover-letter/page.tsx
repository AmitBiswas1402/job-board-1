"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  ArrowRight,
  BrainCircuit,
  FileCheck,
  AlertCircle
} from "lucide-react";

export default function CoverLetterPage() {
  // Input states
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [approach, setApproach] = useState<"Direct" | "Longer" | "Shorter" | "Persuasive">("Direct");
  
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

  // Status/Result states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleGenerate = async (e: React.FormEvent) => {
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
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobTitle", jobTitle.trim());
      formData.append("jobDescription", jobDescription.trim());
      formData.append("approach", approach);
      if (applicationId) {
        formData.append("applicationId", applicationId);
      }

      const res = await fetch("/api/cover-letter", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter.");
      }

      setCoverLetterText(data.coverLetter);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An unexpected error occurred during cover letter generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!coverLetterText) return;
    try {
      await navigator.clipboard.writeText(coverLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleDownloadPDF = () => {
    if (!coverLetterText) return;
    
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Page layout configuration
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const margin = 20;
      const width = 170; // 210mm - (2 * 20mm)
      const pageHeight = 297;

      // Wrap text lines to margins
      const lines = doc.splitTextToSize(coverLetterText, width);
      let cursorY = 25;

      for (let i = 0; i < lines.length; i++) {
        // Add new page if cursor goes out of printable bounds
        if (cursorY > pageHeight - 25) {
          doc.addPage();
          cursorY = 25;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += 6.5; // Line-height spacing
      }

      const fileTitle = jobTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_") || "cover_letter";
      doc.save(`${fileTitle}_cover_letter.pdf`);
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
      setError("Failed to export PDF file.");
    }
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
          
          {/* Title area */}
          <div className="flex flex-col items-center text-center mb-10 md:mb-12 animate-vertex-fade-in">
            <div className="vertex-badge mb-4">
              <BrainCircuit className="size-3.5" />
              AI Document Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mb-3">
              Cover Letter Writer
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl text-balance">
              Generate custom cover letters tailored directly to a target job role. Optimize based on your selected communication style in seconds.
            </p>
          </div>

          {/* Split Workstation layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-vertex-slide-up">
            
            {/* LEFT: Generator Inputs Form */}
            <div className="lg:col-span-6 vertex-card p-5 md:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                Configure Target Details
              </h2>

              <form onSubmit={handleGenerate} className="space-y-5">
                
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

                {/* Job Description */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5 ml-1">
                    Target Job Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Paste target job responsibilities and requirement keywords details here..."
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
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
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
                          <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2.5">
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
                          <div className="size-10 rounded-xl bg-muted border flex items-center justify-center text-muted-foreground mb-2.5">
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

                {/* Tone/Approach Selection Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block ml-1">
                    Drafting Approach
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["Direct", "Longer", "Shorter", "Persuasive"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setApproach(style)}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          approach === style
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
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
                      <span>Drafting Letter...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Cover Letter</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* RIGHT: Letter Output and Textarea Editor */}
            <div className="lg:col-span-6 h-full">
              {loading ? (
                /* Processing state */
                <div className="vertex-card p-8 text-center flex flex-col items-center justify-center min-h-[520px]">
                  <div className="relative mb-6">
                    <div className="size-16 rounded-full border-2 border-border border-t-foreground animate-spin" />
                    <Sparkles className="size-6 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Generating Cover Letter</h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Extracting profile coordinates and drafting in {approach.toLowerCase()} tone...
                  </p>
                </div>
              ) : coverLetterText ? (
                /* Editable Workspace Editor */
                <div className="vertex-card p-5 md:p-6 space-y-4 animate-vertex-fade-in">
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Generated Letter Draft
                      </span>
                    </div>
                    
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border text-foreground bg-muted">
                      {approach} Tone
                    </span>
                  </div>

                  {/* Editable Textarea Body */}
                  <textarea
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    className="vertex-input font-mono leading-relaxed min-h-[400px] resize-y"
                    placeholder="Your generated cover letter will show here..."
                  />

                  {/* Actions utility bar */}
                  <div className="flex flex-wrap gap-3 items-center justify-between pt-3 border-t">
                    
                    {/* Copy Button */}
                    <button
                      onClick={handleCopyToClipboard}
                      className="vertex-outline inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5 text-muted-foreground" />
                          <span>Copy Clipboard</span>
                        </>
                      )}
                    </button>

                    {/* Export PDF Button */}
                    <Button
                      onClick={handleDownloadPDF}
                      className="vertex-cta inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium active:scale-95"
                    >
                      <Download className="size-3.5" />
                      <span>Download PDF</span>
                    </Button>

                  </div>

                </div>
              ) : (
                /* Empty Initial State screen */
                <div className="vertex-card p-8 text-center flex flex-col items-center justify-center min-h-[520px]">
                  <div className="size-12 bg-muted border rounded-2xl flex items-center justify-center text-muted-foreground mb-4 animate-pulse">
                    <Sparkles className="size-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Ready to Draft</h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Upload your resume, target job details, select a drafting approach from the left panel, and click generate to build your professional cover letter.
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