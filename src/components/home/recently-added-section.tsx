"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RECENTLY_ADDED, RecentlyAddedEvent } from "@/lib/home-data";

export function RecentlyAddedSection() {
  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
            NEW ARRIVALS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Recently Added <span className="text-[#2563EB]">Events</span>
          </h2>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 5 Recently Added Compact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {RECENTLY_ADDED.map((event: RecentlyAddedEvent) => (
          <Link
            key={event.id}
            href={event.href}
            className="group relative rounded-xl border border-border bg-surface p-3 flex items-center gap-3 hover:border-[#2563EB]/60 hover:shadow-md transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="56px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-foreground group-hover:text-[#2563EB] transition-colors truncate">
                {event.title}
              </h3>
              <div className="text-[10px] text-secondary-text mt-0.5 font-medium">
                {event.category}
              </div>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {event.date} | {event.location}
              </div>
            </div>

            {/* Subtle Right Arrow */}
            <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-secondary-text group-hover:text-[#2563EB] group-hover:border-[#2563EB]/40 flex-shrink-0 transition-colors">
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
