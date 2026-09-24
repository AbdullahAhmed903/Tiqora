"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Compass,
  Ticket,
  Shield,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { Profile, ProfileStats } from "@/types/auth";

interface ProfileActivityCardProps {
  profile: Profile;
  stats: ProfileStats;
}

export function ProfileActivityCard({
  profile,
  stats,
}: ProfileActivityCardProps) {
  return (
    <div className="space-y-6">
      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Favorites Card */}
        <Link
          href="/favorites"
          className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 transition-all group cursor-pointer flex flex-col justify-between h-32 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="text-xl font-black text-white">
              {stats.favoritesCount}
            </span>
            <p className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-300">
              Saved Favorites
            </p>
          </div>
        </Link>

        {/* Explore Events Card */}
        <Link
          href="/events"
          className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-[#2563EB]/40 transition-all group cursor-pointer flex flex-col justify-between h-32 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#3B82F6] flex items-center justify-center">
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="text-xl font-black text-white">Events</span>
            <p className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-300">
              Browse Matches &amp; Shows
            </p>
          </div>
        </Link>

        {/* My Tickets Card */}
        <Link
          href="/tickets"
          className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 transition-all group cursor-pointer flex flex-col justify-between h-32 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Ticket className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Active
            </span>
          </div>
          <div>
            <span className="text-xl font-black text-white">
              {stats.ticketsCount}
            </span>
            <p className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-300">
              Booked Tickets
            </p>
          </div>
        </Link>
      </div>

      {/* Admin Quick Launch (Conditional) */}
      {profile.role === "admin" && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 via-zinc-900/80 to-zinc-900/60 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Administrative Control Panel
              </h4>
              <p className="text-[11px] text-zinc-400">
                Manage categories, organizers, and audit logs.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md"
          >
            <span>Open Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Account Activity Summary */}
      <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/60">
          <Sparkles className="w-4 h-4 text-[#3B82F6]" />
          <h3 className="text-sm font-bold text-white">Account Overview</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Account Status</p>
              <p className="text-zinc-400 text-[11px]">Active &amp; Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#3B82F6] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Member Since</p>
              <p className="text-zinc-400 text-[11px]">{stats.memberSinceFormatted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
