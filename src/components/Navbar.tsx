'use client'

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Jobs", href: "/jobs" },
  { label: "ATS Score", href: "/ats-score" },
  { label: "Cover Letter", href: "/cover-letter" },
  { label: "Insights", href: "/industry-insights" },
  { label: "Tracker", href: "/visual-whiteboard" },
];

const Navbar = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/85 backdrop-blur-lg">
      <div className="cal-container">
        <div className="flex items-center justify-between h-16">
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`cal-nav-link ${isActive(link.href) ? "cal-nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="size-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-soft transition-colors"
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
                  <Button className="cal-button-primary hidden sm:inline-flex">
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden size-9 flex items-center justify-center rounded-md text-ink hover:bg-surface-soft transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-hairline py-3 space-y-1 animate-cal-fade-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block cal-nav-link ${isActive(link.href) ? "cal-nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 flex gap-2">
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="flex-1 cal-button-secondary">Sign in</Button>
                </SignInButton>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="flex-1 cal-button-primary">Sign up free</Button>
                </SignInButton>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
