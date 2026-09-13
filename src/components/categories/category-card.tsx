"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Music,
  Drama,
  Sparkles,
  Users,
  Wrench,
  Image as ImageIcon,
  Landmark,
  Gamepad2,
  Heart,
  Briefcase,
  Star,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { CategoryItem } from "@/types/categories";

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Music,
  Drama,
  Sparkles,
  Users,
  Wrench,
  Image: ImageIcon,
  Landmark,
  Gamepad2,
  Heart,
  Briefcase,
  Star,
};

interface CategoryCardProps {
  category: CategoryItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = ICON_MAP[category.iconName] || Trophy;

  return (
    <Link
      href={category.href}
      className="group relative bg-[#0B0F19] hover:bg-[#0E1322] border border-zinc-800/80 hover:border-blue-500/50 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col cursor-pointer"
    >
      {/* Top Banner Image with Wave & Floating Badge */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-900">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Subtle Dark Gradient Overlay for Image Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/25 to-transparent pointer-events-none" />

        {/* Fluid Organic Wave SVG Divider */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none text-[#0B0F19] group-hover:text-[#0E1322] transition-colors duration-300">
          <svg
            viewBox="0 0 500 50"
            preserveAspectRatio="none"
            className="w-full h-7 sm:h-9 fill-current"
          >
            <path d="M0,25 C150,55 350,0 500,30 L500,50 L0,50 Z" />
          </svg>
        </div>

        {/* Floating Circular Icon Badge Overlapping Wave */}
        <div
          className={`absolute bottom-2 sm:bottom-2.5 left-5 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-[#0B0F19] group-hover:border-[#0E1322] text-white transition-all duration-300 group-hover:scale-110 shadow-lg ${category.iconBg}`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 pt-3 sm:pt-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-zinc-400 mt-0.5">
            {category.eventsCount} Events
          </p>
          <p className="text-xs sm:text-sm text-zinc-400/90 leading-relaxed mt-2.5 line-clamp-2">
            {category.description}
          </p>
        </div>

        {/* Bottom Action Button */}
        <div className="pt-4 flex items-center justify-end">
          <span className="w-8 h-8 rounded-full bg-zinc-800/80 group-hover:bg-blue-600 text-zinc-400 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 shadow-md">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
