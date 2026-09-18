"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  CircleDot,
  Music,
  Drama,
  Sparkles,
  GraduationCap,
  Landmark,
  Users,
  ImageIcon,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { CategoryEvent } from "@/types/events";

interface EventCardProps {
  event: CategoryEvent;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

interface CategoryStyle {
  icon: LucideIcon;
  bgClass: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  concerts: {
    icon: Music,
    bgClass: "bg-indigo-600/90 border-indigo-400/30 text-white",
  },
  festivals: {
    icon: Sparkles,
    bgClass: "bg-emerald-600/90 border-emerald-400/30 text-white",
  },
  sports: {
    icon: CircleDot,
    bgClass: "bg-blue-600/90 border-blue-400/30 text-white",
  },
  theater: {
    icon: Drama,
    bgClass: "bg-purple-600/90 border-purple-400/30 text-white",
  },
  workshops: {
    icon: GraduationCap,
    bgClass: "bg-amber-600/90 border-amber-400/30 text-white",
  },
  conferences: {
    icon: Users,
    bgClass: "bg-sky-600/90 border-sky-400/30 text-white",
  },
  cultural: {
    icon: Landmark,
    bgClass: "bg-teal-600/90 border-teal-400/30 text-white",
  },
  exhibitions: {
    icon: ImageIcon,
    bgClass: "bg-rose-600/90 border-rose-400/30 text-white",
  },
};

export function EventCard({
  event,
  isFavorite = false,
  onToggleFavorite,
}: EventCardProps) {
  const [favorite, setFavorite] = React.useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !favorite;
    setFavorite(nextState);
    if (onToggleFavorite) {
      onToggleFavorite(event.id);
    }
    if (nextState) {
      toast.success(`Saved "${event.title}" to favorites!`);
    } else {
      toast.info(`Removed "${event.title}" from favorites`);
    }
  };

  const styleConfig =
    CATEGORY_STYLES[event.category] ||
    CATEGORY_STYLES[event.subcategory] || {
      icon: CircleDot,
      bgClass: "bg-blue-600/90 border-blue-400/30 text-white",
    };

  const CategoryIcon = styleConfig.icon;

  // Derive stub date parts if not directly set
  const month = event.monthShort || event.date.slice(0, 3).toUpperCase();
  const dayMatch = event.date.match(/\d+/);
  const day = event.dayNumber || (dayMatch ? dayMatch[0].padStart(2, "0") : "15");
  const yearMatch = event.date.match(/\d{4}/);
  const year = event.year || (yearMatch ? yearMatch[0] : "2025");

  return (
    <div className="relative bg-[#0B0F19]/95 border border-zinc-800/80 hover:border-blue-500/50 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 group transition-all duration-300 shadow-xl flex flex-col justify-between hover:shadow-[0_12px_30px_-10px_rgba(37,99,235,0.25)] hover:-translate-y-1">
      {/* =========================================
          1. LEFT EDGE: Distinct notch at ~38% + teeth
          ========================================= */}
      <div className="absolute -left-2.5 sm:-left-3 top-[38%] -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#080B12] border-r border-zinc-800/90 z-20 pointer-events-none" />
      <div className="absolute -left-[5px] top-4 bottom-4 flex flex-col justify-between items-center pointer-events-none z-20">
        {Array.from({ length: 7 }).map((_, i) =>
          i === 2 || i === 3 ? (
            <div key={i} className="w-2.5 h-2.5 opacity-0" />
          ) : (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#080B12] border-r border-zinc-800/90"
            />
          )
        )}
      </div>

      {/* =========================================
          2. RIGHT EDGE: Distinct notch at ~62% + teeth
          ========================================= */}
      <div className="absolute -right-2.5 sm:-right-3 top-[62%] -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#080B12] border-l border-zinc-800/90 z-20 pointer-events-none" />
      <div className="absolute -right-[5px] top-4 bottom-4 flex flex-col justify-between items-center pointer-events-none z-20">
        {Array.from({ length: 7 }).map((_, i) =>
          i === 4 || i === 5 ? (
            <div key={i} className="w-2.5 h-2.5 opacity-0" />
          ) : (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#080B12] border-l border-zinc-800/90"
            />
          )
        )}
      </div>

      {/* =========================================
          UPPER SECTION: Image + Dashed Divider + Date Stub
          ========================================= */}
      <div>
        <div className="flex flex-row items-stretch min-w-0">
          {/* Left: Image with Category Badge & Favorite Button */}
          <div className="relative flex-1 min-w-0 aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 shadow-inner">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Ambient Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-transparent to-black/20 pointer-events-none" />

            {/* Category Badge (Top-Left) */}
            <div
              className={`absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border backdrop-blur-md shadow-md ${styleConfig.bgClass}`}
            >
              <CategoryIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{event.subcategoryLabel}</span>
            </div>

            {/* Favorite Heart Button (Top-Right) */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center border border-white/15 hover:border-white/30 transition-all z-10 cursor-pointer shadow-md"
            >
              <Heart
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-200 ${
                  favorite
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-white/90 hover:text-red-400"
                }`}
              />
            </button>
          </div>

          {/* Vertical Divider (Only separates upper section!) */}
          <div className="relative flex-shrink-0 flex items-stretch mx-2 sm:mx-2.5">
            {/* Vertical Dashed Line */}
            <div className="w-px border-l border-dashed border-zinc-700/60 my-1 self-stretch" />
          </div>

          {/* Right Stub: Date kept at top, NO barcode */}
          <div className="w-14 sm:w-16 flex-shrink-0 flex flex-col items-center justify-center text-center relative z-10 px-0.5">
            <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-zinc-400 uppercase">
              {month}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white leading-none my-1 tracking-tight">
              {day}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500">
              {year}
            </span>
          </div>
        </div>

        {/* =========================================
            MIDDLE SECTION: Details (Full Width!)
            Titles can now extend across the entire card!
            ========================================= */}
        <div className="pt-2.5 sm:pt-3 space-y-1">
          <h3 className="text-sm sm:text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500 flex-shrink-0" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500 flex-shrink-0" />
            <span className="truncate">
              {event.date} • {event.time}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM ROW: Price & Get Tickets (Full Width!)
          Get Tickets button moves all the way to the right!
          ========================================= */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-zinc-800/40">
        <div className="text-xs sm:text-sm font-black text-[#3B82F6]">
          {event.priceFormatted}
        </div>

        <Link
          href={`/events/${event.slug}`}
          className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] sm:text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95 ml-auto"
        >
          <span>Get Tickets</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
