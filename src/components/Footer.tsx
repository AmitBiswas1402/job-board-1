import React from "react";
import Link from "next/link";

const Footer = () => {
  const categories = [
    {
      title: "Platform",
      links: [
        { label: "Workflow builder", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "AI agents", href: "#" },
        { label: "Templates", href: "#" },
        { label: "API access", href: "#" },
        { label: "Webhooks", href: "#" },
        { label: "Self-hosted", href: "#" },
        { label: "Enterprise", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#", badge: "New" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Customers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Engineering blog", href: "#", badge: "New" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Brand assets", href: "#" },
        { label: "Contact us", href: "#" },
        { label: "Become a partner", href: "#" },
      ],
    },
    {
      title: "Integrations",
      links: [
        { label: "Slack", href: "#" },
        { label: "Notion", href: "#" },
        { label: "Stripe", href: "#" },
        { label: "HubSpot", href: "#" },
        { label: "OpenAI", href: "#" },
        { label: "Anthropic", href: "#" },
        { label: "Google Workspace", href: "#" },
        { label: "GitHub", href: "#" },
        { label: "Linear", href: "#" },
        { label: "Salesforce", href: "#" },
      ],
    },
    {
      title: "Job Board for",
      links: [
        { label: "Startups", href: "#" },
        { label: "Marketing", href: "#" },
        { label: "Sales", href: "#" },
        { label: "Engineering", href: "#" },
        { label: "Customer success", href: "#" },
        { label: "Operations", href: "#" },
        { label: "Finance", href: "#" },
        { label: "Product teams", href: "#" },
        { label: "Founders", href: "#" },
      ],
    },
    {
      title: "Apps",
      links: [
        { label: "Chrome extension ↗", href: "#" },
        { label: "iOS app ↗", href: "#" },
        { label: "Android app ↗", href: "#" },
        { label: "Desktop app ↗", href: "#" },
        { label: "Slack app ↗", href: "#" },
        { label: "Figma plugin ↗", href: "#" },
        { label: "VS Code ↗", href: "#" },
        { label: "API & SDKs ↗", href: "#" },
        { label: "CLI ↗", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Help center", href: "#" },
        { label: "Automation templates", href: "#" },
        { label: "Developers ↗", href: "#" },
        { label: "System status ↗", href: "#" },
        { label: "Roadmap", href: "#" },
        { label: "Community", href: "#" },
        { label: "Tutorials", href: "#" },
        { label: "Webinars", href: "#" },
        { label: "Downloads", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#000000] border-t border-dashed border-border py-16 px-6 md:px-12 mt-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
              <svg
                className="size-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-sm font-semibold">AI Job Board</span>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed mt-1">
              Automated job search, ATS optimization, and AI cover letter drafting for developers.
            </p>
          </div>

          {/* Links Columns */}
          {categories.map((category) => (
            <div key={category.title} className="flex flex-col gap-3.5">
              <h4 className="text-[11px] font-semibold text-neutral-300 tracking-wider uppercase">
                {category.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {category.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-neutral-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded font-bold uppercase tracking-wide">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator and Bottom Row */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <Link href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors">
              in
            </Link>
            <Link href="https://x.com" target="_blank" rel="noreferrer" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors">
              X
            </Link>
            <Link href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </Link>
            <Link href="https://youtube.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </Link>
          </div>

          {/* Legal / Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-xs text-neutral-500">
            <span>© 2026 Pathfinder. All rights reserved.</span>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;