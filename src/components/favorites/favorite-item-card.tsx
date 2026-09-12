"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Heart,
  MoreHorizontal,
  ExternalLink,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { CategoryEvent } from "@/types/events";

interface FavoriteItemCardProps {
  event: CategoryEvent;
  onRemove: (id: string) => void;
}

export function FavoriteItemCard({ event, onRemove }: FavoriteItemCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(event.id);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`);
      toast.success("Event link copied to clipboard!");
    }
  };

  return (
    <div className="relative bg-[#0B0F19]/90 border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 shadow-md hover:shadow-xl flex gap-3.5 group">
      {/* 1. Left Thumbnail */}
      <Link
        href={`/events/${event.slug}`}
        className="relative w-28 sm:w-36 aspect-[16/10] rounded-xl overflow-hidden flex-shrink-0 bg-zinc-950 shadow-inner group-hover:opacity-95 transition-opacity"
      >
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 120px, 160px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </Link>

      {/* 2. Right Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Top: Badge + Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/60 border border-blue-500/30 text-blue-400 capitalize">
            {event.subcategoryLabel || event.category}
          </span>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Blue Heart Button */}
            <button
              type="button"
              onClick={handleHeartClick}
              aria-label="Remove from favorites"
              title="Remove from favorites"
              className="w-7 h-7 rounded-full bg-blue-600/15 hover:bg-blue-600/30 text-[#3B82F6] border border-blue-500/30 flex items-center justify-center cursor-pointer transition-all shadow-xs active:scale-90"
            >
              <Heart className="w-3.5 h-3.5 fill-[#3B82F6] text-[#3B82F6]" />
            </button>

            {/* Options Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="More options"
                className="w-7 h-7 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-zinc-950 border border-zinc-800 p-1 shadow-2xl z-30 space-y-0.5"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <Link
                    href={`/events/${event.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    <span>View Details</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Share Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Title & Subtitle */}
        <div className="space-y-0.5 my-1">
          <Link
            href={`/events/${event.slug}`}
            className="block text-sm sm:text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1"
          >
            {event.title}
          </Link>

          <p className="text-[11px] text-zinc-400 truncate">
            {event.subcategory === "football"
              ? "Football • International Matches"
              : event.subcategory === "basketball"
              ? "Basketball • Professional League"
              : event.category === "concerts"
              ? "Live Performance • Concert Tour"
              : event.category === "festivals"
              ? "Music • Live Performances • Food & Arts"
              : event.category === "theater"
              ? "Stage Play • Drama Performance"
              : event.category === "workshops"
              ? "Hands-on Workshop • Tech & Skills"
              : "Cultural Exhibition • Heritage & Arts"}
          </p>
        </div>

        {/* Bottom: Date/Time + Venue + Price */}
        <div className="space-y-1 pt-1 border-t border-zinc-800/60 text-zinc-400">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3 h-3 text-zinc-500 flex-shrink-0" />
              <span className="truncate">
                {event.date} • {event.time}
              </span>
            </div>
            <span className="font-bold text-[#3B82F6] flex-shrink-0">
              {event.priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] truncate">
            <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
