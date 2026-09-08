"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { FEATURED_EVENTS, FeaturedEvent } from "@/lib/home-data";

export function FeaturedEventsSection() {
  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
            FEATURED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            <span className="text-[#2563EB]">Upcoming</span> Events
          </h2>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors group"
        >
          <span>View All Events</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 4 Featured Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURED_EVENTS.map((event: FeaturedEvent) => (
          <Link
            key={event.id}
            href={event.href}
            className="group relative rounded-2xl border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-[#2563EB]/60 hover:shadow-xl hover:shadow-[#2563EB]/10 transition-all duration-300 min-h-[340px]"
          >
            {/* Image Background Container */}
            <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

              {/* Date Badge Overlay (Top Left) */}
              <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-xl px-2.5 py-1 text-center text-white shadow-md">
                <span className="block text-[9px] font-bold tracking-wider text-zinc-400 uppercase leading-none">
                  {event.month}
                </span>
                <span className="block text-sm font-black text-white leading-tight">
                  {event.day}
                </span>
              </div>

              {/* Category Pill Tag (Bottom Left of Image) */}
              <div className="absolute bottom-3 left-3">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-[10px] font-extrabold tracking-wider text-blue-400 uppercase backdrop-blur-xs">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-foreground group-hover:text-[#2563EB] transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-secondary-text mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Card Footer: Price & Arrow CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div>
                  <span className="text-[11px] text-secondary-text block">From</span>
                  <span className="text-base font-extrabold text-foreground">
                    ${event.price}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1D4ED8] transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
