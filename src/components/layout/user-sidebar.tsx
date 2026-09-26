"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Heart,
  Ticket,
  Bell,
  User,
  Settings,
} from "lucide-react";

export interface UserSidebarProps {
  favoritesCount?: number;
  notificationsCount?: number;
}

export function UserSidebar({
  favoritesCount,
  notificationsCount,
}: UserSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Explore",
      href: "/events",
      icon: Compass,
      isActive: pathname === "/events",
      badge: null,
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: Heart,
      isActive: pathname === "/favorites",
      badge: typeof favoritesCount === "number" && favoritesCount > 0 ? favoritesCount : null,
    },
    {
      label: "My Tickets",
      href: "/tickets",
      icon: Ticket,
      isActive: pathname === "/tickets",
      badge: null,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      isActive: pathname === "/notifications",
      badge:
        typeof notificationsCount === "number"
          ? notificationsCount > 0
            ? notificationsCount
            : null
          : 3,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
      badge: null,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
      badge: null,
    },
  ];

  return (
    <div className="w-full h-fit space-y-4 select-none">
      {/* Navigation Capsule List */}
      <nav className="bg-[#0B0F19]/90 border border-zinc-800/80 rounded-2xl p-2.5 space-y-1 shadow-xl backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                item.isActive
                  ? "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    item.isActive ? "text-white" : "text-zinc-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                    item.isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export const FavoritesSidebar = UserSidebar;
