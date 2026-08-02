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
    <header className="cal-top-nav sticky top-0 z-50 w-full">
      <div className="cal-container">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <svg className="size-5 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold text-ink tracking-tight cal-title-md">AI Job Board</span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/jobs" className="cal-nav-link">Jobs</Link>
            <Link href="/ats-score" className="cal-nav-link">ATS Score</Link>
            <Link href="/cover-letter" className="cal-nav-link">Cover Letter</Link>
            <Link href="/industry-insights" className="cal-nav-link">Insights</Link>
            <Link href="/visual-whiteboard" className="cal-nav-link">Tracker</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="size-4 hidden dark:block" />
              <Moon className="size-4 block dark:hidden" />
            </button>

            {!user ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="cal-button-text-link hidden sm:inline-flex">
                    Sign in
                  </Button>
                </SignInButton>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="cal-button-primary">
                    Sign up free
                  </Button>
                </SignInButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="cal-nav-link hidden sm:inline-flex">
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