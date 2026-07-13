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
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10">
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
          <span className="text-xs text-neutral-500">© 2026 Pathfinder. All rights reserved.</span>
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
    </footer>
  );
};

export default Footer;