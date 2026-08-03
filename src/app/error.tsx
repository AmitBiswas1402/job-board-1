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
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md vertex-card p-8 text-center space-y-6 animate-vertex-fade-in">
          <div className="size-14 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <AlertTriangle className="size-6" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold text-foreground">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An unexpected error occurred while loading this page. Please try
              again or head back to the dashboard.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-muted-foreground/70 mt-2">
                Reference: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={reset}
              className="cal-button-primary inline-flex items-center justify-center gap-2 rounded-lg"
            >
              <RefreshCw className="size-3.5" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="cal-button-secondary inline-flex items-center justify-center gap-2 rounded-lg"
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
