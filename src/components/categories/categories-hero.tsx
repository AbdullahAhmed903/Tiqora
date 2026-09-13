"use client";

import * as React from "react";
import Image from "next/image";
import { Compass, Search, X } from "lucide-react";

interface CategoriesHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CategoriesHero({
  searchQuery,
  onSearchChange,
}: CategoriesHeroProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-950/60 shadow-[0_15px_50px_-15px_rgba(37,99,235,0.25)] min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center bg-[#060912]">
      {/* Background Hero Banner (Categories-page.png) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/Categories-page.png"
          alt="Browse All Categories Banner"
          fill
          priority
          sizes="(max-width: 1440px) 100vw, 1440px"
          className="object-cover object-right opacity-95"
        />
        {/* Dark gradient overlay on the left to guarantee optimal text contrast across all device sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060912]/95 via-[#060912]/75 to-transparent w-full md:w-3/5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060912]/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Left */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10 sm:py-14 max-w-2xl flex flex-col justify-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-semibold backdrop-blur-md w-fit mb-4 sm:mb-5 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Explore &amp; Discover</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Browse All
          <span className="block text-[#3B82F6]">Categories</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-300/90 leading-relaxed max-w-lg font-normal">
          Find the perfect event, match, or experience. Explore our wide range of
          categories and discover something amazing that fits your interests.
        </p>

        {/* Search Bar Capsule */}
        <div className="mt-6 sm:mt-8 max-w-md w-full relative flex items-center bg-[#070B16]/85 backdrop-blur-xl border border-zinc-700/70 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25 rounded-full px-4 py-3 shadow-2xl transition-all">
          <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for a category..."
            className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="p-1 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hand-drawn style text directly above the curved doodle arrow in Categories-page.png */}
      <div className="hidden lg:flex absolute right-[4%] xl:right-[4.8%] 2xl:right-[5.2%] top-[29%] xl:top-[31%] z-10 pointer-events-none flex-col items-center select-none">
        <div
          className="text-[#D8B4FE] text-xs sm:text-sm xl:text-base font-bold tracking-tight italic text-center leading-tight drop-shadow-[0_2px_8px_rgba(168,85,247,0.7)]"
          style={{
            fontFamily: "'Caveat', 'Comic Sans MS', cursive, sans-serif",
            transform: "rotate(-5deg)",
          }}
        >
          <span className="block">More</span>
          <span className="block">than just</span>
          <span className="block">events</span>
        </div>
      </div>
    </div>
  );
}
