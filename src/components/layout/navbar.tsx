"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { User as UserIcon, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();

    // Fetch initial auth user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    // Subscribe to realtime auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Tiqora Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-surface border border-border flex items-center justify-center group-hover:border-[#2563EB] transition-colors">
            <Image
              src="/logo.png"
              alt="Tiqora Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-[#2563EB] transition-colors">
              Tiqora
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold tracking-wider text-[#2563EB] px-1.5 py-0.5 rounded bg-[#2563EB]/10 border border-[#2563EB]/20">
              Events
            </span>
          </div>
        </Link>

        {/* Status, Auth Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isLoading ? (
            <div className="h-9 w-20 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
          ) : user ? (
            /* Logged In State: User Badge & Sign Out */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB]">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white max-w-[120px] sm:max-w-[160px] truncate">
                  {displayName}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="h-9 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer gap-1.5"
              >
                {isSigningOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5 text-zinc-500" />
                )}
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            /* Not Logged In State: Sign in & Sign up Links */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-700 hover:text-[#2563EB] dark:text-zinc-300 dark:hover:text-white px-3 py-2 rounded-xl transition-colors"
              >
                Sign in
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
