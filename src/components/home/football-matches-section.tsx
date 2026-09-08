"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Trophy } from "lucide-react";
import { FOOTBALL_MATCHES, FootballMatch } from "@/lib/home-data";

export function FootballMatchesSection() {
  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
            LIVE & UPCOMING
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Football <span className="text-[#2563EB]">Matches</span>
          </h2>
        </div>

        <Link
          href="/events?category=football"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 5 Football Match Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {FOOTBALL_MATCHES.map((match: FootballMatch) => (
          <div
            key={match.id}
            className="group relative rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between hover:border-[#2563EB]/60 hover:shadow-lg transition-all duration-200 space-y-4"
          >
            {/* Top Row: Live status or Scheduled Time */}
            <div className="flex items-center justify-between">
              {match.isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-extrabold text-red-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  LIVE
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-secondary-text">
                  {match.time}
                </span>
              )}
            </div>

            {/* Teams VS Section */}
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
                  {match.homeTeam.logo}
                </div>
              </div>

              <span className="text-xs font-black text-secondary-text uppercase tracking-widest">
                VS
              </span>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
                  {match.awayTeam.logo}
                </div>
              </div>
            </div>

            {/* Match Information */}
            <div className="text-center space-y-1">
              <h3 className="text-xs font-bold text-foreground group-hover:text-[#2563EB] transition-colors truncate">
                {match.title}
              </h3>
              <div className="flex items-center justify-center gap-1 text-[10px] text-secondary-text">
                <Trophy className="w-3 h-3 text-amber-500 flex-shrink-0" />
                <span className="truncate">{match.league}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-secondary-text">
                <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                <span className="truncate">{match.venue}</span>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={match.href}
              className={`w-full py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                match.isLive
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                  : "bg-[#2563EB]/10 hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#2563EB]/30"
              }`}
            >
              <span>{match.isLive ? "Watch Details" : "Get Tickets"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
