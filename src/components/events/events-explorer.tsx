"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { ALL_CATEGORY_EVENTS } from "@/lib/events-data";
import { FilterState } from "@/types/events";
import { EventsHeroBanner } from "./events-hero-banner";
import { CategoryPills } from "./category-pills";
import { EventsFilterSidebar } from "./events-filter-sidebar";
import { EventsGrid } from "./events-grid";

interface EventsExplorerProps {
  initialCategory?: string;
}

const ITEMS_PER_PAGE = 9;

const DEFAULT_FILTERS: Omit<FilterState, "subcategory"> = {
  date: "all",
  location: "all",
  maxPrice: 500,
  sort: "featured",
};

export function EventsExplorer({ initialCategory }: EventsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Resolve category from prop or query param (?category=sports)
  const categoryParam = searchParams.get("category");
  const currentCategory = (initialCategory || categoryParam || "all").toLowerCase();

  // Subcategory is driven directly by URL query (?subcategory=football)
  const activeSubcategory = searchParams.get("subcategory") || "all";

  // Filter state for sidebar controls
  const [filters, setFilters] = React.useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  const handleSubcategorySelect = (subcategoryId: string) => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (subcategoryId === "all") {
      params.delete("subcategory");
    } else {
      params.set("subcategory", subcategoryId);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: Partial<typeof DEFAULT_FILTERS>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setIsMobileFiltersOpen(false);
    toast.success("Filters applied successfully");
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (categoryParam) {
      params.set("category", categoryParam);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    toast.info("All filters have been reset");
  };

  // Filter logic
  const filteredEvents = React.useMemo(() => {
    return ALL_CATEGORY_EVENTS.filter((event) => {
      // 1. Category Filter:
      // If we are on /events/sports (or ?category=sports), ONLY show sports!
      // If we are on /events/theater, ONLY show theater!
      // If we are on /events, show ALL events unless filtered!
      if (
        currentCategory !== "all" &&
        currentCategory !== "events" &&
        event.category !== currentCategory
      ) {
        return false;
      }

      // 2. Subcategory Filter
      if (activeSubcategory && activeSubcategory !== "all") {
        const matchesSubcategory = event.subcategory === activeSubcategory;
        const matchesCategory = event.category === activeSubcategory;
        if (!matchesSubcategory && !matchesCategory) {
          return false;
        }
      }

      // 3. Location Filter
      if (filters.location !== "all") {
        const locLower = filters.location.toLowerCase();
        const matchesCity = event.city.toLowerCase().includes(locLower);
        const matchesCountry = event.country.toLowerCase().includes(locLower);
        if (!matchesCity && !matchesCountry) return false;
      }

      // 4. Price Filter
      if (filters.maxPrice < 500 && event.minPrice > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (filters.sort === "price-asc") {
        return a.minPrice - b.minPrice;
      }
      if (filters.sort === "price-desc") {
        return b.minPrice - a.minPrice;
      }
      if (filters.sort === "date") {
        return a.fullDate.localeCompare(b.fullDate);
      }
      if (filters.sort === "popular") {
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
      // default: "featured" -> preserve curated diverse order
      return 0;
    });
  }, [currentCategory, activeSubcategory, filters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fullFilterState: FilterState = {
    ...filters,
    subcategory: activeSubcategory,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      {/* 1. Hero Banner with public/slug-pages.png visual */}
      <EventsHeroBanner category={currentCategory} />

      {/* 2. Category-Specific Subcategory Quick Filter Pills */}
      <CategoryPills
        category={currentCategory}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={handleSubcategorySelect}
      />

      {/* Mobile Filter Toggle Trigger */}
      <div className="lg:hidden flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white shadow-md cursor-pointer hover:border-zinc-700"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Filters</span>
          {(filters.date !== "all" ||
            filters.location !== "all" ||
            filters.maxPrice < 500) && (
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
          )}
        </button>
      </div>

      {/* 3. Main Content: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-52 xl:w-56 flex-shrink-0 sticky top-24">
          <EventsFilterSidebar
            filters={fullFilterState}
            onFilterChange={(newFilters) => handleFilterChange(newFilters)}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Mobile Filter Modal / Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="relative w-full max-w-sm h-full bg-[#080B12] border-l border-zinc-800 p-5 overflow-y-auto z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-sm font-bold text-white">Event Filters</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <EventsFilterSidebar
                filters={fullFilterState}
                onFilterChange={(newFilters) => handleFilterChange(newFilters)}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Right Area: Grid & Pagination */}
        <EventsGrid
          events={paginatedEvents}
          sort={filters.sort}
          onSortChange={(newSort) => handleFilterChange({ sort: newSort })}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 350, behavior: "smooth" });
          }}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
