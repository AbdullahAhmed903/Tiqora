"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  HelpCircle,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export interface PolicyHighlight {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export interface RelatedPolicyLink {
  title: string;
  href: string;
  desc: string;
}

interface PolicyLayoutProps {
  badge: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle: string;
  lastUpdated: string;
  highlights: PolicyHighlight[];
  sections: PolicySection[];
  relatedLinks: RelatedPolicyLink[];
}

export function PolicyLayout({
  badge,
  badgeIcon,
  title,
  subtitle,
  lastUpdated,
  highlights,
  sections,
  relatedLinks,
}: PolicyLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<string>(sections[0]?.id || "");
  const [isMobileTocOpen, setIsMobileTocOpen] = React.useState<boolean>(false);

  // IntersectionObserver to highlight current active section on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveSection(id);
      setIsMobileTocOpen(false);
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-7 sm:space-y-10">
      {/* 1. Hero Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative bg-gradient-to-br from-[#0B0F19] via-[#0E1528] to-[#080B12] border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 shadow-2xl overflow-hidden text-center"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          {/* Header Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(37,99,235,0.25)]">
            {badgeIcon || <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
            <span>{badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Last Updated Pill */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Highlights Grid */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-[#0B0F19]/90 border border-zinc-800/80 shadow-md flex items-start gap-3.5 group hover:border-blue-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 3. Main Document Body with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar (Table of Contents) */}
        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-6 w-full">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F19]/90 border border-zinc-800/80 shadow-xl space-y-3 sm:space-y-4">
            <button
              type="button"
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className="w-full flex items-center justify-between pb-2 border-b border-zinc-800 lg:cursor-default cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Table of Contents
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  ({sections.length})
                </span>
              </div>
              <div className="flex items-center gap-1.5 lg:hidden text-blue-400 text-xs font-semibold">
                <span className="text-[11px]">{isMobileTocOpen ? "Close" : "Jump"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMobileTocOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <nav
              className={`space-y-1 custom-scrollbar max-h-[60vh] overflow-y-auto pr-1 ${
                isMobileTocOpen ? "block" : "hidden lg:block"
              }`}
            >
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-mono shrink-0 ${
                        isActive ? "text-blue-400" : "text-zinc-500"
                      }`}
                    >
                      {sec.number}
                    </span>
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Help Card (Desktop only to prevent mobile clutter) */}
          <div className="hidden lg:block p-5 rounded-2xl bg-gradient-to-br from-[#0B0F19] to-[#0E1528] border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Support Desk
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Have questions or need assistance with your ticket or data rights? Our customer care team is available 24/7.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </Link>
              <Link
                href="/faqs"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Browse FAQs</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Content Area (Detailed Policy Clauses) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8 w-full min-w-0">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#0B0F19]/90 border border-zinc-800/80 shadow-xl space-y-4 sm:space-y-5 scroll-mt-28 transition-colors hover:border-zinc-700/80"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 sm:gap-3.5 pb-3 sm:pb-4 border-b border-zinc-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                      Section {sec.number}
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                      {sec.title}
                    </h2>
                  </div>
                </div>

                {/* Section Body */}
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 sm:space-y-4">
                  {sec.content}
                </div>
              </section>
            );
          })}

          {/* 4. Related Policies Cross-Link Cards */}
          {relatedLinks.length > 0 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#0B0F19] border border-zinc-800/80 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Related Legal &amp; Policy Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/90 transition-all group flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {link.title}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {link.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
