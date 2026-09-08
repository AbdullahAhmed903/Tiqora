"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Music,
  Drama,
  Sparkles,
  Gamepad2,
  HeartHandshake,
  Briefcase,
  Grid,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES, Category } from "@/lib/home-data";

const iconMap: Record<string, React.ElementType> = {
  Trophy: Trophy,
  Music: Music,
  Theater: Drama,
  Sparkles: Sparkles,
  Gamepad2: Gamepad2,
  Heart: HeartHandshake,
  Briefcase: Briefcase,
  Grid: Grid,
};

export function CategorySection() {
  return (
    <section className="space-y-6 pt-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
            EXPLORE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Browse by <span className="text-[#2563EB]">Category</span>
          </h2>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 8 Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {CATEGORIES.map((cat: Category) => {
          const Icon = iconMap[cat.iconName] || Grid;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border bg-surface/70 hover:bg-surface hover:border-[#2563EB]/60 hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all duration-200 group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-background border border-border group-hover:border-[#2563EB]/40 flex items-center justify-center text-secondary-text group-hover:text-[#2563EB] group-hover:scale-110 transition-all duration-200 mb-3 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-[#2563EB] transition-colors">
                {cat.name}
              </span>
              <span className="text-[11px] text-secondary-text mt-0.5">
                {cat.subtitle}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
