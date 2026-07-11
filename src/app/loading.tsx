import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 select-none font-mono">
      {/* Code Editor Frame */}
      <div className="w-full max-w-2xl bg-card border rounded-2xl shadow-xl overflow-hidden animate-vertex-slide-up">
        {/* Editor Top Bar (Window controls + Tabs) */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500/20 border border-red-500/30" />
              <div className="size-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
              <div className="size-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
            </div>
            <span className="text-[11px] text-muted-foreground ml-3 font-semibold tracking-wide">Syncing Career Workspace</span>
          </div>
          
          {/* Status badge with GitHub Push rotating animation */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            {/* Spinning double arrows sync icon */}
            <svg 
              className="size-3 text-emerald-600 dark:text-emerald-400 animate-spin" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">pushing...</span>
          </div>
        </div>

        {/* Tab view */}
        <div className="flex border-b text-xs text-muted-foreground bg-muted/20">
          <div className="px-4 py-2 border-r bg-background border-b-2 border-b-foreground text-foreground font-semibold flex items-center gap-2">
            <span>git-push.sh</span>
          </div>
          <div className="px-4 py-2 border-r hover:bg-muted/10 transition-colors flex items-center gap-2 cursor-pointer">
            <span>application-tracker.tsx</span>
          </div>
          <div className="px-4 py-2 border-r hover:bg-muted/10 transition-colors flex items-center gap-2 cursor-pointer">
            <span>ats-evaluator.py</span>
          </div>
        </div>

        {/* Editor Screen/Terminal Area */}
        <div className="p-6 text-xs md:text-sm text-foreground/90 space-y-3 leading-relaxed min-h-[220px]">
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">1</span>
            <p className="text-muted-foreground font-mono"># Sync pipeline with central tracker database</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">2</span>
            <p className="text-foreground font-mono"><span className="text-emerald-600 dark:text-emerald-400">$</span> git push origin main --force</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">3</span>
            <p className="text-muted-foreground font-mono">Enumerating objects: 5, done.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">4</span>
            <p className="text-muted-foreground font-mono">Counting objects: 100% (5/5), done.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">5</span>
            <p className="text-muted-foreground font-mono">Delta compression using up to 8 threads</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">6</span>
            <p className="text-muted-foreground font-mono">Compressing objects: 100% (3/3), done.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">7</span>
            <p className="text-emerald-600 dark:text-emerald-400 font-mono">Writing objects: 100% (3/3), 412 bytes | 412.00 KiB/s, done.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">8</span>
            <p className="text-muted-foreground font-mono">Total 3 (delta 2), reused 0 (delta 0), pack-reused 0</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">9</span>
            <p className="text-muted-foreground font-mono">To github.com:career-assistant/tracker-service.git</p>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground/40 select-none">10</span>
            <p className="text-emerald-600 dark:text-emerald-400 font-mono">{"   d4b3c2a..a1b2c3d  main -> main"}</p>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2 border-t bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
          <div className="flex items-center gap-3">
            <span>Branch: main</span>
            <span className="text-muted-foreground/30">|</span>
            <span>UTF-8</span>
          </div>
          <div>
            <span>Next.js Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
