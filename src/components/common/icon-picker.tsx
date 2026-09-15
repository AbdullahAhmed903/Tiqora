"use client";

import React, { useState, useMemo } from "react";
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

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-zinc-900 dark:text-white">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white dark:bg-zinc-900 text-left transition-all ${
            isOpen
              ? "border-blue-500 ring-2 ring-blue-500/20"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <CategoryIcon name={selectedIcon} className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {selectedIcon || "Select an icon"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Click to browse curated event icons
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 max-h-96 flex flex-col">
            {/* Header & Search */}
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons by name..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear icon search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
              {domains.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 transition-colors ${
                    selectedDomain === domain
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto mt-2 pr-1 grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="relative">
                      <CategoryIcon name={item.name} className="w-5 h-5" />
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {filteredIcons.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-zinc-500">
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
