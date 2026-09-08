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
    if (!newsletterEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Tiqora newsletter!");
    setNewsletterEmail("");
  };

  return (
    <footer className="border-t border-border bg-background text-secondary-text pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Socials */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden bg-surface border border-border flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Tiqora Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg text-foreground tracking-tight">
                Tiqora
              </span>
            </Link>

            <p className="text-xs text-secondary-text leading-relaxed">
              More than events. Real experiences. Book tickets for live football, concerts & theater worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 text-secondary-text pt-1">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="X Twitter"
                className="w-8 h-8 rounded-xl border border-border bg-surface flex items-center justify-center text-xs hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors"
              >
                𝕏
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="w-8 h-8 rounded-xl border border-border bg-surface flex items-center justify-center text-xs hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors"
              >
                📸
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="YouTube"
                className="w-8 h-8 rounded-xl border border-border bg-surface flex items-center justify-center text-xs hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors"
              >
                ▶
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl border border-border bg-surface flex items-center justify-center text-xs hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors"
              >
                in
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link></li>
              <li><Link href="/events" className="hover:text-[#2563EB] transition-colors">Events</Link></li>
              <li><Link href="/events?category=sports" className="hover:text-[#2563EB] transition-colors">Sports</Link></li>
              <li><Link href="/events?category=concerts" className="hover:text-[#2563EB] transition-colors">Concerts</Link></li>
              <li><Link href="/events?category=theater" className="hover:text-[#2563EB] transition-colors">Theater</Link></li>
              <li><Link href="/events?category=festivals" className="hover:text-[#2563EB] transition-colors">Festivals</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">About</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Careers</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Blog</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Press</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Help Center</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Ticket Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Terms of Service</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#2563EB] transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Col 5: Subscribe to Newsletter */}
          <div className="space-y-3 lg:col-span-1">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Subscribe to our newsletter
            </h4>
            <p className="text-xs text-secondary-text">
              Get the latest updates about events and exclusive offers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder-secondary-text focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="p-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex-shrink-0 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Tiqora. All rights reserved.</p>
          <p className="flex items-center gap-1 text-secondary-text">
            <span>Built with</span>
            <span className="text-red-500">❤️</span>
            <span>for event lovers.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
