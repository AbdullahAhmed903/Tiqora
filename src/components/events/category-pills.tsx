"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import { SUBCATEGORIES_BY_CATEGORY } from "@/lib/events-data";
import type { CategoryPill } from "@/types/categories";

interface CategoryPillsProps {
  category?: string;
  activeSubcategory: string;
  onSelectSubcategory: (id: string) => void;
  pills?: CategoryPill[];
}

export function CategoryPills({
  category = "all",
  activeSubcategory,
  onSelectSubcategory,
  pills,
}: CategoryPillsProps) {
  const router = useRouter();
  const normCategory = category.toLowerCase();
  const isAllEvents = normCategory === "all" || normCategory === "events";

  const [isExpanded, setIsExpanded] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Build pill list
  const displayPills = React.useMemo(() => {
    // 1. When dynamic database pills are provided
    if (pills !== undefined) {
      // If viewing a specific category and it has no subcategories in DB, show nothing!
      if (!isAllEvents && pills.length === 0) {
        return [];
      }

      // If viewing all events (/events), pills are the top-level categories
      if (isAllEvents) {
        const allPill = {
          name: "All Events",
          slug: "all",
          icon: "LayoutGrid",
        };
        return [allPill, ...pills];
      }

      // If viewing a specific category with subcategories
      const allPill = {
        name: `All ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        slug: "all",
        icon: "LayoutGrid",
      };
      return [allPill, ...pills];
    }

    // 2. Fallback only if pills prop was omitted entirely
    if (isAllEvents) {
      const staticItems = SUBCATEGORIES_BY_CATEGORY["all"] || [];
      return staticItems.map((s) => ({
        name: s.label,
        slug: s.subcategoryId,
        icon: s.iconName,
      }));
    }

    // For a specific category, NEVER fall back to "all"! If it has no subcategories, show nothing.
    const staticItems = SUBCATEGORIES_BY_CATEGORY[normCategory];
    if (!staticItems || staticItems.length === 0) {
      return [];
    }

    return staticItems.map((s) => ({
      name: s.label,
      slug: s.subcategoryId,
      icon: s.iconName,
    }));
  }, [pills, category, normCategory, isAllEvents]);

  // Check scroll positions for horizontal scroll
  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  React.useEffect(() => {
    if (!isExpanded && isAllEvents) return;

    const timer = setTimeout(checkScroll, 350);
    const el = scrollContainerRef.current;
    if (!el) return () => clearTimeout(timer);

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, displayPills, isExpanded, isAllEvents]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = direction === "left" ? -280 : 280;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // If there are no subcategories to display (e.g. category with 0 subcategories), render nothing
  if (displayPills.length === 0) {
    return null;
  }

  const handlePillClick = (subcategoryId: string) => {
    // If we're on /events and the user clicks on a top-level category pill, redirect to /events/[category]
    if (isAllEvents && subcategoryId !== "all") {
      router.push(`/events/${subcategoryId}`);
      return;
    }

    onSelectSubcategory(subcategoryId);
  };

  const renderPill = (pill: { name: string; slug: string; icon: string | null }) => {
    const isActive =
      activeSubcategory === pill.slug ||
      (!activeSubcategory && pill.slug === "all");

    return (
      <button
        key={pill.slug}
        type="button"
        onClick={() => handlePillClick(pill.slug)}
        className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none shrink-0 ${
          isActive
            ? "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] scale-[1.02]"
            : "bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700"
        }`}
      >
        <CategoryIcon
          name={pill.icon}
          className={`w-3.5 h-3.5 transition-colors ${
            isActive ? "text-white" : "text-zinc-400"
          }`}
        />
        <span>{pill.name}</span>
      </button>
    );
  };

  const categoriesCount = displayPills.length - 1; // Exclude 'All Events'

  return (
    <div className="w-full py-1">
      {isAllEvents ? (
        /* ON /events: "All Events" + Arrow button that smoothly opens categories to the right with scrollbar */
        <div className="relative flex items-center gap-2.5 w-full">
          {/* 1. All Events Pill (Always visible & active) */}
          <button
            type="button"
            onClick={() => handlePillClick("all")}
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] scale-[1.02] cursor-pointer select-none shrink-0 z-10"
          >
            <CategoryIcon name="LayoutGrid" className="w-3.5 h-3.5 text-white" />
            <span>All Events</span>
          </button>

          {/* 2. Arrow Button: Toggles smooth rightward expansion */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none shrink-0 z-10 shadow-md ${
              isExpanded
                ? "bg-zinc-800 text-white border border-zinc-600 shadow-blue-900/20"
                : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
            title={isExpanded ? "Collapse categories" : "Expand categories to the right"}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>{isExpanded ? "Collapse" : `Categories (${categoriesCount})`}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </motion.div>
          </button>

          {/* 3. Smooth Right-Expanding Horizontal Scroll Container */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex-1 min-w-0 overflow-hidden flex items-center"
              >
                {/* Scroll Left Button */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scroll("left")}
                    className="flex absolute left-0 z-20 items-center justify-center w-7 h-7 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-lg cursor-pointer transition-all"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Horizontal Scrollable Row without scrollbar */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-x-auto scrollbar-none py-1.5 scroll-smooth pr-6 pl-1"
                >
                  <div className="flex items-center gap-2.5 min-w-max">
                    {displayPills.slice(1).map(renderPill)}
                  </div>
                </div>

                {/* Scroll Right Button */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scroll("right")}
                    className="flex absolute right-0 z-20 items-center justify-center w-7 h-7 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-lg cursor-pointer transition-all"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* SUBCATEGORY PILLS VIEW (for specific category pages like /events/sports):
           Direct horizontal row with scroll buttons if overflowing */
        <div className="relative flex items-center gap-2 w-full">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute -left-2 z-20 items-center justify-center w-8 h-8 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-lg cursor-pointer transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-max pr-2">
              {displayPills.map(renderPill)}
            </div>
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="hidden sm:flex absolute -right-2 z-20 items-center justify-center w-8 h-8 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-lg cursor-pointer transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
