"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function BannerCtaSection() {
  return (
    <section className="relative rounded-3xl overflow-hidden border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-zinc-950 to-blue-950/60 p-8 sm:p-10 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Callout Header & CTA */}
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tiqora Platform</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Unforgettable Events Are Just a Click Away.
          </h2>

          <p className="text-sm text-zinc-300">
            Join thousands of fans and event lovers experiencing live sports, stadium concerts, and theatrical performances.
          </p>

          <div className="pt-2 flex justify-center lg:justify-start">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#2563EB]/25 transition-all cursor-pointer"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Platform Stats */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-6 lg:pt-0 lg:pl-10 text-center">
          <div>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white block">
              10K+
            </span>
            <span className="text-xs font-medium text-zinc-400 mt-1 block">
              Happy Users
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white block">
              500+
            </span>
            <span className="text-xs font-medium text-zinc-400 mt-1 block">
              Events
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white block">
              50+
            </span>
            <span className="text-xs font-medium text-zinc-400 mt-1 block">
              Partners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
