"use client";

import React, { useState } from "react";
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
    <div className="min-h-screen bg-[#070712] text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Background decorations */}
      <div className="absolute top-[72px] left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-1/3 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Title area */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-violet-400 bg-violet-500/5 border border-violet-500/10 mb-4 shadow-[0_0_15px_rgba(139,92,246,0.05)]">
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Document Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Cover Letter Writer
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl text-balance">
            Generate custom cover letters tailored directly to a target job role. Optimize based on your selected communication style in seconds.
          </p>
        </div>

        {/* Split Workstation layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Generator Inputs Form */}
          <div className="lg:col-span-6 bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Configure Target Details
            </h2>

            <form onSubmit={handleGenerate} className="space-y-5">
              
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

              {/* Job Description */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1.5 ml-1">
                  Target Job Description
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste target job responsibilities and requirement keywords details here..."
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
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
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
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-2.5 shadow-[0_0_12px_rgba(139,92,246,0.1)]">
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
                        <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-violet-400 transition-colors mb-2.5">
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

              {/* Tone/Approach Selection Pills */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block ml-1">
                  Drafting Approach
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["Direct", "Longer", "Shorter", "Persuasive"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setApproach(style)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        approach === style
                          ? "bg-violet-600/10 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                          : "bg-white/[0.01] border-white/[0.06] text-neutral-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
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
                    <span>Drafting Letter...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Cover Letter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* RIGHT: Letter Output and Textarea Editor */}
          <div className="lg:col-span-6 h-full">
            {loading ? (
              /* Processing state */
              <div className="bg-[#0b0b18]/50 border border-white/[0.04] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[520px] animate-pulse">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border border-violet-500/10 border-t-violet-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Generating Cover Letter</h3>
                <p className="text-xs text-neutral-400 font-medium max-w-sm leading-relaxed">
                  Extracting profile coordinates and drafting in {approach.toLowerCase()} tone...
                </p>
              </div>
            ) : coverLetterText ? (
              /* Editable Workspace Editor */
              <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-scale-up space-y-4">
                
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Generated Letter Draft
                    </span>
                  </div>
                  
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-violet-500/30 text-violet-400 bg-violet-500/5">
                    {approach} Tone
                  </span>
                </div>

                {/* Editable Textarea Body */}
                <textarea
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-xl p-4 text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/30 transition-all font-mono leading-relaxed min-h-[400px] resize-y"
                  placeholder="Your generated cover letter will show here..."
                />

                {/* Actions utility bar */}
                <div className="flex flex-wrap gap-3 items-center justify-between pt-3 border-t border-white/[0.04]">
                  
                  {/* Copy Button */}
                  <button
                    onClick={handleCopyToClipboard}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-300 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Copy Clipboard</span>
                      </>
                    )}
                  </button>

                  {/* Export PDF Button */}
                  <Button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.2)] active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </Button>

                </div>

              </div>
            ) : (
              /* Empty Initial State screen */
              <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[520px]">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-neutral-500 mb-4 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Ready to Draft</h3>
                <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-medium">
                  Upload your resume, target job details, select a drafting approach from the left panel, and click generate to build your professional cover letter.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}