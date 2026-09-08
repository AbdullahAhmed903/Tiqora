"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  Trophy,
  Music,
  Drama,
  Calendar,
  LayoutGrid,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  initialUser?: User | null;
}

export function Navbar({ initialUser = null }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(initialUser);
  const [prevInitialUser, setPrevInitialUser] = React.useState(initialUser);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

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
    "Abdullah Ahmed";

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Events", href: "/events", icon: Compass },
    { label: "Sports", href: "/events?category=sports", icon: Trophy },
    { label: "Concerts", href: "/events?category=concerts", icon: Music },
    { label: "Theater", href: "/events?category=theater", icon: Drama },
    { label: "Festivals", href: "/events?category=festivals", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-2 sm:px-4 lg:px-6 pt-3 pb-1">
      {/* Floating Capsule Bar */}
      <div className="max-w-[1920px] mx-auto h-14 sm:h-16 px-4 sm:px-6 rounded-2xl sm:rounded-full bg-[#080B12]/95 backdrop-blur-2xl border border-zinc-800/80 shadow-2xl flex items-center justify-between gap-2 lg:gap-4 transition-all">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative h-8 w-8 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Tiqora Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-[#2563EB] transition-colors">
            Tiqora
          </span>
        </Link>

        {/* Center: Navigation Links with Icons */}
        <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "text-[#3B82F6]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#3B82F6]" : "text-zinc-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#3B82F6] shadow-[0_0_8px_#3B82F6] rounded-full" />
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <span>More</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-zinc-400" />
            </button>

            {isMoreMenuOpen && (
              <div
                className="absolute top-full mt-2 left-0 w-44 rounded-2xl bg-zinc-950 border border-zinc-800 p-2 shadow-2xl z-50 space-y-1"
                onMouseLeave={() => setIsMoreMenuOpen(false)}
              >
                <Link
                  href="/events?category=gaming"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  Gaming
                </Link>
                <Link
                  href="/events?category=family"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  Family
                </Link>
                <Link
                  href="/events?category=business"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  Business
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Search, Theme Toggle, Notification Bell, User Capsule */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Quick Search Input with Ctrl K */}
          <form
            onSubmit={handleNavSearch}
            className="hidden md:flex items-center relative bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-1.5 w-48 lg:w-64 focus-within:border-[#2563EB] transition-all"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, teams, artists..."
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <span className="hidden lg:inline-block text-[9px] font-mono font-semibold text-zinc-500 bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 rounded-md ml-1 flex-shrink-0">
              Ctrl K
            </span>
          </form>

          {/* Theme Toggle Button */}
          <ThemeToggle
            iconOnly
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
          />

          {/* Notification Bell with Blue Indicator Dot */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => toast.info("No new notifications")}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_6px_#2563EB]" />
          </button>

          {/* User Profile Pill or Auth Action */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-black flex items-center justify-center shadow-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white max-w-[110px] truncate hidden sm:inline">
                  {displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-zinc-950 border border-zinc-800 p-2 shadow-2xl z-50 space-y-1"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-800/80">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
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
                className="text-xs font-bold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
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
            className="xl:hidden w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden mt-2 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 p-4 space-y-3 shadow-2xl">
          <form onSubmit={handleNavSearch} className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-zinc-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, teams..."
              className="w-full bg-transparent text-xs text-white focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
