"use client";

import * as React from "react";
import { LayoutGrid, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { CategoriesHero } from "./categories-hero";
import { CategoryCard } from "./category-card";
import { PopularCategoriesRow } from "./popular-categories-row";
import type { ExploreCategory, PopularCategory } from "@/types/categories";

interface CategoriesExplorerProps {
  initialCategories?: ExploreCategory[];
  popularCategories?: PopularCategory[];
}

export function CategoriesExplorer({
  initialCategories = [],
  popularCategories = [],
}: CategoriesExplorerProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const gridContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  // Filter categories based on search input
  const filteredCategories = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return initialCategories;

    return initialCategories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(query);
      const matchDesc = cat.small_description
        ? cat.small_description.toLowerCase().includes(query)
        : false;
      const matchSlug = cat.slug.toLowerCase().includes(query);
      return matchName || matchDesc || matchSlug;
    });
  }, [searchQuery, initialCategories]);

  const checkGridScroll = () => {
    if (!gridContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = gridContainerRef.current;
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleGridScroll = (direction: "left" | "right") => {
    if (!gridContainerRef.current) return;
    const scrollAmount = 400;
    gridContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkGridScroll, 300);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-14">
      {/* 1. Hero Section using Categories-page.png */}
      <CategoriesHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Section: "Find What Moves You" */}
      <section className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-semibold mb-2 shadow-sm">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
              <span>All Categories</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Find What Moves You
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              From thrilling sports matches to amazing concerts, theater shows and
              more — explore all categories and find your next unforgettable
              experience.
            </p>
          </div>

          {/* Navigation Arrows for Section */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => handleGridScroll("left")}
              disabled={!canScrollPrev}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleGridScroll("right")}
              disabled={!canScrollNext}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Cards Grid */}
        {filteredCategories.length > 0 ? (
          <div
            ref={gridContainerRef}
            onScroll={checkGridScroll}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 pt-2"
          >
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          /* Empty Search Results */
          <div className="text-center py-16 px-4 bg-[#080B14] border border-zinc-800/80 rounded-3xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <SearchX className="w-7 h-7 text-zinc-500" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-white">
                No categories found
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                We couldn&apos;t find any categories matching &ldquo;{searchQuery}&rdquo;. Try another keyword or clear the search.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* 3. Popular Categories Carousel / Trending Row */}
      {popularCategories.length > 0 && (
        <section className="pt-2">
          <PopularCategoriesRow categories={popularCategories} />
        </section>
      )}
    </div>
  );
}
