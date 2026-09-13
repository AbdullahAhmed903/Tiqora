"use client";

import * as React from "react";
import Link from "next/link";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Trophy,
  Music,
  Drama,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { POPULAR_CATEGORIES } from "@/lib/categories-data";

const POPULAR_ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Music,
  Drama,
  Sparkles,
};

export function PopularCategoriesRow() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className="relative bg-[#070B14]/90 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header with Title & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/60">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold mb-2.5">
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
            <span>Trending Now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            These categories are getting the most attention right now. Don&apos;t miss out!
          </p>
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous popular categories"
            className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next popular categories"
            className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Row / Grid */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {POPULAR_CATEGORIES.map((cat) => {
          const Icon = POPULAR_ICON_MAP[cat.iconName] || Trophy;

          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex items-center justify-between px-4 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800/90 hover:border-zinc-700 transition-all duration-300 shadow-sm cursor-pointer"
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${cat.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {cat.name}
                  </span>
                  <span className="block text-xs text-zinc-400">
                    {cat.eventsCount} Events
                  </span>
                </div>
              </div>

              {/* Right: Arrow */}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
