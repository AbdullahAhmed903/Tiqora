"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  CircleDot,
  Flame,
  Activity,
  Footprints,
  Dumbbell,
  Shield,
  MoreHorizontal,
  Trophy,
  Music,
  Drama,
  Sparkles,
  Radio,
  Mic,
  Zap,
  Volume2,
  Smile,
  Globe,
  Users,
  GraduationCap,
  Landmark,
  Image as ImageIcon,
  LucideIcon,
} from "lucide-react";
import { SUBCATEGORIES_BY_CATEGORY } from "@/lib/events-data";

interface CategoryPillsProps {
  category?: string;
  activeSubcategory: string;
  onSelectSubcategory: (id: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  CircleDot,
  Flame,
  Activity,
  Footprints,
  Dumbbell,
  Shield,
  MoreHorizontal,
  Trophy,
  Music,
  Drama,
  Sparkles,
  Radio,
  Mic,
  Zap,
  Volume2,
  Smile,
  Globe,
  Users,
  GraduationCap,
  Landmark,
  Image: ImageIcon,
};

// Main category slugs that route to dedicated slug pages when clicked on general /events page
const MAIN_CATEGORY_SLUGS = new Set(["sports", "concerts", "theater", "festivals", "conferences", "workshops", "cultural", "exhibitions"]);

export function CategoryPills({
  category = "all",
  activeSubcategory,
  onSelectSubcategory,
}: CategoryPillsProps) {
  const router = useRouter();
  const normCategory = category.toLowerCase();
  const pills =
    SUBCATEGORIES_BY_CATEGORY[normCategory] ||
    SUBCATEGORIES_BY_CATEGORY["all"];

  const handlePillClick = (subcategoryId: string) => {
    // If we're on /events and the user clicks on a top-level category like "sports", redirect to /events/sports
    if (
      (normCategory === "all" || normCategory === "events") &&
      MAIN_CATEGORY_SLUGS.has(subcategoryId)
    ) {
      router.push(`/events/${subcategoryId}`);
      return;
    }

    onSelectSubcategory(subcategoryId);
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-1">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-max">
        {pills.map((pill) => {
          const isActive =
            activeSubcategory === pill.subcategoryId ||
            (!activeSubcategory && pill.subcategoryId === "all");
          const IconComponent = ICON_MAP[pill.iconName] || CircleDot;

          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => handlePillClick(pill.subcategoryId)}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] scale-[1.02]"
                  : "bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <IconComponent
                className={`w-3.5 h-3.5 transition-colors ${
                  isActive ? "text-white" : "text-zinc-400"
                }`}
              />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
