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
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp || targetApp.status === newStatus) return;

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
    } catch (err) {
      console.error(err);
      setApplications(previousApps);
    }
  };

  // Handle Archive / Restore toggle
  const handleToggleArchive = async (appId: number, currentlyArchived: boolean) => {
    try {
      setIsArchiving(true);
      const res = await fetch("/api/application-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: appId,
          archived: !currentlyArchived
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update archive status.");
      }

      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, archived: !currentlyArchived } : app))
      );
      
      // If active application is archived and drawer is open, update local state archive visual indicator
      setIsArchiving(false);
    } catch (err: unknown) {
      console.error(err);
      alert("Error archiving application folder.");
      setIsArchiving(false);
    }
  };

  // Delete application folder
  const handleDeleteApplication = async (appId: number) => {
    if (!confirm("Are you sure you want to permanently delete this application folder? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/application-tracker?applicationId=${appId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete application.");
      }

      setApplications(prev => prev.filter(app => app.id !== appId));
      setSelectedAppId(null);
    } catch (err: unknown) {
      console.error(err);
      alert("Error deleting application folder.");
    }
  };

  // Drawer Handler
  const handleOpenAppDrawer = (app: Application) => {
    setSelectedAppId(app.id);
    setLocalNotes(app.notes || "");
    setSaveStatus("idle");
    setAtsExpanded(false);
    setLetterPreviewOpen(false);
    setShowMoreDesc(false);
  };

  // Clipboard Copier
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // PDF Downloader inside visual board
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
      const width = 170;
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

  if (!mounted) {
    return null; // Hydration guard
  }

  // Filter application dataset
  const filteredApps = applications.filter((app) => {
    // Search keyword filter
    const matchesSearch =
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Archive filter logic
    const matchesArchive = showArchived ? app.archived : !app.archived;

    return matchesSearch && matchesArchive;
  });

  // Sort application dataset
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
  });

  const selectedApp = applications.find(a => a.id === selectedAppId);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <div className="vertex-container">
        <main className="flex-1 px-6 md:px-12 py-10 md:py-14 space-y-8">
          
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 animate-vertex-fade-in">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ClipboardCheck className="size-8 text-muted-foreground" />
                Application Tracker
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                The central hub managing saved jobs, resumes, ATS matching reports, and cover letters.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle Buttons */}
              <div className="bg-muted border rounded-xl p-1 flex items-center">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "kanban"
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Columns className="size-3.5" />
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode("whiteboard")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "whiteboard"
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GitCommit className="size-3.5" />
                  Whiteboard
                </button>
              </div>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  showArchived
                    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                    : "vertex-outline"
                }`}
              >
                {showArchived ? <ArchiveRestore className="size-3.5" /> : <Archive className="size-3.5" />}
                {showArchived ? "Hide Archived" : "Show Archived"}
              </button>
            </div>
          </div>

          {/* Statistics Cards Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-vertex-slide-up">
            <div className="vertex-card p-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Saved Jobs</span>
              <h3 className="text-2xl font-semibold text-foreground mt-1">{stats.Saved}</h3>
            </div>
            <div className="vertex-card p-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">Applications Sent</span>
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">{stats.Applied}</h3>
            </div>
            <div className="vertex-card p-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-600 dark:text-purple-400">Interviews</span>
              <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mt-1">{stats.Interview}</h3>
            </div>
            <div className="vertex-card p-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">Offers Received</span>
              <h3 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{stats.Offer}</h3>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="vertex-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-vertex-slide-up">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company or job title..."
                className="vertex-input pl-10"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5" /> Sort Order:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="vertex-input appearance-none cursor-pointer pr-8"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-xs text-muted-foreground">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Error message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3 animate-vertex-fade-in">
              <span className="text-xs text-destructive font-medium">{error}</span>
            </div>
          )}

          {/* Dnd Board / Whiteboard Workspaces */}
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center vertex-card p-8 animate-pulse">
              <div className="size-10 rounded-full border-2 border-border border-t-foreground animate-spin mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Loading Application Workspace</h3>
              <p className="text-xs text-muted-foreground">Syncing jobs metadata and file attachments...</p>
            </div>
          ) : viewMode === "kanban" ? (
            /* Kanban Board View */
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex flex-wrap gap-4 items-start select-none justify-start pb-4 animate-vertex-slide-up-delay">
                
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
                  <div className="bg-card border rounded-2xl p-4 shadow-xl opacity-90 cursor-grabbing scale-95 border-foreground/20">
                    {(() => {
                      const activeApp = applications.find(a => a.id === activeDragId);
                      if (!activeApp) return null;
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://logo.clearbit.com/${activeApp.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${activeApp.job.company}&background=f1f5f9&color=475569&size=32`;
                              }}
                              className="size-8 rounded-lg object-contain bg-muted p-1 shrink-0 border"
                              alt="avatar"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-foreground truncate">{activeApp.job.company}</h4>
                              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{activeApp.job.title}</p>
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
            <div className="space-y-6 animate-vertex-slide-up-delay">
              {sortedApps.length === 0 ? (
                <div className="vertex-card p-12 text-center">
                  <p className="text-xs text-muted-foreground">No applications match your current filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedApps.map((app) => {
                    const isReadyToApply = app.status === "Saved" && app.resume && app.atsReport && app.coverLetter;
                    const activeStageIndex = STAGES.indexOf(app.status);

                    return (
                      <div
                        key={app.id}
                        className="vertex-card p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                      >
                        {/* Left: Job Card Meta details */}
                        <div className="flex items-center gap-4 min-w-[280px]">
                          <img
                            src={`https://logo.clearbit.com/${app.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${app.job.company}&background=f1f5f9&color=475569&size=40`;
                            }}
                            className="size-10 rounded-xl object-contain bg-muted p-2 shrink-0 border"
                            alt={app.job.company}
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-foreground truncate leading-snug">{app.job.company}</h4>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{app.job.title}</p>
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {app.resume && (
                                <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 rounded">
                                  Resume ✓
                                </span>
                              )}
                              {app.atsReport && (
                                <span className="text-[9px] font-medium text-foreground bg-muted border px-1.5 py-0.5 rounded">
                                  ATS: {app.atsReport.score}%
                                </span>
                              )}
                              {app.coverLetter && (
                                <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded">
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
                              let stageColor = "border-border text-muted-foreground";
                              let lineColor = "bg-muted";
                              
                              if (isCompleted) {
                                if (stage === "Rejected") {
                                  stageColor = isActive 
                                    ? "border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400" 
                                    : "border-red-200 bg-red-50/50 text-red-500";
                                  lineColor = "bg-red-200 dark:bg-red-950/30";
                                } else if (stage === "Offer") {
                                  stageColor = isActive 
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400" 
                                    : "border-emerald-200 bg-emerald-50/50 text-emerald-500";
                                  lineColor = "bg-emerald-200 dark:bg-emerald-950/30";
                                } else {
                                  stageColor = isActive
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-primary/20 bg-muted text-foreground/80";
                                  lineColor = "bg-primary/20";
                                }
                              }

                              return (
                                <React.Fragment key={stage}>
                                  {/* Node Button */}
                                  <button
                                    onClick={() => handleUpdateStatusDirect(app.id, stage)}
                                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${stageColor} hover:scale-105 active:scale-95`}
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
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" /> Ready To Apply
                            </div>
                          )}
                          <button
                            onClick={() => handleOpenAppDrawer(app)}
                            className="vertex-outline inline-flex items-center gap-0.5 px-3.5 py-1.5 rounded-lg text-[10px] font-medium"
                          >
                            Details <ChevronRight className="size-3.5" />
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
      </div>

      {/* Drawer Overlay Modal Sidebar */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedAppId(null)} />

          {/* Drawer Inner Panel */}
          <div className="relative w-full max-w-xl h-full bg-card border-l shadow-2xl flex flex-col z-10 animate-vertex-slide-up">
            
            {/* STICKY HEADER */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-md z-20 border-b p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://logo.clearbit.com/${selectedApp.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedApp.job.company}&background=f1f5f9&color=475569&size=48`;
                    }}
                    className="size-12 rounded-xl object-contain bg-muted p-2 shrink-0 border"
                    alt="avatar"
                  />
                  <div>
                    <h2 className="text-base font-semibold text-foreground leading-tight">{selectedApp.job.company}</h2>
                    <h3 className="text-xs text-muted-foreground mt-0.5">{selectedApp.job.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-medium bg-muted border px-2.5 py-0.5 rounded-full text-foreground">
                        {selectedApp.status}
                      </span>
                      {selectedApp.archived && (
                        <span className="text-[10px] font-medium bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-600 dark:text-amber-400">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAppId(null)}
                  className="size-8 rounded-lg bg-muted border hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-text">
              
              {/* Section 2: Quick Overview */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground border-b pb-5">
                {selectedApp.job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-muted-foreground shrink-0" />
                    <span>{selectedApp.job.location}</span>
                  </div>
                )}
                {selectedApp.job.employmentType && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="size-4 text-muted-foreground shrink-0" />
                    <span>{selectedApp.job.employmentType}</span>
                  </div>
                )}
                {selectedApp.job.salary && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">💰 {selectedApp.job.salary}</span>
                  </div>
                )}
                {selectedApp.job.applyUrl && (
                  <a
                    href={selectedApp.job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline font-semibold"
                  >
                    <Globe className="size-4 shrink-0" />
                    <span>Source Link</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>

              {/* Section 3: Resume */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume</h4>
                {selectedApp.resume ? (
                  <div className="flex justify-between items-center bg-muted/40 border rounded-2xl p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="size-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{selectedApp.resume.fileName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Linked to folder</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={selectedApp.resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vertex-outline inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        View <ExternalLink className="size-3.5" />
                      </a>
                      <a
                        href={`/ats-score?applicationId=${selectedApp.id}`}
                        className="vertex-outline inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Replace
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-2xl p-6 text-center">
                    <p className="text-xs text-muted-foreground mb-3">No Resume Attached</p>
                    <a
                      href={`/ats-score?applicationId=${selectedApp.id}`}
                      className="vertex-cta inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
                    >
                      <Plus className="size-4" /> Upload Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Section 4: ATS */}
              <div className="space-y-3 border-t pt-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ATS Report</h4>
                {selectedApp.atsReport ? (
                  <div className="vertex-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-foreground block">Gemini Scoring Benchmark</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
                          {selectedApp.atsReport.score >= 80 ? "Excellent Match" : selectedApp.atsReport.score >= 60 ? "Good Match" : "Needs Optimization"}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                        {selectedApp.atsReport.score}% Match
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full"
                        style={{ width: `${selectedApp.atsReport.score}%` }}
                      />
                    </div>

                    {/* Collapsible View Report Details */}
                    {atsExpanded && (
                      <div className="space-y-4 pt-3 border-t">
                        {selectedApp.atsReport.missingKeywords && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Missing Keywords
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {(() => {
                                try {
                                  const keywords: string[] = JSON.parse(selectedApp.atsReport.missingKeywords || "[]");
                                  if (!keywords || keywords.length === 0) return <span className="text-xs text-muted-foreground">None detected</span>;
                                  return keywords.map((k, i) => (
                                    <span key={i} className="px-2 py-0.5 text-[9px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded">
                                      {k}
                                    </span>
                                  ));
                                } catch {
                                  return <span className="text-xs text-muted-foreground">{selectedApp.atsReport.missingKeywords}</span>;
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        {selectedApp.atsReport.suggestions && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Suggestions
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {selectedApp.atsReport.suggestions}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setAtsExpanded(!atsExpanded)}
                      className="w-full py-2 vertex-outline rounded-lg text-xs font-medium text-center"
                    >
                      {atsExpanded ? "Hide Details" : "View Report"}
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-2xl p-6 text-center">
                    <p className="text-xs text-muted-foreground mb-3">No ATS Report</p>
                    <a
                      href={`/ats-score?applicationId=${selectedApp.id}`}
                      className="vertex-cta inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
                    >
                      <Sparkles className="size-4" /> Run ATS Assessment
                    </a>
                  </div>
                )}
              </div>

              {/* Section 5: Cover Letter */}
              <div className="space-y-3 border-t pt-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cover Letter</h4>
                {selectedApp.coverLetter ? (
                  <div className="vertex-card p-4 space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">{selectedApp.coverLetter.title}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Linked to folder</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setLetterPreviewOpen(!letterPreviewOpen)}
                        className="flex-1 py-2 vertex-outline rounded-lg text-xs font-medium text-center"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => copyToClipboard(selectedApp.coverLetter!.content)}
                        className="flex-1 py-2 vertex-outline rounded-lg text-xs font-medium text-center"
                      >
                        {copiedLetter ? "✓ Copied" : "Copy"}
                      </button>
                      <button
                        onClick={() => downloadCoverLetterPdf(selectedApp.job.company, selectedApp.coverLetter!.title, selectedApp.coverLetter!.content)}
                        className="flex-1 py-2 vertex-outline rounded-lg text-xs font-medium text-center"
                      >
                        Download
                      </button>
                    </div>

                    {/* Preview collapsing letter block */}
                    {letterPreviewOpen && (
                      <textarea
                        readOnly
                        value={selectedApp.coverLetter.content}
                        className="vertex-input leading-relaxed min-h-[160px] resize-none"
                      />
                    )}
                  </div>
                ) : (
                  <div className="border border-dashed rounded-2xl p-6 text-center">
                    <p className="text-xs text-muted-foreground mb-3">No Cover Letter Generated</p>
                    <a
                      href={`/cover-letter?applicationId=${selectedApp.id}`}
                      className="vertex-cta inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
                    >
                      <FileText className="size-4" /> Draft Cover Letter
                    </a>
                  </div>
                )}
              </div>

              {/* Section 6: Notes */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <span>📝 Personal Notes</span>
                  </h4>
                  <div className="text-xs font-medium">
                    {saveStatus === "saving" && (
                      <span className="text-amber-500 animate-pulse">Saving...</span>
                    )}
                    {saveStatus === "saved" && (
                      <span className="text-emerald-600 dark:text-emerald-400">✓ Saved</span>
                    )}
                    {saveStatus === "error" && (
                      <span className="text-red-500">Failed to save</span>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
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
                    className="vertex-input h-32 resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
                    <span>Private notes, auto-saves dynamically</span>
                    <span>{localNotes.length} / 2000</span>
                  </div>
                </div>
              </div>

              {/* Section 7: Timeline */}
              <div className="space-y-3 border-t pt-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeline</h4>
                <div className="vertex-card p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-muted border flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Job Saved</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(selectedApp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* If status is beyond Saved, show Applied milestone */}
                  {["Applied", "Assessment", "Interview", "HR", "Offer", "Rejected"].includes(selectedApp.status) && (
                    <div className="flex items-start gap-3 border-t pt-3.5">
                      <div className="size-6 rounded-full bg-muted border flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">2</div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Applied</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {selectedApp.appliedAt 
                            ? new Date(selectedApp.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Pending date sync"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* If status is Assessment, Interview, HR, Offer, or Rejected, show latest progress */}
                  {["Assessment", "Interview", "HR", "Offer", "Rejected"].includes(selectedApp.status) && (
                    <div className="flex items-start gap-3 border-t pt-3.5">
                      <div className="size-6 rounded-full bg-muted border flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">3</div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Active Stage: {selectedApp.status}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Updated {new Date(selectedApp.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 8: Job Details */}
              <div className="space-y-3 border-t pt-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Details</h4>
                <div className="vertex-card p-4 space-y-4 text-xs text-foreground/80 font-medium">
                  <div className="grid grid-cols-2 gap-y-2 border-b pb-3">
                    <span className="text-muted-foreground">Company</span>
                    <span className="text-foreground text-right truncate font-semibold">{selectedApp.job.company}</span>
                    
                    <span className="text-muted-foreground">Role</span>
                    <span className="text-foreground text-right truncate font-semibold">{selectedApp.job.title}</span>

                    <span className="text-muted-foreground">Location</span>
                    <span className="text-foreground text-right truncate font-semibold">{selectedApp.job.location || "N/A"}</span>

                    <span className="text-muted-foreground">Employment</span>
                    <span className="text-foreground text-right truncate font-semibold">{selectedApp.job.employmentType || "N/A"}</span>

                    <span className="text-muted-foreground">Salary</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-right truncate font-bold">{selectedApp.job.salary || "N/A"}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">Description</span>
                    <p className={`text-muted-foreground leading-relaxed text-[11px] whitespace-pre-line ${showMoreDesc ? "" : "line-clamp-4"}`}>
                      {selectedApp.job.description || "No description loaded."}
                    </p>
                    {selectedApp.job.description && selectedApp.job.description.length > 200 && (
                      <button
                        onClick={() => setShowMoreDesc(!showMoreDesc)}
                        className="text-[10px] text-primary hover:underline font-semibold mt-1 block"
                      >
                        {showMoreDesc ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 9: Actions */}
              <div className="space-y-3 border-t pt-6 pb-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Status Dropdown/Move Action */}
                  <div className="col-span-2">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                      Move Application Stage
                    </label>
                    <div className="relative">
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleUpdateStatusDirect(selectedApp.id, e.target.value)}
                        className="vertex-input cursor-pointer pr-8 appearance-none"
                      >
                        {STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="text-xs text-muted-foreground">▼</span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isArchiving}
                    onClick={() => handleToggleArchive(selectedApp.id, selectedApp.archived)}
                    className={`vertex-outline inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold ${
                      selectedApp.archived
                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        : ""
                    }`}
                  >
                    {selectedApp.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                    {selectedApp.archived ? "Restore" : "Archive"}
                  </button>

                  <button
                    onClick={() => handleDeleteApplication(selectedApp.id)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>

                  {selectedApp.job.applyUrl && (
                    <a
                      href={selectedApp.job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 vertex-cta inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold"
                    >
                      Open Job Listing <ExternalLink className="size-4" />
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
        return { border: "hover:border-foreground/30", text: "text-muted-foreground bg-muted" };
      case "Applied":
        return { border: "hover:border-blue-500/30", text: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" };
      case "Assessment":
        return { border: "hover:border-amber-500/30", text: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10" };
      case "Interview":
        return { border: "hover:border-purple-500/30", text: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" };
      case "HR":
        return { border: "hover:border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" };
      case "Offer":
        return { border: "hover:border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" };
      case "Rejected":
        return { border: "hover:border-red-500/30", text: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10" };
      default:
        return { border: "hover:border-foreground/10", text: "text-foreground bg-muted" };
    }
  };

  const style = getStageStyles(title);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[240px] max-w-[280px] flex-1 bg-card/60 border rounded-2xl p-4 space-y-4 min-h-[500px] transition-all ${
        isOver
          ? "border-primary/50 bg-primary/[0.02]"
          : "border-border"
      } ${style.border}`}
    >
      <div className="flex justify-between items-center border-b pb-3">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${style.text}`}>
          {count}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-[400px]">
        {count === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-4 border border-dashed rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">Drag cards here</span>
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
      className={`bg-card border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between space-y-4 ${
        isDragging ? "opacity-30 border-foreground/10" : ""
      }`}
    >
      <div className="space-y-3.5">
        {/* Card Header info */}
        <div className="flex items-center gap-3">
          <img
            src={`https://logo.clearbit.com/${app.job.company.toLowerCase().replace(/\s+/g, "")}.com`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${app.job.company}&background=f1f5f9&color=475569&size=32`;
            }}
            className="size-8 rounded-lg object-contain bg-muted p-1 shrink-0 border"
            alt={app.job.company}
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-foreground truncate leading-tight">{app.job.company}</h4>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5 leading-tight">{app.job.title}</p>
          </div>
        </div>

        {/* Action Indicators checklist */}
        <div className="flex flex-wrap gap-1 border-t border-b py-2">
          {app.resume ? (
            <span className="text-[8px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              Resume ✓
            </span>
          ) : (
            <span className="text-[8px] font-semibold text-muted-foreground bg-muted border px-1.5 py-0.5 rounded">
              No Resume
            </span>
          )}

          {app.atsReport ? (
            <span className="text-[8px] font-semibold text-foreground bg-muted border px-1.5 py-0.5 rounded flex items-center gap-0.5">
              ATS: {app.atsReport.score}%
            </span>
          ) : (
            <span className="text-[8px] font-semibold text-muted-foreground bg-muted border px-1.5 py-0.5 rounded">
              No ATS
            </span>
          )}

          {app.coverLetter ? (
            <span className="text-[8px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              Letter ✓
            </span>
          ) : (
            <span className="text-[8px] font-semibold text-muted-foreground bg-muted border px-1.5 py-0.5 rounded">
              No Letter
            </span>
          )}
        </div>

        {/* Ready to apply callout */}
        {isReadyToApply && (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[9px] uppercase tracking-wider py-1.5 rounded-lg text-center flex items-center justify-center gap-1">
            <CheckCircle2 className="size-3.5" /> Ready To Apply
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="flex justify-between items-center pt-1 border-t">
        <div
          className="p-1 text-muted-foreground/50 flex gap-0.5 cursor-grab"
          title="Drag to update stage"
        >
          {/* Subtle drag dot grid */}
          <div className="grid grid-cols-2 gap-0.5">
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
          </div>
        </div>

        <button
          onClick={onClick}
          className="text-[9px] font-semibold text-primary hover:underline flex items-center gap-0.5"
        >
          Details <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}