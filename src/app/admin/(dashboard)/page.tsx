import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Plus,
  ExternalLink,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Tiqora",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch quick metrics for categories
  const [{ count: totalCategories }, { count: activeCategories }, { count: popularCategories }] =
    await Promise.all([
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("is_popular", true),
    ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/10">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
            Administration Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back to Tiqora Admin
          </h1>
          <p className="text-sm text-blue-100 mt-2">
            Manage your sports matches, entertainment categories, organizer access, and live inventory from this control center.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold transition-colors shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span>Manage Categories</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Categories */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Categories
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {totalCategories || 0}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Configured taxonomy</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Active Categories */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Active / Published
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {activeCategories || 0}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Visible to public fans</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Popular Categories */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Popular / Featured
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {popularCategories || 0}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Pinned to homepage carousel</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Section Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Event Categories
                </h3>
                <p className="text-xs text-zinc-500">
                  Organize sports, matches, and entertainment
                </p>
              </div>
            </div>
            <Link
              href="/admin/categories/new"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-blue-600 transition-colors"
              title="Add New Category"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Configure event categories with customized order priority (top 4-5 in the navbar, remainder under More), WebP compressed visuals, and instant visibility toggles.
          </p>

          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2"
          >
            <span>Open Categories Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Organizers Section Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Organizers &amp; Staff
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage event staff and permissions
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Provision granular permission scopes for event organizers across venues, tickets, bookings, coupons, and analytics.
          </p>

          <Link
            href="/admin/organizers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2"
          >
            <span>View Organizers List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
