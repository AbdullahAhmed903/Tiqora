"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ArrowUpDown, Frown } from "lucide-react";
import { CategoryEvent, FilterState } from "@/types/events";
import { EventCard } from "./event-card";

interface EventsGridProps {
  events: CategoryEvent[];
  sort: FilterState["sort"];
  onSortChange: (sort: FilterState["sort"]) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
}

const SORT_OPTIONS: { id: FilterState["sort"]; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "date", label: "Date: Soonest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

export function EventsGrid({
  events,
  sort,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  onResetFilters,
}: EventsGridProps) {
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sort)?.label || "Sort by";

  return (
    <div className="flex-1 space-y-6">
      {/* Grid Header Controls: Showing count & Sort Dropdown */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium">
          Showing <span className="text-white font-bold">{events.length}</span>{" "}
          events
        </span>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer shadow-md"
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
                    onSortChange(opt.id);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sort === opt.id
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

      {/* Grid Content or Empty State */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#0B0F19]/50 border border-zinc-800/80 rounded-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner">
            <Frown className="w-7 h-7 text-[#3B82F6]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No events found</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              We couldn’t find any events matching your selected criteria. Try
              adjusting or resetting your filters.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6 sm:pt-8">
          {/* Previous Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-[0_2px_10px_rgba(37,99,235,0.4)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
