"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import {
  CATEGORY_ICONS_REGISTRY,
  CategoryIcon,
} from "@/lib/category-icons";

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  label?: string;
  error?: string | null;
}

export function IconPicker({
  selectedIcon,
  onSelectIcon,
  label = "Category Icon",
  error = null,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const containerRef = useRef<HTMLDivElement>(null);

  const domains = useMemo(() => {
    return [
      "All",
      "Sports & Fitness",
      "Music & Entertainment",
      "Arts & Culture",
      "Festivals & Nightlife",
      "Tech & Gaming",
      "Workshops & Community",
    ];
  }, []);

  const filteredIcons = useMemo(() => {
    return CATEGORY_ICONS_REGISTRY.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain =
        selectedDomain === "All" || item.category === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            isOpen
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-zinc-800"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <CategoryIcon name={selectedIcon} className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                {selectedIcon || "Select an icon"}
              </p>
              <p className="text-[11px] text-zinc-400">
                Click to browse curated icons
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180 text-blue-500" : ""
            }`}
          />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 max-h-80 flex flex-col animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input */}
            <div className="relative pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear icon search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Domain Filter Pills - scrollbar-none to hide browser scrollbar */}
            <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {domains.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-full shrink-0 transition-colors whitespace-nowrap cursor-pointer ${
                    selectedDomain === domain
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>

            {/* Icon Grid with Sleek Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto mt-1 pr-1 grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-48 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent">
              {filteredIcons.map((item) => {
                const isSelected = selectedIcon === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.name);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500/50"
                        : "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="relative">
                      <CategoryIcon name={item.name} className="w-4 h-4" />
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {filteredIcons.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-zinc-400">
                  No icons match &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
