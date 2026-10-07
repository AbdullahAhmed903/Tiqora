"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
} from "lucide-react";

export interface CustomCalendarProps {
  value?: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string; // Format: YYYY-MM-DD (e.g. 1920-01-01)
  maxDate?: string; // Format: YYYY-MM-DD (defaults to today for DOB)
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  placement?: "bottom" | "top" | "auto";
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_ABBREVIATIONS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Safe date helpers avoiding UTC timezone offset shifts
function parseDateParts(dateStr?: string) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

function formatToISO(year: number, month: number, day: number) {
  const y = year.toString().padStart(4, "0");
  const m = (month + 1).toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function CustomCalendar({
  value,
  onChange,
  minDate = "1920-01-01",
  maxDate,
  placeholder = "Select date of birth",
  disabled = false,
  className = "",
  id,
  placement = "auto",
}: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [computedPlacement, setComputedPlacement] = useState<"bottom" | "top">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);

  // Today reference
  const today = useMemo(() => new Date(), []);
  const todayISO = useMemo(
    () => formatToISO(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  const effectiveMaxDate = maxDate || todayISO;

  // Selected date parsed
  const parsedValue = useMemo(() => parseDateParts(value), [value]);

  // Navigation state (null = follow selected value or fallback)
  const [navYear, setNavYear] = useState<number | null>(null);
  const [navMonth, setNavMonth] = useState<number | null>(null);

  const fallbackYear = today.getFullYear() - 20;
  const viewYear = navYear ?? (parsedValue ? parsedValue.year : fallbackYear);
  const viewMonth = navMonth ?? (parsedValue ? parsedValue.month : 0);

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

  // Toggle popover with smart placement detection
  const handleToggleOpen = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      if (placement === "auto") {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setComputedPlacement(
          spaceBelow < 350 && spaceAbove > 220 ? "top" : "bottom"
        );
      } else {
        setComputedPlacement(placement);
      }
      setNavYear(null);
      setNavMonth(null);
    }
    setIsOpen((prev) => !prev);
  };

  // Year range options (minDate to effectiveMaxDate)
  const minYear = parseInt(minDate.split("-")[0], 10) || 1920;
  const maxYear = parseInt(effectiveMaxDate.split("-")[0], 10) || today.getFullYear();

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      years.push(y);
    }
    return years;
  }, [minYear, maxYear]);

  // Navigate months
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      if (viewYear > minYear) {
        setNavYear(viewYear - 1);
        setNavMonth(11);
      }
    } else {
      setNavMonth(viewMonth - 1);
      setNavYear(viewYear);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setNavYear(viewYear + 1);
        setNavMonth(0);
      }
    } else {
      setNavMonth(viewMonth + 1);
      setNavYear(viewYear);
    }
  };

  // Select a day
  const handleDaySelect = (day: number) => {
    const isoString = formatToISO(viewYear, viewMonth, day);
    onChange(isoString);
    setNavYear(null);
    setNavMonth(null);
    setIsOpen(false);
  };

  // Clear date
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNavYear(null);
    setNavMonth(null);
    onChange("");
  };

  // Calculate calendar grid for viewYear and viewMonth
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Display label for selected date
  const displayLabel = useMemo(() => {
    if (!parsedValue) return "";
    const monthStr = MONTH_NAMES[parsedValue.month];
    return `${monthStr} ${parsedValue.day}, ${parsedValue.year}`;
  }, [parsedValue]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <div
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleOpen();
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
          disabled
            ? "bg-zinc-100 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
            : isOpen
            ? "bg-zinc-50 dark:bg-zinc-900 border-[#2563EB] ring-2 ring-[#2563EB]/20 text-zinc-900 dark:text-white"
            : "bg-zinc-50 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-white"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon
            className={`w-4 h-4 flex-shrink-0 transition-colors ${
              isOpen || value ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-400 dark:text-zinc-500"
            }`}
          />
          <span
            className={`truncate text-sm ${
              value ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {displayLabel || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear date"
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#2563EB] dark:text-[#3B82F6]" : ""
            }`}
          />
        </div>
      </div>

      {/* Popover Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: computedPlacement === "top" ? -6 : 6,
              scale: 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: computedPlacement === "top" ? -4 : 4,
              scale: 0.98,
            }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`absolute left-0 ${
              computedPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2"
            } w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/90 p-4 shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-[90] backdrop-blur-xl`}
          >
            {/* Calendar Header: Month & Year Selectors with Step Chevrons */}
            <div className="flex items-center justify-between gap-1 pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800/70">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={viewYear <= minYear && viewMonth === 0}
                aria-label="Previous month"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Month & Year Selectors */}
              <div className="flex items-center gap-2">
                {/* Month Dropdown */}
                <div className="relative">
                  <select
                    value={viewMonth}
                    onChange={(e) => {
                      setNavMonth(parseInt(e.target.value, 10));
                      setNavYear(viewYear);
                    }}
                    className="appearance-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-white text-xs font-bold rounded-lg pl-2.5 pr-6 py-1.5 cursor-pointer focus:outline-none focus:border-[#2563EB]"
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={name} value={idx} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                  <select
                    value={viewYear}
                    onChange={(e) => {
                      setNavYear(parseInt(e.target.value, 10));
                      setNavMonth(viewMonth);
                    }}
                    className="appearance-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-white text-xs font-bold rounded-lg pl-2.5 pr-6 py-1.5 cursor-pointer focus:outline-none focus:border-[#2563EB]"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={viewYear >= maxYear && viewMonth >= 11}
                aria-label="Next month"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day of Week Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {DAY_ABBREVIATIONS.map((day) => (
                <div
                  key={day}
                  className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Previous month overflow days */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => {
                const prevDay = daysInPrevMonth - firstDayIndex + idx + 1;
                return (
                  <div
                    key={`prev-${idx}`}
                    className="h-8 flex items-center justify-center text-xs text-zinc-300 dark:text-zinc-700 select-none"
                  >
                    {prevDay}
                  </div>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dateISO = formatToISO(viewYear, viewMonth, day);
                const isSelected =
                  parsedValue &&
                  parsedValue.year === viewYear &&
                  parsedValue.month === viewMonth &&
                  parsedValue.day === day;

                const isToday = dateISO === todayISO;
                const isFuture = dateISO > effectiveMaxDate;
                const isTooOld = dateISO < minDate;
                const isDisabled = isFuture || isTooOld;

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDaySelect(day)}
                    className={`h-8 w-8 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2563EB] text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.45)]"
                        : isDisabled
                        ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                        : isToday
                        ? "text-[#2563EB] dark:text-[#3B82F6] border border-[#2563EB]/40 dark:border-[#2563EB]/60 hover:bg-[#2563EB]/10 dark:hover:bg-[#2563EB]/20 hover:text-[#2563EB] dark:hover:text-white"
                        : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Calendar Footer Info */}
            <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="text-zinc-500">
                {parsedValue
                  ? `Selected: ${formatToISO(
                      parsedValue.year,
                      parsedValue.month,
                      parsedValue.day
                    )}`
                  : "No date selected"}
              </span>

              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DatePicker = CustomCalendar;
