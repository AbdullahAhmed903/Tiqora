"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
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

        {/* Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-secondary-text px-3 py-1.5 rounded-full border border-border bg-surface">
            <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>Ready for development</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
