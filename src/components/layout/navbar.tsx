"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  LayoutGrid,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Loader2,
  Menu,
  X,
  Heart,
  Ticket,
  User as UserIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/lib/category-icons";
import type { NavbarCategory } from "@/types/categories";

interface NavbarProps {
  initialUser?: User | null;
  categories?: NavbarCategory[];
}

export function Navbar({
  initialUser = null,
  categories = [],
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(initialUser);
  const [prevInitialUser, setPrevInitialUser] = React.useState(initialUser);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Adjust state during render when navigation occurs
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMoreMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }

  // Sync state during render when initialUser prop changes
  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    setUser(initialUser);
  }

  React.useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const res = await signOutAction();
      if (res.success) {
        toast.success("Signed out successfully");
        setUser(null);
        setIsUserMenuOpen(false);
        router.push("/login");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to sign out. Please try again.");
      }
    } catch {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const primaryCategories = categories.slice(0, 4);
  const moreCategories = categories.slice(4);

  const isItemActive = (href: string, slug?: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (slug === "events" || href === "/events") {
      return pathname === "/events";
    }
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // Do not render consumer navbar in admin dashboard / admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full px-2 sm:px-4 lg:px-6 pt-3 pb-1">
      {/* Floating Capsule Bar */}
      <div className="max-w-[1920px] mx-auto h-14 sm:h-16 px-4 sm:px-6 rounded-2xl sm:rounded-full bg-white/95 dark:bg-[#080B12]/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-md dark:shadow-2xl flex items-center justify-between gap-2 lg:gap-4 transition-all">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center">
            <Image
              src="/new-logo.webp"
              alt="Tiqora Logo"
              width={44}
              height={44}
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-zinc-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-500 transition-colors">
            Tiqora
          </span>
        </Link>

        {/* Center: Navigation Links with Icons */}
        <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3">
          {/* Home */}
          <Link
            href="/"
            className={`relative px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all ${
              isItemActive("/")
                ? "text-[#2563EB] dark:text-[#3B82F6]"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isItemActive("/") ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`} />
            <span>Home</span>
            {isItemActive("/") && (
              <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6] shadow-[0_0_8px_#2563EB] rounded-full" />
            )}
          </Link>

          {/* Events */}
          <Link
            href="/events"
            className={`relative px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all ${
              isItemActive("/events", "events")
                ? "text-[#2563EB] dark:text-[#3B82F6]"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isItemActive("/events", "events") ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`} />
            <span>Events</span>
            {isItemActive("/events", "events") && (
              <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6] shadow-[0_0_8px_#2563EB] rounded-full" />
            )}
          </Link>

          {/* Primary Top Categories from DB */}
          {primaryCategories.map((cat) => {
            const href = `/events/${cat.slug}`;
            const isActive = isItemActive(href, cat.slug);
            return (
              <Link
                key={cat.slug}
                href={href}
                className={`relative px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "text-[#2563EB] dark:text-[#3B82F6]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <CategoryIcon
                  name={cat.icon}
                  className={`w-3.5 h-3.5 ${isActive ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`}
                />
                <span>{cat.name}</span>
                {isActive && (
                  <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6] shadow-[0_0_8px_#2563EB] rounded-full" />
                )}
              </Link>
            );
          })}

          {/* More Dropdown (Remaining categories from DB) */}
          {moreCategories.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(!isMoreMenuOpen);
                }}
                className={`px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isMoreMenuOpen
                    ? "text-[#2563EB] dark:text-[#3B82F6]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>More</span>
                <ChevronDown className="w-3 h-3 ml-0.5 text-zinc-500 dark:text-zinc-400" />
              </button>

              {isMoreMenuOpen && (
                <div
                  className="absolute top-full mt-2 left-0 w-48 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 shadow-xl dark:shadow-2xl z-50 space-y-1"
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  {moreCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/events/${cat.slug}`}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl transition-colors"
                    >
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Controls: Search, Theme Toggle, Notification Bell, User Capsule */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Quick Search Input with Ctrl K */}
          <form
            onSubmit={handleNavSearch}
            className="hidden md:flex items-center relative bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-900/90 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-3.5 py-1.5 w-48 lg:w-64 focus-within:border-[#2563EB] transition-all"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, teams, artists..."
              className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
            />
            <span className="hidden lg:inline-block text-[9px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/60 px-1.5 py-0.5 rounded-md ml-1 flex-shrink-0">
              Ctrl K
            </span>
          </form>

          {/* Theme Toggle Button */}
          <ThemeToggle
            iconOnly
            className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
          />

          {/* Notification Bell with Blue Indicator Dot */}
          <Link
            href="/notifications"
            aria-label="Notifications"
            className={`w-9 h-9 rounded-full border flex items-center justify-center relative transition-colors cursor-pointer ${
              pathname === "/notifications"
                ? "border-[#2563EB] text-[#2563EB] dark:text-white bg-blue-50 dark:bg-blue-950/40"
                : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_6px_#2563EB]" />
          </Link>

          {/* User Profile Pill or Auth Action */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-black flex items-center justify-center shadow-xs overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={displayName}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-white max-w-[110px] truncate hidden sm:inline">
                  {displayName}
                </span>
                <ChevronDown className={`w-3 h-3 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 shadow-xl dark:shadow-2xl z-50 space-y-1"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white text-xs font-black flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt={displayName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{user?.email || "user@tiqora.com"}</p>
                    </div>
                  </div>

                  <Link
                    href="/favorites"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                    <span>Favorites</span>
                  </Link>

                  <Link
                    href="/notifications"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                    <span>Notifications</span>
                  </Link>

                  <Link
                    href="/tickets"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>My Tickets</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Settings</span>
                  </Link>

                  <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-1" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                  >
                    {isSigningOut ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LogOut className="w-3.5 h-3.5" />
                    )}
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-md transition-all cursor-pointer h-8"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="xl:hidden w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white flex items-center justify-center cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden mt-2 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3 shadow-2xl">
          <form onSubmit={handleNavSearch} className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, teams..."
              className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-1 pt-1">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                isItemActive("/")
                  ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                  : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
              }`}
            >
              <Home className={`w-4 h-4 ${isItemActive("/") ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`} />
              <span>Home</span>
            </Link>

            {/* Events */}
            <Link
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                isItemActive("/events", "events")
                  ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                  : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
              }`}
            >
              <Compass className={`w-4 h-4 ${isItemActive("/events", "events") ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`} />
              <span>Events</span>
            </Link>

            {/* Dynamic Categories from DB */}
            {categories.map((cat) => {
              const href = `/events/${cat.slug}`;
              const isActive = isItemActive(href, cat.slug);
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                    isActive
                      ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <CategoryIcon
                    name={cat.icon}
                    className={`w-4 h-4 ${isActive ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`}
                  />
                  <span>{cat.name}</span>
                </Link>
              );
            })}

            <div className="h-px bg-zinc-200 dark:bg-zinc-800/80 my-1" />
            <Link
              href="/favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                pathname === "/favorites"
                  ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                  : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
              }`}
            >
              <Heart className={`w-4 h-4 ${pathname === "/favorites" ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-500 dark:text-zinc-400"}`} />
              <span>Favorites</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                    pathname === "/notifications"
                      ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <Bell className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Notifications</span>
                </Link>
                <Link
                  href="/tickets"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                    pathname === "/tickets"
                      ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <Ticket className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>My Tickets</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                    pathname === "/profile"
                      ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2.5 ${
                    pathname === "/settings"
                      ? "text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 font-bold"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <SettingsIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Settings</span>
                </Link>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800/80 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer text-left"
                >
                  {isSigningOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-bold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 dark:text-zinc-300 dark:hover:text-white dark:bg-zinc-900 dark:border-zinc-800 rounded-xl transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2 rounded-xl shadow-md transition-all cursor-pointer h-8"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
