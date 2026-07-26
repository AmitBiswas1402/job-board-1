'use client'

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-[#334155] bg-[#131313]/95 backdrop-blur-md">
      <div className="vertex-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <svg className="size-5 text-[#e5e2e1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-[#e5e2e1] tracking-tight font-heading">AI Job Board</span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="#" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide">Home</Link>
            <Link href="#jobs" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide">Jobs</Link>
            <Link href="#ats-score" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide">ATS Score</Link>
            <Link href="#cover-letter" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide">Cover Letter</Link>
            <Link href="#industry-insights" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide">Insights</Link>
            <Link href="#visual-whiteboard" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide">Tracker</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button className="bg-white hover:bg-white/95 text-black hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] rounded-lg text-sm font-semibold px-5 h-10 transition-all duration-200 border-0 flex items-center justify-center">
                  Get Started
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-semibold text-[#94A3B8] hover:text-white rounded-md px-3 py-2 transition-colors duration-200 font-heading tracking-wide hidden sm:block">
                  Dashboard
                </Link>
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;