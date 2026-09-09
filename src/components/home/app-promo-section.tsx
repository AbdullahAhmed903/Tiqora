"use client";

import * as React from "react";
import Image from "next/image";
import { Zap, Tag, Sparkles } from "lucide-react";

export function AppPromoSection() {
  return (
    <section className="relative rounded-3xl border border-border bg-surface/80 p-8 sm:p-12 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Download details & App badges */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
              GET THE APP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
              Your Events. <br className="hidden sm:inline" />
              <span className="text-[#2563EB]">Always With You.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
            Download our mobile app and never miss an event. Access offline tickets, get instant push alerts for upcoming matches, and discover trending concerts.
          </p>

          {/* App Store / Google Play Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white flex items-center gap-2.5 transition-all shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.07c.62-.76 1.05-1.81.93-2.87-.9.04-2.01.6-2.65 1.35-.58.67-.99 1.74-.85 2.78 1.01.08 2.05-.5 2.57-1.26z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] uppercase text-zinc-400 font-semibold leading-none">
                  Download on the
                </div>
                <div className="text-xs font-bold leading-tight">App Store</div>
              </div>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white flex items-center gap-2.5 transition-all shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.98 1.98 0 0 1-.61-1.428V3.242c0-.547.225-1.041.609-1.428zM15.206 13.414l2.96 2.96-12.016 6.94 9.056-9.9zm0-2.828L6.15 .646l12.016 6.94-2.96 2.96zm1.414 1.414l3.586-2.071a1.98 1.98 0 0 1 0 3.484l-3.586-2.071z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] uppercase text-zinc-400 font-semibold leading-none">
                  GET IT ON
                </div>
                <div className="text-xs font-bold leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Center Column: Phone Graphic Mockup */}
        <div className="lg:col-span-3 flex justify-center py-4">
          <div className="relative w-52 h-[340px] rounded-[36px] bg-zinc-950 p-3 border-4 border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Phone Notch */}
            <div className="w-20 h-4 bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />

            {/* Phone Screen Mockup Content */}
            <div className="relative w-full h-full rounded-[26px] bg-zinc-900 overflow-hidden flex flex-col items-center justify-center text-center p-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Tiqora Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-base block tracking-tight">
                  Tiqora
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Events Anywhere</span>
              </div>
              <div className="w-full bg-zinc-800/80 rounded-xl p-2.5 text-left space-y-1">
                <div className="text-[9px] font-bold text-zinc-400">UPCOMING MATCH</div>
                <div className="text-[11px] font-bold text-white truncate">El Clásico Live</div>
                <div className="text-[9px] text-[#2563EB] font-semibold">Verified E-Ticket #4892</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Feature Highlights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-background">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#2563EB] flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Faster Booking</h4>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Get tickets in seconds with 1-click Apple Pay & credit card checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-background">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#2563EB] flex-shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Exclusive Offers</h4>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Be the first to know about early bird drops, discount codes, and VIP passes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-background">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#2563EB] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Personalized Recommendations</h4>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Smart event discovery tailored specifically to your favorite sports teams & artists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
