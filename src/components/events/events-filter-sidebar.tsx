"use client";

import * as React from "react";
import { Calendar, MapPin, Tag, SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";
import { LOCATION_OPTIONS } from "@/lib/events-data";
import { FilterState } from "@/types/events";

interface EventsFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
}

const DATE_OPTIONS: { id: FilterState["date"]; label: string }[] = [
  { id: "all", label: "All Dates" },
  { id: "today", label: "Today" },
  { id: "weekend", label: "This Weekend" },
  { id: "7days", label: "Next 7 Days" },
  { id: "30days", label: "Next 30 Days" },
];

export function EventsFilterSidebar({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}: EventsFilterSidebarProps) {
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);

  const selectedLocationLabel =
    LOCATION_OPTIONS.find((loc) => loc.value === filters.location)?.label ||
    "Select location";

  return (
    <div className="bg-[#0B0F19]/90 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 space-y-4.5 shadow-xl backdrop-blur-md">
      {/* 1. Date Filter */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Calendar className="w-4 h-4 text-[#3B82F6]" />
          <span>Date</span>
        </div>

        <div className="space-y-2.5">
          {DATE_OPTIONS.map((option) => {
            const isChecked = filters.date === option.id;
            return (
              <label
                key={option.id}
                onClick={() => onFilterChange({ date: option.id })}
                className="flex items-center gap-3 cursor-pointer group select-none text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isChecked
                      ? "border-2 border-[#2563EB] bg-[#2563EB]/10"
                      : "border border-zinc-700 group-hover:border-zinc-500"
                  }`}
                >
                  {isChecked && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_6px_#2563EB]" />
                  )}
                </div>
                <span className={isChecked ? "text-white font-semibold" : ""}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-zinc-800/70" />

      {/* 2. Location Filter */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <MapPin className="w-4 h-4 text-[#3B82F6]" />
          <span>Location</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="w-full flex items-center justify-between bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2.5 rounded-xl text-xs text-zinc-200 transition-colors cursor-pointer"
          >
            <span className="truncate">{selectedLocationLabel}</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                isLocationOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isLocationOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-950 border border-zinc-800 rounded-xl p-1 shadow-2xl z-30 max-h-48 overflow-y-auto scrollbar-none">
              {LOCATION_OPTIONS.map((loc) => {
                const isSelected = filters.location === loc.value;
                return (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => {
                      onFilterChange({ location: loc.value });
                      setIsLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#2563EB] text-white"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {loc.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-zinc-800/70" />

      {/* 3. Price Range Filter */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Tag className="w-4 h-4 text-[#3B82F6]" />
            <span>Price Range</span>
          </div>
          <span className="text-xs font-bold text-[#3B82F6]">
            Up to ${filters.maxPrice >= 500 ? "500+" : filters.maxPrice}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* Custom Styled Range Slider */}
          <div className="relative flex items-center">
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange({ maxPrice: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500">
            <span>$0</span>
            <span>$500+</span>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={onApplyFilters}
          className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.35)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2 rounded-xl text-zinc-500 hover:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
