"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  CircleDot,
  Music,
  Drama,
  Sparkles,
  GraduationCap,
  Landmark,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
  Compass,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { ALL_CATEGORY_EVENTS } from "@/lib/events-data";
import { FavoritesSidebar } from "./favorites-sidebar";
import { FavoriteItemCard } from "./favorite-item-card";

// Category definitions matching real domains (strictly NO generic "Events" category!)
const CATEGORY_CONFIGS = [
  { id: "sports", label: "Sports", icon: CircleDot, slug: "sports" },
  { id: "concerts", label: "Concerts", icon: Music, slug: "concerts" },
  { id: "festivals", label: "Festivals", icon: Sparkles, slug: "festivals" },
  { id: "theater", label: "Theater", icon: Drama, slug: "theater" },
  { id: "workshops", label: "Workshops", icon: GraduationCap, slug: "workshops" },
  { id: "cultural", label: "Cultural", icon: Landmark, slug: "cultural" },
];

const INITIAL_FAVORITE_IDS = [
  "coldplay-live-cairo",
  "cairo-music-festival-2025",
  "egypt-vs-nigeria",
  "the-last-dream",
  "full-stack-development-workshop",
  "ancient-egypt-exhibition",
  "the-weeknd-after-hours",
  "zamalek-vs-ahly-basketball",
  "soundstorm-2025",
  "phantom-of-the-opera",
  "real-madrid-vs-barcelona",
  "cairo-marathon-2025",
  "cairo-open-tennis",
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export function FavoritesExplorer() {
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>(INITIAL_FAVORITE_IDS);
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = React.useState<string>("newest");
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  // Get current favorite events objects
  const favoriteEvents = React.useMemo(() => {
    return ALL_CATEGORY_EVENTS.filter((e) => favoriteIds.includes(e.id));
  }, [favoriteIds]);

  // Remove handler with undo capability
  const handleRemoveFavorite = (id: string) => {
    const removedEvent = ALL_CATEGORY_EVENTS.find((e) => e.id === id);
    setFavoriteIds((prev) => prev.filter((item) => item !== id));

    toast("Removed from favorites", {
      action: {
        label: "Undo",
        onClick: () => {
          setFavoriteIds((prev) => [...prev, id]);
          toast.success(`Restored "${removedEvent?.title || "event"}" to favorites`);
        },
      },
    });
  };

  // Toggle category expansion for "Load more"
  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Count by category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORY_CONFIGS.forEach((c) => {
      counts[c.id] = favoriteEvents.filter((e) => e.category === c.id).length;
    });
    return counts;
  }, [favoriteEvents]);

  // Filter and sort events
  const getCategoryEvents = (categoryId: string) => {
    const events = favoriteEvents.filter((e) => e.category === categoryId);

    return events.sort((a, b) => {
      if (sortBy === "oldest") {
        return a.fullDate.localeCompare(b.fullDate);
      }
      if (sortBy === "price-asc") {
        return a.minPrice - b.minPrice;
      }
      if (sortBy === "price-desc") {
        return b.minPrice - a.minPrice;
      }
      // default: newest
      return b.fullDate.localeCompare(a.fullDate);
    });
  };

  // Categories to display
  const displayedCategories = React.useMemo(() => {
    if (activeCategory !== "all") {
      return CATEGORY_CONFIGS.filter(
        (c) => c.id === activeCategory && (categoryCounts[c.id] || 0) > 0
      );
    }
    return CATEGORY_CONFIGS.filter((c) => (categoryCounts[c.id] || 0) > 0);
  }, [activeCategory, categoryCounts]);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Newest First";

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 2-Column Layout: Sidebar (Fit-height & Sticky) | Main Area (Favorites) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* 1. Left Sidebar: Sticky (scrolls with user) & Fit-Height without Home */}
        <aside className="hidden md:block w-52 xl:w-56 flex-shrink-0 sticky top-24">
          <FavoritesSidebar favoritesCount={favoriteEvents.length} />
        </aside>

        {/* 2. Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Hero Banner with Favorite.png background */}
          <div className="relative bg-[#070B14] border border-zinc-800/80 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden min-h-[190px] sm:min-h-[220px] flex items-center">
            {/* Background Stadium Photo (Favorite.png) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/Favorite.png"
                alt="Favorites Arena"
                fill
                priority
                className="object-cover object-right md:object-center opacity-40 md:opacity-50"
              />
              {/* Dark gradient overlay to guarantee 100% text contrast and rich aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/70 via-transparent to-transparent" />
            </div>

            {/* Hero Left Content: Circular Heart Outline + Title + Subtitle */}
            <div className="relative z-10 flex items-center gap-5 sm:gap-6">
              {/* Glowing Heart Outline Circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.8} />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Your <span className="text-[#3B82F6]">Favorites</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                  All the events, teams, and moments you’ve saved — so you can come
                  back to them anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Pills & Sort Row under Hero Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Category Filter Pills (strictly NO generic "Events" pill!) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {/* "All" Pill Button */}
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                  activeCategory === "all"
                    ? "bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
                    : "bg-[#0B0F19] hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                All
              </button>

              {/* Specific Category Pills */}
              {CATEGORY_CONFIGS.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                if (count === 0) return null;
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                      isSelected
                        ? "bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
                        : "bg-[#0B0F19] hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-zinc-800/90 text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown on Right */}
            <div className="relative self-end sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B0F19] hover:bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>{currentSortLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-zinc-950 border border-zinc-800 rounded-xl p-1 shadow-2xl z-30">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        sortBy === opt.id
                          ? "bg-[#2563EB] text-white font-semibold"
                          : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}
          {displayedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#0B0F19]/50 border border-zinc-800/80 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shadow-inner">
                <Heart className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  No favorites in this category
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  You haven’t added any favorites here yet. Explore events and tap
                  the heart icon to save them.
                </p>
              </div>
              <Link
                href="/events"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Events</span>
              </Link>
            </div>
          ) : (
            /* Category Sections List */
            <div className="space-y-9">
              {displayedCategories.map((cat) => {
                const events = getCategoryEvents(cat.id);
                if (events.length === 0) return null;

                const isExpanded = !!expandedCategories[cat.id];
                // Rule: 2 cards per row, show 4 cards initially, if more show "Load more"
                const visibleEvents = isExpanded ? events : events.slice(0, 4);
                const hasMore = events.length > 4;
                const Icon = cat.icon;

                return (
                  <section key={cat.id} className="space-y-4">
                    {/* Category Section Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-5 h-5 text-[#3B82F6]" />
                        <h2 className="text-lg font-black text-white tracking-tight">
                          {cat.label}
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {events.length}
                        </span>
                      </div>

                      <Link
                        href={`/events/${cat.slug}`}
                        className="text-xs font-bold text-[#3B82F6] hover:text-blue-400 flex items-center gap-1 transition-colors"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Events Grid: Two cards per row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                      {visibleEvents.map((event) => (
                        <FavoriteItemCard
                          key={event.id}
                          event={event}
                          onRemove={handleRemoveFavorite}
                        />
                      ))}
                    </div>

                    {/* "Load More" Button if > 4 favorites in category */}
                    {hasMore && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCategoryExpand(cat.id)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                        >
                          {isExpanded ? (
                            <>
                              <span>Show less</span>
                              <ChevronUp className="w-3.5 h-3.5 text-[#3B82F6]" />
                            </>
                          ) : (
                            <>
                              <span>
                                Load more ({events.length - 4} more {cat.label})
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-[#3B82F6]" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
