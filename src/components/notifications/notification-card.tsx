"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Ticket,
  Trophy,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { NotificationItem } from "@/types/notifications";

interface NotificationCardProps {
  notification: NotificationItem;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationCard({
  notification,
  onToggleRead,
  onDelete,
}: NotificationCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Icon & theme styling per category
  const getCategoryTheme = () => {
    switch (notification.type) {
      case "tickets":
        return {
          icon: Ticket,
          badgeBg: "bg-blue-500/10 text-[#3B82F6] border-blue-500/30",
          iconBg: "bg-blue-600/15 border-blue-500/30 text-[#3B82F6]",
          label: "Ticket Booking",
        };
      case "matches":
        return {
          icon: Trophy,
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          iconBg: "bg-emerald-600/15 border-emerald-500/30 text-emerald-400",
          label: "Match Day",
        };
      case "offers":
        return {
          icon: Sparkles,
          badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
          iconBg: "bg-purple-600/15 border-purple-500/30 text-purple-400",
          label: "Exclusive Drop",
        };
      case "security":
        return {
          icon: ShieldCheck,
          badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          iconBg: "bg-amber-600/15 border-amber-500/30 text-amber-400",
          label: "Security",
        };
      default:
        return {
          icon: Ticket,
          badgeBg: "bg-blue-500/10 text-[#3B82F6] border-blue-500/30",
          iconBg: "bg-blue-600/15 border-blue-500/30 text-[#3B82F6]",
          label: "Alert",
        };
    }
  };

  const theme = getCategoryTheme();
  const IconComponent = theme.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-md hover:shadow-xl ${
        notification.read
          ? "bg-[#0B0F19]/90 border border-zinc-800/80 hover:border-zinc-700/90 text-zinc-300"
          : "bg-gradient-to-r from-blue-950/25 via-[#0B0F19]/95 to-[#0B0F19]/95 border border-blue-500/40 hover:border-blue-400/60 shadow-[0_4px_20px_rgba(37,99,235,0.08)]"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Left: Category Icon with Styled Glow */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-inner transition-transform group-hover:scale-105 duration-200 ${theme.iconBg}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Center: Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row: Category Badge + Time + Unread indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${theme.badgeBg}`}
              >
                {notification.meta?.tag || theme.label}
              </span>

              {!notification.read && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.7)] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  New
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{notification.timeAgo}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base font-bold tracking-tight mb-1 transition-colors ${
              notification.read
                ? "text-zinc-200 group-hover:text-white"
                : "text-white"
            }`}
          >
            {notification.title}
          </h3>

          {/* Description Body */}
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-3">
            {notification.message}
          </p>

          {/* Optional Meta Chips (Venue, Date, Seat, Order ID) */}
          {notification.meta && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {notification.meta.venue && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>{notification.meta.venue}</span>
                </div>
              )}

              {notification.meta.eventDate && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>{notification.meta.eventDate}</span>
                </div>
              )}

              {notification.meta.orderId && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                  <span className="text-zinc-500">Order:</span>
                  <span className="text-blue-400 font-bold">
                    {notification.meta.orderId}
                  </span>
                </div>
              )}

              {notification.meta.seat && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
                  <Ticket className="w-3 h-3 text-zinc-500" />
                  <span>{notification.meta.seat}</span>
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
            {/* Primary Action Link / Button if available */}
            {notification.actionUrl && notification.actionLabel ? (
              <Link
                href={notification.actionUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2563EB]/15 hover:bg-[#2563EB] text-[#3B82F6] hover:text-white border border-[#2563EB]/30 transition-all cursor-pointer shadow-xs group/btn"
              >
                <span>{notification.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            ) : (
              <div />
            )}

            {/* Quick Context Actions */}
            <div className="flex items-center gap-1 relative">
              {/* Mark as Read / Unread Icon Button */}
              <button
                type="button"
                onClick={() => onToggleRead(notification.id)}
                aria-label={notification.read ? "Mark as unread" : "Mark as read"}
                title={notification.read ? "Mark as unread" : "Mark as read"}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                  notification.read
                    ? "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    : "bg-blue-900/20 border-blue-500/30 text-blue-400 hover:bg-blue-900/40 hover:text-white"
                }`}
              >
                {notification.read ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline text-[11px] font-semibold">
                  {notification.read ? "Mark unread" : "Mark read"}
                </span>
              </button>

              {/* Three-dots menu button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="More options"
                className="p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 bottom-full mb-1.5 w-44 rounded-2xl bg-zinc-950 border border-zinc-800 p-1.5 shadow-2xl z-30 space-y-1"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onToggleRead(notification.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors text-left"
                  >
                    {notification.read ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                        <span>Mark as unread</span>
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Mark as read</span>
                      </>
                    )}
                  </button>

                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{notification.actionLabel || "View Details"}</span>
                    </Link>
                  )}

                  <div className="h-px bg-zinc-800/80 my-0.5" />

                  <button
                    type="button"
                    onClick={() => {
                      onDelete(notification.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Delete alert</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
