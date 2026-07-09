"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Briefcase,
  MapPin,
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Archive,
  ArchiveRestore,
  ExternalLink,
  Plus,
  X,
  CheckCircle2,
  GitCommit,
  Columns,
  Trash2,
  Globe
} from "lucide-react";
import { jsPDF } from "jspdf";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor
} from "@dnd-kit/core";

// Define TypeScript interfaces matching database payload
interface JobData {
  id: number;
  externalJobId: string | null;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string | null;
  employmentType: string | null;
  salary: string | null;
  description: string | null;
  applyUrl: string | null;
  source: string | null;
}

interface ResumeData {
  id: number;
  title: string;
  fileName: string;
  fileUrl: string;
}

interface CoverLetterData {
  id: number;
  title: string;
  content: string;
}

interface AtsReportData {
  id: number;
  score: number;
  missingKeywords: string | null; // JSON string array
  suggestions: string | null;
}

interface Application {
  id: number;
  status: string; // Saved, Applied, Assessment, Interview, HR, Offer, Rejected
  notes: string | null;
  archived: boolean;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  job: JobData;
  resume: ResumeData | null;
  coverLetter: CoverLetterData | null;
  atsReport: AtsReportData | null;
}

// Kanban stages
const STAGES = [
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "HR",
  "Offer",
  "Rejected"
];

export default function VisualWhiteboardPage() {
  const [mounted, setMounted] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // View Mode: kanban vs whiteboard
  const [viewMode, setViewMode] = useState<"kanban" | "whiteboard">("kanban");

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showArchived, setShowArchived] = useState(false);
  
  // Selected Application for Drawer
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  
  // Active dragging card ID
  const [activeDragId, setActiveDragId] = useState<number | null>(null);

  const [localNotes, setLocalNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isArchiving, setIsArchiving] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Drawer UI state toggles
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [atsExpanded, setAtsExpanded] = useState(false);
  const [letterPreviewOpen, setLetterPreviewOpen] = useState(false);

  // Fetch applications on load
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/application-tracker");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load applications.");
      }
      setApplications(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      fetchApplications();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAutoSaveNotes = async (appId: number, notesValue: string) => {
    try {
      setSaveStatus("saving");
      const res = await fetch("/api/application-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          notes: notesValue
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save notes.");
      }
      
      // Update applications state locally
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, notes: notesValue } : app))
      );
      setSaveStatus("saved");
    } catch (err: unknown) {
      console.error("Auto-save notes error:", err);
      setSaveStatus("error");
    }
  };

  // Auto-Save Debounce Effect for Personal Notes
  useEffect(() => {
    const activeApp = applications.find(a => a.id === selectedAppId);
    if (!activeApp) return;

    // Check if notes have actually changed from the DB value
    if (localNotes === (activeApp.notes || "")) {
      return;
    }

    const timer = setTimeout(() => {
      handleAutoSaveNotes(activeApp.id, localNotes);
    }, 1000); // 1-second debounce

    return () => clearTimeout(timer);
  }, [localNotes, selectedAppId, applications]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(Number(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const appId = Number(active.id);
    const newStatus = String(over.id);

    // Find the current application state
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp || targetApp.status === newStatus) return;

    // Optimistically update the UI status state
    const previousApps = [...applications];
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus, updatedAt: new Date().toISOString() } : app))
    );

    try {
      const res = await fetch("/api/application-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          status: newStatus
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status on server.");
      }
    } catch (err: unknown) {
      console.error(err);
      // Revert on error
      setApplications(previousApps);
    }
  };

  // Direct status update (for whiteboard connectors)
  const handleUpdateStatusDirect = async (appId: number, newStatus: string) => {
    const previousApps = [...applications];
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus, updatedAt: new Date().toISOString() } : app))
    );

    try {
      const res = await fetch("/api/application-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          status: newStatus
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status.");
      }
    } catch (err: unknown) {
      console.error(err);
      setApplications(previousApps);
    }
  };



  const handleToggleArchive = async (appId: number, currentArchived: boolean) => {
    try {
      setIsArchiving(true);
      const newArchived = !currentArchived;
      const res = await fetch("/api/application-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          archived: newArchived
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update archive state.");
      }

      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, archived: newArchived } : app))
      );
      
      // Close drawer if archived and showArchived is false
      if (newArchived && !showArchived) {
        setSelectedAppId(null);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(errorMessage || "Failed to update archive status.");
    } finally {
      setIsArchiving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  if (!mounted) return null;

  // Filter & Sort applications
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArchive = showArchived ? true : !app.archived;
    return matchesSearch && matchesArchive;
  });

  // Sort
  const sortedApps = [...filteredApps].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortBy === "newest" ? timeB - timeA : timeA - timeB;
  });

  const selectedApp = applications.find(a => a.id === selectedAppId);

  const handleOpenAppDrawer = (app: Application) => {
    setSelectedAppId(app.id);
    setLocalNotes(app.notes || "");
    setShowMoreDesc(false);
    setAtsExpanded(false);
    setLetterPreviewOpen(false);
  };



  const handleDeleteApplication = async (appId: number) => {
    if (!confirm("Are you sure you want to delete this job folder? All linked notes and materials will be removed.")) return;
    
    try {
      const res = await fetch(`/api/application-tracker?applicationId=${appId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete application.");
      }
      
      // Update local state list
      setApplications(prev => prev.filter(app => app.id !== appId));
      setSelectedAppId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const downloadCoverLetterPdf = (company: string, title: string, content: string) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const margin = 20;
      const width = 170; // 210mm - 40mm
      const pageHeight = 297;

      const lines = doc.splitTextToSize(content, width);
      let cursorY = 25;

      for (let i = 0; i < lines.length; i++) {
        if (cursorY > pageHeight - 25) {
          doc.addPage();
          cursorY = 25;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += 6; // Line height
      }

      const fileTitle = `${company.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")}_cover_letter.pdf`;
      doc.save(fileTitle);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF file.");
    }
  };

  // Top level statistics
  const stats = {
    Saved: applications.filter(a => a.status === "Saved" && !a.archived).length,
    Applied: applications.filter(a => a.status === "Applied" && !a.archived).length,
    Interview: applications.filter(a => a.status === "Interview" && !a.archived).length,
    Offer: applications.filter(a => a.status === "Offer" && !a.archived).length,
  };

  return (
    <div className="min-h-screen bg-[#070712] text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Radial ambient background glows */}
      <div className="absolute top-[72px] left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[300px] right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-8 py-8 flex flex-col space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <ClipboardCheck className="w-8 h-8 text-violet-400" />
              Application Tracker
            </h1>
            <p className="text-xs text-neutral-400 mt-1.5">
              The central hub managing saved jobs, resumes, ATS matching reports, and cover letters.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle Buttons */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 flex items-center">
              <button
                onClick={() => setViewMode("kanban")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("whiteboard")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "whiteboard"
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                Whiteboard
              </button>
            </div>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showArchived
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  : "bg-white/[0.02] text-neutral-400 border-white/[0.06] hover:bg-white/[0.05]"
              }`}
            >
              {showArchived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
              {showArchived ? "Hide Archived" : "Show Archived"}
            </button>
          </div>
        </div>

        {/* Statistics Cards Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Saved Jobs</span>
            <h3 className="text-2xl font-black text-white mt-1">{stats.Saved}</h3>
          </div>
          <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400">Applications Sent</span>
            <h3 className="text-2xl font-black text-cyan-400 mt-1">{stats.Applied}</h3>
          </div>
          <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-violet-400">Interviews Scheduled</span>
            <h3 className="text-2xl font-black text-violet-400 mt-1">{stats.Interview}</h3>
          </div>
          <div className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">Offers Received</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.Offer}</h3>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-[#0b0b18]/80 border border-white/[0.05] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company or job title..."
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all placeholder-neutral-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-neutral-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort Order:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer pr-8 relative font-medium font-sans"
            >
              <option value="newest" className="bg-[#0b0b18]">Newest First</option>
              <option value="oldest" className="bg-[#0b0b18]">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Global Error message */}
        {error && (
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-xs text-rose-400 font-semibold">{error}</span>
          </div>
        )}

        {/* Dnd Board / Whiteboard Workspaces */}
        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl animate-pulse">
            <div className="w-10 h-10 rounded-full border border-violet-500/10 border-t-violet-500 animate-spin mb-4" />
            <h3 className="text-sm font-bold text-white mb-1">Loading Application Workspace</h3>
            <p className="text-xs text-neutral-400">Syncing jobs metadata and file attachments...</p>
          </div>
        ) : viewMode === "kanban" ? (
          /* Kanban Board View */
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-wrap gap-4 items-start select-none justify-start pb-4">
              
              {STAGES.map((stage) => {
                const stageApps = sortedApps.filter(app => app.status === stage);
                return (
                  <KanbanColumn key={stage} id={stage} title={stage} count={stageApps.length}>
                    {stageApps.map((app) => (
                      <DraggableCard
                        key={app.id}
                        app={app}
                        onClick={() => handleOpenAppDrawer(app)}
                      />
                    ))}
                  </KanbanColumn>
                );
              })}

            </div>

            {/* Drag Overlay visual layout */}
            <DragOverlay>
              {activeDragId ? (
                <div className="bg-[#0f0f27] border border-violet-500/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(139,92,246,0.15)] opacity-90 cursor-grabbing scale-95 transition-transform duration-200">
                  {(() => {
                    const activeApp = applications.find(a => a.id === activeDragId);
                    if (!activeApp) return null;
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://logo.clearbit.com/${activeApp.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${activeApp.job.company}&background=8B5CF6&color=fff&size=32`;
                            }}
                            className="w-8 h-8 rounded-lg object-contain bg-white/5 p-1 shrink-0"
                            alt="avatar"
                          />
                          <div className="min-w-0 font-sans">
                            <h4 className="text-xs font-bold text-white truncate">{activeApp.job.company}</h4>
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5">{activeApp.job.title}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          /* Whiteboard Pipeline View */
          <div className="space-y-6">
            {sortedApps.length === 0 ? (
              <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-12 text-center">
                <p className="text-xs text-neutral-400">No applications match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedApps.map((app) => {
                  const isReadyToApply = app.status === "Saved" && app.resume && app.atsReport && app.coverLetter;
                  const activeStageIndex = STAGES.indexOf(app.status);

                  return (
                    <div
                      key={app.id}
                      className="bg-[#0b0b18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/25 transition-all duration-300 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_4px_25px_rgba(0,0,0,0.15)]"
                    >
                      {/* Left: Job Card Meta details */}
                      <div className="flex items-center gap-4 min-w-[280px]">
                        <img
                          src={`https://logo.clearbit.com/${app.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${app.job.company}&background=8B5CF6&color=fff&size=40`;
                          }}
                          className="w-10 h-10 rounded-xl object-contain bg-white/5 p-2 shrink-0 border border-white/[0.04]"
                          alt={app.job.company}
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-white truncate leading-snug">{app.job.company}</h4>
                          <p className="text-xs text-neutral-400 font-bold truncate mt-0.5 leading-snug">{app.job.title}</p>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {app.resume && (
                              <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                                Resume ✓
                              </span>
                            )}
                            {app.atsReport && (
                              <span className="text-[8px] font-extrabold text-violet-300 bg-violet-500/5 border border-violet-500/10 px-1.5 py-0.5 rounded">
                                ATS: {app.atsReport.score}%
                              </span>
                            )}
                            {app.coverLetter && (
                              <span className="text-[8px] font-extrabold text-cyan-300 bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.5 rounded">
                                Cover Letter ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Connected SVG/CSS Stage pipeline */}
                      <div className="flex-1 w-full overflow-x-auto py-2">
                        <div className="flex items-center gap-1 min-w-[650px] relative justify-between">
                          
                          {STAGES.map((stage, idx) => {
                            const isCompleted = idx <= activeStageIndex;
                            const isActive = idx === activeStageIndex;
                            
                            // Color schema based on stage status
                            let stageColor = "border-white/10 text-neutral-500";
                            let lineColor = "bg-white/[0.04]";
                            
                            if (isCompleted) {
                              if (stage === "Rejected") {
                                stageColor = isActive 
                                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                                  : "border-rose-500/20 bg-rose-500/5 text-rose-500/80";
                                lineColor = "bg-rose-500/20";
                              } else if (stage === "Offer") {
                                stageColor = isActive 
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                                  : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500/80";
                                lineColor = "bg-emerald-500/20";
                              } else {
                                stageColor = isActive
                                  ? "border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                                  : "border-violet-500/20 bg-violet-500/5 text-violet-400/80";
                                lineColor = "bg-violet-500/20";
                              }
                            }

                            return (
                              <React.Fragment key={stage}>
                                {/* Node Button */}
                                <button
                                  onClick={() => handleUpdateStatusDirect(app.id, stage)}
                                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all ${stageColor} hover:scale-105 active:scale-95`}
                                  title={`Click to shift folder to ${stage}`}
                                >
                                  {stage}
                                </button>

                                {/* Connector Line (except last item) */}
                                {idx < STAGES.length - 1 && (
                                  <div className={`h-[1.5px] flex-1 min-w-[20px] ${lineColor} rounded-full transition-all`} />
                                )}
                              </React.Fragment>
                            );
                          })}

                        </div>
                      </div>

                      {/* Right: Actions Callouts */}
                      <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                        {isReadyToApply && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready To Apply
                          </div>
                        )}
                        <button
                          onClick={() => handleOpenAppDrawer(app)}
                          className="px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-violet-400 bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 hover:text-violet-300 transition-all flex items-center gap-0.5"
                        >
                          Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Drawer Overlay Modal Sidebar */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedAppId(null)} />

          {/* Drawer Inner Panel */}
          <div className="relative w-full max-w-xl h-full bg-[#090916] border-l border-l-white/[0.06] shadow-2xl flex flex-col z-10 animate-slide-in">
            
            {/* STICKY HEADER */}
            <div className="sticky top-0 bg-[#090916]/95 backdrop-blur-md z-20 border-b border-white/[0.05] p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://logo.clearbit.com/${selectedApp.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedApp.job.company}&background=8B5CF6&color=fff&size=48`;
                    }}
                    className="w-12 h-12 rounded-xl object-contain bg-white/5 p-2 shrink-0 border border-white/[0.06]"
                    alt="avatar"
                  />
                  <div>
                    <h2 className="text-base font-black text-white leading-tight">{selectedApp.job.company}</h2>
                    <h3 className="text-xs text-neutral-400 font-bold mt-0.5">{selectedApp.job.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
                        {selectedApp.status}
                      </span>
                      {selectedApp.archived && (
                        <span className="text-[9px] uppercase tracking-wider font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAppId(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all border border-white/[0.04]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-text">
              
              {/* Section 2: Quick Overview */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-neutral-400 border-b border-white/[0.04] pb-5">
                {selectedApp.job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{selectedApp.job.location}</span>
                  </div>
                )}
                {selectedApp.job.employmentType && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{selectedApp.job.employmentType}</span>
                  </div>
                )}
                {selectedApp.job.salary && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-extrabold text-sm">💰</span>
                    <span className="text-emerald-400 font-extrabold">{selectedApp.job.salary}</span>
                  </div>
                )}
                {selectedApp.job.applyUrl && (
                  <a
                    href={selectedApp.job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-violet-400 hover:underline font-bold"
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>Source Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Section 3: Resume */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Resume</h4>
                {selectedApp.resume ? (
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-violet-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{selectedApp.resume.fileName}</p>
                        <p className="text-[9px] text-neutral-500 font-bold mt-0.5">Linked to folder</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={selectedApp.resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-[10px] font-black text-white bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-1 border border-white/[0.04] transition-all"
                      >
                        View <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`/ats-score?applicationId=${selectedApp.id}`}
                        className="px-3 py-1.5 text-[10px] font-black text-neutral-400 hover:text-white bg-white/[0.01] hover:bg-white/5 rounded-xl border border-white/[0.04] transition-all"
                      >
                        Replace
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.01] border border-dashed border-white/[0.08] rounded-2xl p-6 text-center">
                    <p className="text-xs text-neutral-400 mb-3">No Resume Attached</p>
                    <a
                      href={`/ats-score?applicationId=${selectedApp.id}`}
                      className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" /> Upload Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Section 4: ATS */}
              <div className="space-y-3 border-t border-white/[0.04] pt-6">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">ATS Report</h4>
                {selectedApp.atsReport ? (
                  <div className="bg-[#0b0b18] border border-white/[0.05] rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-white block">Gemini Scoring Benchmark</span>
                        <span className="text-[10px] text-emerald-400 font-extrabold mt-0.5 block">
                          {selectedApp.atsReport.score >= 80 ? "Excellent Match" : selectedApp.atsReport.score >= 60 ? "Good Match" : "Needs Optimization"}
                        </span>
                      </div>
                      <span className="text-sm font-black text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded-lg border border-emerald-500/10 font-bold">
                        {selectedApp.atsReport.score}% Match
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full animate-progress"
                        style={{ width: `${selectedApp.atsReport.score}%` }}
                      />
                    </div>

                    {/* Collapsible View Report Details */}
                    {atsExpanded && (
                      <div className="space-y-4 pt-3 border-t border-white/[0.04] animate-fade-in">
                        {selectedApp.atsReport.missingKeywords && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">
                              Missing Keywords
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {(() => {
                                try {
                                  const keywords: string[] = JSON.parse(selectedApp.atsReport.missingKeywords || "[]");
                                  if (!keywords || keywords.length === 0) return <span className="text-xs text-neutral-500">None detected</span>;
                                  return keywords.map((k, i) => (
                                    <span key={i} className="px-2 py-0.5 text-[9px] font-bold text-rose-300 bg-rose-500/5 border border-rose-500/10 rounded">
                                      {k}
                                    </span>
                                  ));
                                } catch {
                                  return <span className="text-xs text-neutral-400">{selectedApp.atsReport.missingKeywords}</span>;
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        {selectedApp.atsReport.suggestions && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">
                              Suggestions
                            </p>
                            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                              {selectedApp.atsReport.suggestions}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setAtsExpanded(!atsExpanded)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white border border-white/[0.04] transition-all text-center font-bold"
                    >
                      {atsExpanded ? "Hide Details" : "View Report"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/[0.01] border border-dashed border-white/[0.08] rounded-2xl p-6 text-center">
                    <p className="text-xs text-neutral-400 mb-3">No ATS Report</p>
                    <a
                      href={`/ats-score?applicationId=${selectedApp.id}`}
                      className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Run ATS Assessment
                    </a>
                  </div>
                )}
              </div>

              {/* Section 5: Cover Letter */}
              <div className="space-y-3 border-t border-white/[0.04] pt-6">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Cover Letter</h4>
                {selectedApp.coverLetter ? (
                  <div className="bg-[#0b0b18] border border-white/[0.05] rounded-2xl p-4 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-white block">{selectedApp.coverLetter.title}</span>
                      <span className="text-[9px] text-neutral-500 font-bold mt-0.5 block">Linked to folder</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setLetterPreviewOpen(!letterPreviewOpen)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white border border-white/[0.04] transition-all text-center font-bold"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => copyToClipboard(selectedApp.coverLetter!.content)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white border border-white/[0.04] transition-all text-center font-bold"
                      >
                        {copiedLetter ? "✓ Copied" : "Copy"}
                      </button>
                      <button
                        onClick={() => downloadCoverLetterPdf(selectedApp.job.company, selectedApp.coverLetter!.title, selectedApp.coverLetter!.content)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white border border-white/[0.04] transition-all text-center font-bold"
                      >
                        Download
                      </button>
                    </div>

                    {/* Preview collapsing letter block */}
                    {letterPreviewOpen && (
                      <textarea
                        readOnly
                        value={selectedApp.coverLetter.content}
                        className="w-full h-40 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs text-neutral-300 focus:outline-none resize-none font-medium leading-relaxed"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-white/[0.01] border border-dashed border-white/[0.08] rounded-2xl p-6 text-center">
                    <p className="text-xs text-neutral-400 mb-3">No Cover Letter Generated</p>
                    <a
                      href={`/cover-letter?applicationId=${selectedApp.id}`}
                      className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      <FileText className="w-4 h-4" /> Draft Cover Letter
                    </a>
                  </div>
                )}
              </div>

              {/* Section 6: Notes */}
              <div className="space-y-3 border-t border-white/[0.04] pt-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 flex items-center gap-1.5">
                    <span>📝 Personal Notes</span>
                  </h4>
                  <div className="text-[10px] font-bold">
                    {saveStatus === "saving" && (
                      <span className="text-amber-400 animate-pulse">Saving...</span>
                    )}
                    {saveStatus === "saved" && (
                      <span className="text-emerald-400">✓ Saved</span>
                    )}
                    {saveStatus === "error" && (
                      <span className="text-rose-400">Failed to save</span>
                    )}
                  </div>
                </div>
                
                <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                  Keep reminders, follow-ups, recruiter details, interview tips, or anything related to this application.
                </p>

                <div className="space-y-2">
                  <textarea
                    value={localNotes}
                    onChange={(e) => {
                      if (e.target.value.length <= 2000) {
                        setLocalNotes(e.target.value);
                        setSaveStatus("saving");
                      }
                    }}
                    placeholder="E.g. Applied through LinkedIn. Recruiter Sarah. Follow-up Friday. Need React revision."
                    className="w-full h-32 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-violet-500/50 resize-none font-medium placeholder-neutral-700 leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold">
                    <span>Private notes, auto-saves dynamically</span>
                    <span>{localNotes.length} / 2000</span>
                  </div>
                </div>
              </div>

              {/* Section 7: Timeline */}
              <div className="space-y-3 border-t border-white/[0.04] pt-6">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Timeline</h4>
                <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-[10px] font-black shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="text-xs font-bold text-white">Job Saved</p>
                      <p className="text-[9px] text-neutral-500 font-bold mt-0.5">
                        {new Date(selectedApp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* If status is beyond Saved, show Applied milestone */}
                  {["Applied", "Assessment", "Interview", "HR", "Offer", "Rejected"].includes(selectedApp.status) && (
                    <div className="flex items-start gap-3 border-t border-white/[0.03] pt-3.5">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[10px] font-black shrink-0 mt-0.5">2</div>
                      <div>
                        <p className="text-xs font-bold text-white">Applied</p>
                        <p className="text-[9px] text-neutral-500 font-bold mt-0.5">
                          {selectedApp.appliedAt 
                            ? new Date(selectedApp.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Pending date sync"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* If status is Assessment, Interview, HR, Offer, or Rejected, show latest progress */}
                  {["Assessment", "Interview", "HR", "Offer", "Rejected"].includes(selectedApp.status) && (
                    <div className="flex items-start gap-3 border-t border-white/[0.03] pt-3.5">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-black shrink-0 mt-0.5">3</div>
                      <div>
                        <p className="text-xs font-bold text-white">Active Stage: {selectedApp.status}</p>
                        <p className="text-[9px] text-neutral-500 font-bold mt-0.5">
                          Updated {new Date(selectedApp.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 8: Job Details */}
              <div className="space-y-3 border-t border-white/[0.04] pt-6">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Job Details</h4>
                <div className="bg-[#0b0b18]/40 border border-white/[0.04] rounded-2xl p-4 space-y-4 text-xs font-semibold text-neutral-300">
                  <div className="grid grid-cols-2 gap-y-2 border-b border-white/[0.03] pb-3">
                    <span className="text-neutral-500 font-bold">Company</span>
                    <span className="text-white text-right truncate font-bold">{selectedApp.job.company}</span>
                    
                    <span className="text-neutral-500 font-bold">Role</span>
                    <span className="text-white text-right truncate font-bold">{selectedApp.job.title}</span>

                    <span className="text-neutral-500 font-bold">Location</span>
                    <span className="text-white text-right truncate font-bold">{selectedApp.job.location || "N/A"}</span>

                    <span className="text-neutral-500 font-bold">Employment</span>
                    <span className="text-white text-right truncate font-bold">{selectedApp.job.employmentType || "N/A"}</span>

                    <span className="text-neutral-500 font-bold">Salary</span>
                    <span className="text-emerald-400 text-right truncate font-black">{selectedApp.job.salary || "N/A"}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 block">Description</span>
                    <p className={`text-neutral-300 leading-relaxed font-medium text-[11px] whitespace-pre-line ${showMoreDesc ? "" : "line-clamp-4"}`}>
                      {selectedApp.job.description || "No description loaded."}
                    </p>
                    {selectedApp.job.description && selectedApp.job.description.length > 200 && (
                      <button
                        onClick={() => setShowMoreDesc(!showMoreDesc)}
                        className="text-[10px] text-violet-400 hover:text-violet-300 font-black underline mt-1 block"
                      >
                        {showMoreDesc ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 9: Actions */}
              <div className="space-y-3 border-t border-white/[0.04] pt-6 pb-4">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Status Dropdown/Move Action */}
                  <div className="col-span-2">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-1">
                      Move Application Stage
                    </label>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleUpdateStatusDirect(selectedApp.id, e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer font-bold"
                    >
                      {STAGES.map((st) => (
                        <option key={st} value={st} className="bg-[#090916]">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    disabled={isArchiving}
                    onClick={() => handleToggleArchive(selectedApp.id, selectedApp.archived)}
                    className={`inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedApp.archived
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                        : "bg-white/[0.02] text-neutral-400 border-white/[0.06] hover:bg-white/[0.05]"
                    }`}
                  >
                    {selectedApp.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    {selectedApp.archived ? "Restore" : "Archive"}
                  </button>

                  <button
                    onClick={() => handleDeleteApplication(selectedApp.id)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/5 border border-rose-500/10 text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>

                  {selectedApp.job.applyUrl && (
                    <a
                      href={selectedApp.job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-md"
                    >
                      Open Job Listing <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Kanban Column Droppable Wrapper Component
interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id
  });

  const getStageStyles = (stage: string) => {
    switch (stage) {
      case "Saved":
        return { border: "hover:border-neutral-500/30", text: "text-neutral-400 bg-neutral-500/10" };
      case "Applied":
        return { border: "hover:border-cyan-500/30", text: "text-cyan-400 bg-cyan-500/10" };
      case "Assessment":
        return { border: "hover:border-amber-500/30", text: "text-amber-400 bg-amber-500/10" };
      case "Interview":
        return { border: "hover:border-violet-500/30", text: "text-violet-400 bg-violet-500/10" };
      case "HR":
        return { border: "hover:border-indigo-500/30", text: "text-indigo-400 bg-indigo-500/10" };
      case "Offer":
        return { border: "hover:border-emerald-500/30", text: "text-emerald-400 bg-emerald-500/10" };
      case "Rejected":
        return { border: "hover:border-rose-500/30", text: "text-rose-400 bg-rose-500/10" };
      default:
        return { border: "hover:border-white/10", text: "text-white bg-white/10" };
    }
  };

  const style = getStageStyles(title);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[240px] max-w-[280px] flex-1 bg-[#0b0b18]/60 border rounded-2xl p-4 space-y-4 min-h-[500px] transition-all ${
        isOver
          ? "border-violet-500/50 bg-violet-500/[0.02]"
          : "border-white/[0.04]"
      } ${style.border}`}
    >
      <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
        <span className="text-xs font-black text-white">{title}</span>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${style.text}`}>
          {count}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-[400px]">
        {count === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-4 border border-dashed border-white/[0.02] rounded-xl">
            <span className="text-[10px] text-neutral-600 font-bold">Drag cards here</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// Draggable Card Component for individual applications
interface DraggableCardProps {
  app: Application;
  onClick: () => void;
}

function DraggableCard({ app, onClick }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id
  });

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50
      }
    : undefined;

  const isReadyToApply = app.status === "Saved" && app.resume && app.atsReport && app.coverLetter;

  return (
    <div
      ref={setNodeRef}
      style={transformStyle}
      {...attributes}
      {...listeners}
      className={`bg-[#0b0b18]/90 border rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:border-violet-500/30 transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between space-y-4 ${
        isDragging ? "opacity-30 border-violet-500/20" : "border-white/[0.06]"
      }`}
    >
      <div className="space-y-3.5">
        {/* Card Header info */}
        <div className="flex items-center gap-3">
          <img
            src={`https://logo.clearbit.com/${app.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${app.job.company}&background=8B5CF6&color=fff&size=32`;
            }}
            className="w-8 h-8 rounded-lg object-contain bg-white/5 p-1 shrink-0 border border-white/[0.04]"
            alt={app.job.company}
          />
          <div className="min-w-0 flex-1 font-sans">
            <h4 className="text-xs font-black text-white truncate leading-tight">{app.job.company}</h4>
            <p className="text-[10px] text-neutral-400 font-bold truncate mt-0.5 leading-tight">{app.job.title}</p>
          </div>
        </div>

        {/* Action Indicators checklist */}
        <div className="flex flex-wrap gap-1 border-t border-b border-white/[0.03] py-2">
          {app.resume ? (
            <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              Resume ✓
            </span>
          ) : (
            <span className="text-[8px] font-extrabold text-neutral-500 bg-white/[0.01] border border-white/[0.04] px-1.5 py-0.5 rounded">
              No Resume
            </span>
          )}

          {app.atsReport ? (
            <span className="text-[8px] font-extrabold text-violet-300 bg-violet-500/5 border border-violet-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              ATS: {app.atsReport.score}%
            </span>
          ) : (
            <span className="text-[8px] font-extrabold text-neutral-500 bg-white/[0.01] border border-white/[0.04] px-1.5 py-0.5 rounded">
              No ATS
            </span>
          )}

          {app.coverLetter ? (
            <span className="text-[8px] font-extrabold text-cyan-300 bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              Letter ✓
            </span>
          ) : (
            <span className="text-[8px] font-extrabold text-neutral-500 bg-white/[0.01] border border-white/[0.04] px-1.5 py-0.5 rounded">
              No Letter
            </span>
          )}
        </div>

        {/* Ready to apply callout */}
        {isReadyToApply && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider py-1.5 rounded-lg text-center flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready To Apply
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="flex justify-between items-center pt-1 border-t border-white/[0.03]">
        <div
          className="p-1 text-neutral-600 flex gap-0.5"
          title="Drag to update stage"
        >
          {/* Subtle drag dot grid */}
          <div className="grid grid-cols-2 gap-0.5">
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
          </div>
        </div>

        <button
          onClick={onClick}
          className="text-[9px] font-extrabold text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-0.5"
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}