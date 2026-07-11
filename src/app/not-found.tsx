import React from "react";
import Navbar from "@/components/Navbar";
import { FolderIcon, Terminal, Home, Briefcase } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono">
      <Navbar />

      <div className="vertex-container flex-1 flex flex-col items-center justify-center p-6 select-none">
        {/* Not Found Window Frame */}
        <div className="w-full max-w-2xl bg-card border rounded-2xl shadow-xl overflow-hidden animate-vertex-slide-up">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-foreground/10" />
                <div className="size-3 rounded-full bg-foreground/10" />
                <div className="size-3 rounded-full bg-foreground/10" />
              </div>
              <span className="text-[11px] text-muted-foreground ml-3 font-semibold tracking-wide flex items-center gap-1.5">
                <Terminal className="size-3.5" /> console.log
              </span>
            </div>
            <span className="text-[10px] bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400 font-bold uppercase">
              404 warning
            </span>
          </div>

          {/* Tab */}
          <div className="flex border-b text-xs text-muted-foreground bg-muted/20">
            <div className="px-4 py-2 border-r bg-background border-b-2 border-b-amber-500 text-foreground font-semibold flex items-center gap-2">
              <FolderIcon className="size-3 text-muted-foreground" />
              <span>not_found.json</span>
            </div>
          </div>

          {/* Console logs */}
          <div className="p-6 text-xs md:text-sm text-foreground/90 space-y-3 leading-relaxed min-h-[180px]">
            <div className="flex gap-4">
              <span className="text-muted-foreground/30 select-none">1</span>
              <p className="text-amber-600 dark:text-amber-400 font-semibold">[WARNING] Resolving routing directory index failed...</p>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground/30 select-none">2</span>
              <p className="text-foreground">{`{`}</p>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground/30 select-none">3</span>
              <p className="text-foreground pl-4">{"\"status\":"} <span className="text-amber-600 dark:text-amber-400">404</span>,</p>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground/30 select-none">4</span>
              <p className="text-foreground pl-4">{"\"error\":"} <span className="text-emerald-600 dark:text-emerald-400">{"\"Resource target directory index resolved to undefined\""}</span>,</p>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground/30 select-none">5</span>
              <p className="text-foreground pl-4">{"\"action\":"} <span className="text-emerald-600 dark:text-emerald-400">{"\"Redirect candidate client navigation to safety portals\""}</span></p>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground/30 select-none">6</span>
              <p className="text-foreground">{`}`}</p>
            </div>
          </div>

          {/* Footer controls */}
          <div className="px-6 py-4 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="vertex-cta inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <Home className="size-3.5" />
              Go to Dashboard
            </Link>

            <Link
              href="/jobs"
              className="vertex-outline inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <Briefcase className="size-3.5" />
              Search Tech Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
