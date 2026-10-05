"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Sliders,
  Trash2,
  Search,
  X,
  Ticket,
  Trophy,
  Sparkles,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { UserSidebar } from "@/components/layout/user-sidebar";
import { NotificationCard } from "./notification-card";
import { NotificationsEmpty } from "./notifications-empty";
import { NotificationPreferencesModal } from "./notification-preferences-modal";
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_PREFERENCES,
} from "@/lib/notifications-data";
import {
  NotificationCategory,
  NotificationItem,
  NotificationPreferenceSetting,
} from "@/types/notifications";
import { Button } from "@/components/ui/button";

interface NotificationsViewProps {
  favoritesCount?: number;
}

const CATEGORY_TABS: {
  key: NotificationCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "all", label: "All Alerts", icon: Layers },
  { key: "tickets", label: "Tickets & Passes", icon: Ticket },
  { key: "matches", label: "Matches & Live", icon: Trophy },
  { key: "offers", label: "Offers & Drops", icon: Sparkles },
  { key: "security", label: "Security", icon: ShieldCheck },
];

export function NotificationsView({ favoritesCount = 13 }: NotificationsViewProps) {
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] =
    React.useState<NotificationCategory>("all");
  const [unreadOnly, setUnreadOnly] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState<boolean>(false);
  const [preferences, setPreferences] =
    React.useState<NotificationPreferenceSetting[]>(INITIAL_PREFERENCES);

  // Unread count
  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<NotificationCategory, number> = {
      all: notifications.length,
      tickets: 0,
      matches: 0,
      offers: 0,
      security: 0,
    };
    notifications.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [notifications]);

  // Filtered and searched notifications
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.type !== activeCategory) {
        return false;
      }
      // Unread only filter
      if (unreadOnly && item.read) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        const matchesVenue = item.meta?.venue?.toLowerCase().includes(query);
        const matchesOrder = item.meta?.orderId?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMessage && !matchesVenue && !matchesOrder) {
          return false;
        }
      }
      return true;
    });
  }, [notifications, activeCategory, unreadOnly, searchQuery]);

  // Toggle Read Status
  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: !item.read } : item
      )
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    toast.success("All notifications marked as read");
  };

  // Delete notification with undo
  const handleDeleteNotification = (id: string) => {
    const deletedItem = notifications.find((n) => n.id === id);
    if (!deletedItem) return;

    setNotifications((prev) => prev.filter((item) => item.id !== id));

    toast("Notification deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setNotifications((prev) => [deletedItem, ...prev]);
          toast.success("Notification restored");
        },
      },
    });
  };

  // Clear all notifications with undo
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    const backup = [...notifications];
    setNotifications([]);

    toast("All notifications cleared", {
      action: {
        label: "Undo",
        onClick: () => {
          setNotifications(backup);
          toast.success("Notifications restored");
        },
      },
    });
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setUnreadOnly(false);
    setSearchQuery("");
  };

  const isFiltered =
    activeCategory !== "all" || unreadOnly || searchQuery.trim().length > 0;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 2-Column Responsive Layout matching Favorites & Profile */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left: Sticky User Sidebar on desktop & Mobile Horizontal Pills on mobile */}
        <aside className="w-full md:w-52 xl:w-56 flex-shrink-0 md:sticky md:top-24">
          <UserSidebar
            favoritesCount={favoritesCount}
            notificationsCount={unreadCount}
          />
        </aside>

        {/* Right: Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Hero Banner Header */}
          <div className="relative bg-gradient-to-br from-[#0B0F19] via-[#0E1528] to-[#080B12] border border-zinc-800/80 rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Info: Icon, Title, Badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.25)]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full">
                    Alert Center
                  </span>

                  {/* Dynamic Unread Pill */}
                  {unreadCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {unreadCount} Unread
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      All Caught Up
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Notifications & Activity
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
                    Live match countdowns, e-ticket digital gate passes, exclusive
                    fan drops, and account security notifications in one place.
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                {/* Mark All As Read */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className={`rounded-xl border-zinc-800 text-xs font-bold px-3.5 py-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    unreadCount > 0
                      ? "bg-zinc-900/90 text-zinc-200 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 shadow-sm"
                      : "bg-zinc-950/50 text-zinc-600 border-zinc-800/40 cursor-not-allowed"
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mark all read</span>
                </Button>

                {/* Preferences Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreferencesOpen(true)}
                  className="rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 text-xs font-bold px-3.5 py-2 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Preferences</span>
                </Button>

                {/* Clear All */}
                {notifications.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearAll}
                    className="rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs font-bold px-3.5 py-2 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear all</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Bar & Search Container */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#0B0F19]/90 border border-zinc-800/80 p-3 sm:p-4 shadow-xl backdrop-blur-md space-y-3">
            {/* Search Input and Unread Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications, matches, venues, order IDs..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9.5 pr-8 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2563EB] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Unread Only Filter Toggle */}
              <button
                type="button"
                onClick={() => setUnreadOnly(!unreadOnly)}
                className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none flex-shrink-0 ${
                  unreadOnly
                    ? "bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.2)]"
                    : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Unread Only</span>
                </div>
                {unreadCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      unreadOnly
                        ? "bg-[#2563EB] text-white"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Category Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.key;
                const count = categoryCounts[tab.key] || 0;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                        : "bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700/80"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-white" : "text-zinc-400"
                      }`}
                    />
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications List Container */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <NotificationsEmpty
                isFiltered={isFiltered}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    notification={item}
                    onToggleRead={handleToggleRead}
                    onDelete={handleDeleteNotification}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={(updated) => setPreferences(updated)}
      />
    </div>
  );
}
