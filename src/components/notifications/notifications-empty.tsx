"use client";

import * as React from "react";
import Link from "next/link";
import { BellOff, Compass, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationsEmptyProps {
  isFiltered: boolean;
  onResetFilters?: () => void;
}

export function NotificationsEmpty({
  isFiltered,
  onResetFilters,
}: NotificationsEmptyProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B0F19]/90 border border-zinc-200 dark:border-zinc-800/80 p-8 sm:p-12 text-center shadow-xs dark:shadow-xl backdrop-blur-md flex flex-col items-center justify-center">
      {/* Ambient Pulsing Icon Circle */}
      <div className="relative mb-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 dark:bg-gradient-to-tr dark:from-blue-600/10 dark:via-blue-500/20 dark:to-indigo-600/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shadow-xs dark:shadow-[0_0_30px_rgba(37,99,235,0.2)]">
          <BellOff className="w-8 h-8 sm:w-10 sm:h-10 text-[#2563EB] dark:text-[#3B82F6]" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-800 border-2 border-white dark:border-[#0B0F19]" />
      </div>

      {/* Main Copy */}
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
        {isFiltered ? "No matching notifications found" : "You're completely caught up!"}
      </h3>

      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
        {isFiltered
          ? "There are no notifications matching your active filter criteria or keyword search. Try clearing your search query or switching categories."
          : "You don't have any pending alerts right now. We'll automatically ping you here when match kickoffs approach, tickets drop, or order receipts are issued."}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onResetFilters ? (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-zinc-200 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white font-semibold text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span>Reset filters</span>
          </Button>
        ) : null}

        <Link href="/events">
          <Button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Events & Matches</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
