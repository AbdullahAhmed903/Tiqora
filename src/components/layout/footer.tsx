"use client";

import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-secondary-text text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Tiqora Logo"
            width={22}
            height={22}
            className="object-contain"
          />
          <span className="font-bold text-foreground text-sm">Tiqora</span>
          <span className="text-secondary-text">|</span>
          <span>Events & Sports Match Ticketing</span>
        </div>

        <p className="text-secondary-text">
          © {new Date().getFullYear()} Tiqora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
