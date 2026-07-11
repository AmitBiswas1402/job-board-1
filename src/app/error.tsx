"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono">
      <Navbar />

      <div className="vertex-container flex-1 flex flex-col items-center justify-center p-6 select-none">
        {/* Error Window Frame */}
        <div className="w-full max-w-2xl bg-card border rounded-2xl shadow-xl overflow-hidden animate-vertex-slide-up">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b bg-red-500/5 dark:bg-red-950/10 border-red-200/50 dark:border-red-950/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500 border border-red-600" />
                <div className="size-3 rounded-full bg-foreground/10" />
                <div className="size-3 rounded-full bg-foreground/10" />
              </div>
              <span className="text-[11px] text-red-600 dark:text-red-400 ml-3 font-semibold tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="size-3" /> System Exception
              </span>
            </div>
            <span className="text-[10px] bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-950/50 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-bold uppercase">
              runtime error
            </span>
          </div>

          {/* Error Message tab */}
          <div className="flex border-b text-xs text-muted-foreground bg-muted/20">
            <div className="px-4 py-2 border-r bg-background border-b-2 border-b-red-500 text-red-600 dark:text-red-400 font-semibold">
              <span>stack_trace.log</span>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="p-6 text-xs md:text-sm text-foreground/90 space-y-3 leading-relaxed min-h-[180px] bg-red-500/[0.01]">
            <div className="flex gap-4">
              <span className="text-red-500/40 select-none">1</span>
              <p className="text-red-600/80 dark:text-red-400/80">[FATAL] Uncaught runtime exception detected in application root.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-red-500/40 select-none">2</span>
              <p className="text-foreground"><span className="text-red-600 font-bold">Error:</span> {error.message || "An unexpected application error occurred."}</p>
            </div>
            {error.digest && (
              <div className="flex gap-4">
                <span className="text-red-500/40 select-none">3</span>
                <p className="text-muted-foreground">Digest: {error.digest}</p>
              </div>
            )}
            <div className="flex gap-4">
              <span className="text-red-500/40 select-none">4</span>
              <p className="text-muted-foreground"># Recovery suggestions:</p>
            </div>
            <div className="flex gap-4">
              <span className="text-red-500/40 select-none">5</span>
              <p className="text-muted-foreground">- Try resetting the active state boundary via CLI controls below</p>
            </div>
            <div className="flex gap-4">
              <span className="text-red-500/40 select-none">6</span>
              <p className="text-muted-foreground">- Clear your browser cookies/session tokens and hot reload the portal</p>
            </div>
          </div>

          {/* Actions Footer Panel */}
          <div className="px-6 py-4 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-950/50 rounded-lg text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="size-3.5 animate-pulse" />
              Reset App State
            </button>

            <Link
              href="/dashboard"
              className="vertex-outline inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <Home className="size-3.5" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
