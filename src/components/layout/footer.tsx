"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = React.useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Tiqora newsletter!");
    setNewsletterEmail("");
  };

  return (
    <footer className="relative w-full bg-[#050814] text-slate-300 overflow-hidden border-t border-slate-900/80">
      {/* Background graphic from public/footer.png */}
      <div className="absolute inset-0 select-none pointer-events-none z-0">
        <Image
          src="/footer.png"
          alt="Tiqora Footer Background"
          fill
          priority
          className="object-cover object-right lg:object-center opacity-95"
        />
        {/* Subtle gradient overlay to enhance text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/40 via-transparent to-[#050814]/60 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 lg:pt-20 pb-8">
        {/* Main Upper Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-8 items-start pb-12 lg:pb-16">
          {/* Column 1: Brand Info & Social Icons (lg:col-span-3) */}
          <div className="space-y-6 lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 38 38" fill="none" className="w-8 h-8 drop-shadow-md">
                  {/* Top slanted blue bar */}
                  <path
                    d="M4.5 5.5H33.5L28.5 13.5H0.5L4.5 5.5Z"
                    fill="#2563EB"
                  />
                  {/* Left stem portion (deep blue) */}
                  <path
                    d="M10 13.5H18L11 32.5H3L10 13.5Z"
                    fill="#1D4ED8"
                  />
                  {/* Right facet / highlight (clean white) */}
                  <path
                    d="M18 13.5H24L17 32.5H11L18 13.5Z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>
              <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Tiqora
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-[270px] leading-relaxed">
              More than events. Real experiences. Book tickets for live football, concerts &amp; theater worldwide.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-1">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/60 hover:bg-blue-600/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/60 hover:bg-blue-600/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/60 hover:bg-blue-600/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/60 hover:bg-blue-600/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Group (lg:col-span-4) */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:col-span-4">
            {/* Explore */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-white/90 uppercase tracking-[0.2em]">
                Explore
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/events?category=sports" className="hover:text-white transition-colors">
                    Sports
                  </Link>
                </li>
                <li>
                  <Link href="/events?category=concerts" className="hover:text-white transition-colors">
                    Concerts
                  </Link>
                </li>
                <li>
                  <Link href="/events?category=theater" className="hover:text-white transition-colors">
                    Theater
                  </Link>
                </li>
                <li>
                  <Link href="/events?category=festivals" className="hover:text-white transition-colors">
                    Festivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-white/90 uppercase tracking-[0.2em]">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-white/90 uppercase tracking-[0.2em]">
                Support
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/ticket-policy" className="hover:text-white transition-colors">
                    Ticket Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter Section (lg:col-span-3 xl:pl-6 xl:border-l xl:border-white/10) */}
          <div className="space-y-3 lg:col-span-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] block">
              Stay In The Loop
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Join our newsletter
            </h3>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed pb-2">
              Get the latest updates about events and exclusive offers.
            </p>

            {/* Input Form with pill and circular arrow button */}
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-3 pt-1 max-w-sm">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#070D1B]/90 backdrop-blur-md border border-white/15 rounded-full px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="w-11 h-11 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 transition-all cursor-pointer group"
              >
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>

          {/* Column 4: Right Graphic Text Overlay (lg:col-span-2) */}
          <div className="hidden lg:flex flex-col justify-between items-end lg:col-span-2 min-h-[220px] text-right pr-2">
            {/* Top tracked text: EVENTS BRING PEOPLE TOGETHER */}
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-300/80 leading-relaxed text-right">
              Events<br />
              Bring<br />
              People<br />
              Together
            </div>

            {/* Middle: Cursive "Live The Moment" with brush underline */}
            <div className="my-auto select-none pointer-events-none -rotate-6 transform translate-x-2">
              <div className="font-[family-name:var(--font-caveat)] text-3xl xl:text-4xl font-bold text-white leading-tight tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                Live<br />
                The<br />
                Moment
              </div>
              {/* Blue brush stroke underline */}
              <div className="relative w-28 h-3 -mt-1 ml-auto">
                <svg
                  className="w-full h-full text-[#2563EB]"
                  viewBox="0 0 110 14"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 11C20 6 60 2 107 5C82 8.5 40 12 12 13"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#2563EB"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Separator and Content */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* Left: Copyright */}
          <div>
            <p>© {new Date().getFullYear()} Tiqora. All rights reserved.</p>
          </div>

          {/* Center: Built with love for event lovers */}
          <div className="text-center">
            <span>Built with <span className="text-red-500">❤️</span> for event lovers.</span>
          </div>

          {/* Right: EVENTS A BRIGHTER TOMORROW */}
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-[2px] bg-[#2563EB] block shrink-0" />
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 leading-tight">
              Events<br className="hidden sm:inline" /> A Brighter Tomorrow
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
