"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Calendar,
  Users,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string | null;
}

const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    matchExact: true,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Layers,
    matchExact: false,
    badge: "Managed",
  },
  {
    name: "Sub-Categories",
    href: "/admin/subcategories",
    icon: FolderTree,
    matchExact: false,
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: Calendar,
    matchExact: false,
  },
  {
    name: "Organizers",
    href: "/admin/organizers",
    icon: Users,
    matchExact: false,
  },
];

function SidebarNavContent({
  pathname,
  userEmail,
  onItemClick,
}: {
  pathname: string;
  userEmail?: string | null;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0">
            <Image
              src="/logo.png"
              alt="Tiqora Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-zinc-900 dark:text-white tracking-tight">
                Tiqora
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-600/10 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Management Console</p>
          </div>
        </Link>

        {/* Mobile close button */}
        {onItemClick && (
          <button
            type="button"
            onClick={onItemClick}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Core Sections
        </div>

        {NAVIGATION_ITEMS.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Admin User Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                Admin Console
              </p>
              <p className="text-[11px] text-zinc-400 truncate">
                {userEmail || "admin@tiqora.com"}
              </p>
            </div>
          </div>

          <Link
            href="/"
            title="Return to Public Site"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Trigger Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={26} height={26} />
          <span className="font-bold text-sm text-zinc-900 dark:text-white">
            Tiqora Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 h-screen sticky top-0">
        <SidebarNavContent pathname={pathname} userEmail={userEmail} />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-zinc-900 h-full shadow-2xl z-10">
            <SidebarNavContent
              pathname={pathname}
              userEmail={userEmail}
              onItemClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
