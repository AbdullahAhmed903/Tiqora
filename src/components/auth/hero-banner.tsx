"use client";

import * as React from "react";
import {
  Ticket,
  Trophy,
  Music,
  Sparkles,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthHeroBannerProps {
  type: "login" | "signup";
  className?: string;
}

const CATEGORIES = [
  {
    name: "Sports",
    icon: Trophy,
    bgColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
  },
  {
    name: "Concerts",
    icon: Music,
    bgColor: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-900/50",
  },
  {
    name: "Theater",
    icon: Sparkles,
    bgColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50",
  },
  {
    name: "Festivals",
    icon: Calendar,
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
  },
  {
    name: "More",
    icon: MoreHorizontal,
    bgColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
  },
];

export function AuthHeroBanner({ className }: AuthHeroBannerProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center space-y-8 select-none py-6 lg:py-12 pr-0 lg:pr-8",
        className
      )}
    >
      {/* Background Decorative Rings & Watermark */}
      <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-blue-950/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-100/30 dark:bg-purple-950/10 blur-3xl pointer-events-none -z-10" />
      
      {/* Script Watermark text on background */}
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl lg:text-8xl font-serif italic text-blue-500/10 dark:text-blue-400/5 rotate-[-12deg] tracking-wide pointer-events-none select-none z-0 hidden sm:block">
        Live the Moment
      </span>

      {/* Content Section */}
      <div className="relative z-10 space-y-6">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 shadow-xs">
          <Ticket className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
            ONE TICKET. EVERY EXPERIENCE.
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.06]">
          More Than <br />
          Events. <br />
          <span className="text-[#2563EB]">Real Experiences.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium max-w-md leading-relaxed">
          From football matches to concerts, festivals and more — all in one place.
        </p>

        {/* Category Icons Row */}
        <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-200 shadow-2xs group-hover:scale-110 group-hover:shadow-md",
                    cat.bgColor
                  )}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-[#2563EB] transition-colors">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Tagline & Accent Line */}
        <div className="flex items-center gap-3 pt-6">
          <div className="w-10 h-0.5 bg-[#2563EB] rounded-full" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Good Events Brighter People
          </span>
        </div>
      </div>
    </div>
  );
}
