import * as React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { CATEGORY_HERO_CONFIGS } from "@/lib/events-data";

interface EventsHeroBannerProps {
  category?: string;
}

export function EventsHeroBanner({ category = "all" }: EventsHeroBannerProps) {
  const normKey = category.toLowerCase();
  const config =
    CATEGORY_HERO_CONFIGS[normKey] || CATEGORY_HERO_CONFIGS["all"];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-950/60 shadow-[0_10px_40px_-15px_rgba(37,99,235,0.25)] min-h-[260px] sm:min-h-[290px] flex items-center bg-[#07090E]">
      {/* Background Banner Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slug-pages.png"
          alt="Events Banner"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1400px"
          className="object-cover object-right sm:object-center opacity-90 transition-transform duration-700 hover:scale-105"
        />
        {/* Soft Left vignette for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080E] via-[#06080E]/80 to-transparent w-full md:w-3/5 pointer-events-none" />
        {/* Ambient Top & Bottom dark blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/40 via-transparent to-[#06080E]/60 pointer-events-none" />
      </div>

      {/* Hero Content on Left */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-8 max-w-2xl flex flex-col justify-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-semibold backdrop-blur-md w-fit mb-3 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{config.badge}</span>
        </div>

        {/* Dynamic Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          <span>{config.titleFirst}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]">
            {config.titleAccent}
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="mt-3 text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-lg font-normal">
          {config.description}
        </p>
      </div>

      {/* Subtle outer glowing light flare */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
