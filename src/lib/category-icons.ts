import React from "react";
import * as LucideIcons from "lucide-react";

export interface CategoryIconDefinition {
  name: string;
  label: string;
  category: "Sports & Fitness" | "Music & Entertainment" | "Arts & Culture" | "Festivals & Nightlife" | "Tech & Gaming" | "Workshops & Community";
}

export const CATEGORY_ICONS_REGISTRY: CategoryIconDefinition[] = [
  // Sports & Fitness
  { name: "Trophy", label: "Trophy", category: "Sports & Fitness" },
  { name: "Medal", label: "Medal", category: "Sports & Fitness" },
  { name: "Award", label: "Award", category: "Sports & Fitness" },
  { name: "Activity", label: "Activity", category: "Sports & Fitness" },
  { name: "Flame", label: "Flame", category: "Sports & Fitness" },
  { name: "Zap", label: "Energy / Lightning", category: "Sports & Fitness" },
  { name: "Shield", label: "Shield / League", category: "Sports & Fitness" },
  { name: "Flag", label: "Flag / Racing", category: "Sports & Fitness" },
  { name: "Dumbbell", label: "Fitness / Gym", category: "Sports & Fitness" },
  { name: "Target", label: "Target / Archery", category: "Sports & Fitness" },
  { name: "CircleDot", label: "Ball / Match", category: "Sports & Fitness" },
  { name: "Compass", label: "Outdoor / Adventure", category: "Sports & Fitness" },
  { name: "Footprints", label: "Running", category: "Sports & Fitness" },
  { name: "MoreHorizontal", label: "More", category: "Sports & Fitness" },
  { name: "Wrench", label: "Repair", category: "Sports & Fitness" },
  { name: "Drama", label: "Drama", category: "Sports & Fitness" },






  // Music & Entertainment
  { name: "Music", label: "Music Note", category: "Music & Entertainment" },
  { name: "Mic", label: "Microphone", category: "Music & Entertainment" },
  { name: "Headphones", label: "Headphones / DJ", category: "Music & Entertainment" },
  { name: "Radio", label: "Radio / Broadcast", category: "Music & Entertainment" },
  { name: "Speaker", label: "Speaker / Concert", category: "Music & Entertainment" },
  { name: "Volume2", label: "Audio Volume", category: "Music & Entertainment" },
  { name: "Smile", label: "Smile", category: "Music & Entertainment" },
  { name: "Globe", label: "Globe", category: "Music & Entertainment" },
  { name: "Utensils", label: "Utensils", category: "Music & Entertainment" },



  // Arts & Culture
  { name: "Palette", label: "Art / Exhibition", category: "Arts & Culture" },
  { name: "Theater", label: "Theatre / Drama", category: "Arts & Culture" },
  { name: "Film", label: "Cinema / Film", category: "Arts & Culture" },
  { name: "Camera", label: "Photography", category: "Arts & Culture" },
  { name: "BookOpen", label: "Literature / Books", category: "Arts & Culture" },
  { name: "Image", label: "Image", category: "Arts & Culture" },
  { name: "Landmark", label: "Landmark", category: "Arts & Culture" },




  // Festivals & Nightlife
  { name: "Sparkles", label: "Sparkles / VIP", category: "Festivals & Nightlife" },
  { name: "PartyPopper", label: "Party / Celebration", category: "Festivals & Nightlife" },
  { name: "Ticket", label: "Ticket", category: "Festivals & Nightlife" },
  { name: "Calendar", label: "Calendar / Schedule", category: "Festivals & Nightlife" },
  { name: "Star", label: "Star / Gala", category: "Festivals & Nightlife" },
  { name: "Heart", label: "Heart / Charity", category: "Festivals & Nightlife" },
  { name: "MapPin", label: "Venue / Festival Ground", category: "Festivals & Nightlife" },

  // Tech & Gaming
  { name: "Gamepad2", label: "E-Sports / Gaming", category: "Tech & Gaming" },
  { name: "Cpu", label: "Tech / Hardware", category: "Tech & Gaming" },
  { name: "Laptop", label: "Hackathon / Software", category: "Tech & Gaming" },
  { name: "Tv", label: "Streaming / Live", category: "Tech & Gaming" },
  { name: "Code", label: "Developer / Coding", category: "Tech & Gaming" },

  // Workshops & Community
  { name: "Users", label: "Community / Meetup", category: "Workshops & Community" },
  { name: "Briefcase", label: "Business / Conference", category: "Workshops & Community" },
  { name: "GraduationCap", label: "Education / Lecture", category: "Workshops & Community" },
  { name: "Lightbulb", label: "Idea / Innovation", category: "Workshops & Community" },
];

/**
 * Dynamically resolves a Lucide icon component by name string.
 * Falls back to "Ticket" if the icon name is missing or invalid.
 */
export function getCategoryIconComponent(iconName?: string | null): React.ElementType {
  if (!iconName) return LucideIcons.Ticket;

  const IconComponent = (LucideIcons as Record<string, unknown>)[iconName];
  if (IconComponent && typeof IconComponent === "object") {
    return IconComponent as React.ElementType;
  }

  return LucideIcons.Ticket;
}

/**
 * Static reusable component for rendering category icons without triggering dynamic render warnings.
 */
export function CategoryIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Component = getCategoryIconComponent(name);
  return React.createElement(Component, { className });
}
