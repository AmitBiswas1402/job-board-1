import React from "react";
import Navbar from "@/components/Navbar";
import { Home, Briefcase } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-6 animate-vertex-fade-in">
          <div className="text-6xl font-semibold tracking-tight text-foreground">
            404
          </div>

          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold text-foreground">
              Page not found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved. Head back to your dashboard or keep browsing jobs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/dashboard"
              className="cal-button-primary inline-flex items-center justify-center gap-2 rounded-lg"
            >
              <Home className="size-3.5" />
              Go to Dashboard
            </Link>
            <Link
              href="/jobs"
              className="cal-button-secondary inline-flex items-center justify-center gap-2 rounded-lg"
            >
              <Briefcase className="size-3.5" />
              Search Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
