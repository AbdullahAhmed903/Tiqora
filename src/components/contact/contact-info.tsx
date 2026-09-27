"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Headphones,
  MessageCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* 1. Live Matchday Helpdesk Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-blue-900/30 via-zinc-900/90 to-zinc-950 border border-blue-500/20 shadow-xl"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Headphones className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Direct Matchday Support</span>
            </div>
            {/* Live Status Pulse */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Systems Online</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Need Urgent Help at the Gate?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
              If you are currently outside the stadium experiencing turnstile or QR code validation issues, call our direct stadium dispatch.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href="tel:+20234567890"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span>+20 2 3456 7890</span>
            </a>
            <a
              href="https://wa.me/201098765432"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Live Chat</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* 2. Direct Department Channels */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="rounded-3xl p-6 sm:p-7 bg-zinc-900/60 dark:bg-zinc-900/40 border border-zinc-800/80 space-y-5"
      >
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
          Direct Channels & Inboxes
        </h4>

        <div className="space-y-4">
          {/* General Support */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-400">Fan & Ticket Inquiries</div>
              <a
                href="mailto:support@tiqora.com"
                className="text-sm font-bold text-white hover:text-blue-400 transition-colors truncate block"
              >
                support@tiqora.com
              </a>
              <p className="text-[11px] text-zinc-500">24/7 dedicated support desk</p>
            </div>
          </div>

          {/* Organizer Partnerships */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-400">Club & Tournament Organizers</div>
              <a
                href="mailto:organizers@tiqora.com"
                className="text-sm font-bold text-white hover:text-indigo-400 transition-colors truncate block"
              >
                organizers@tiqora.com
              </a>
              <p className="text-[11px] text-zinc-500">Event listing & promoter partnerships</p>
            </div>
          </div>

          {/* Office Location */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-400">Main Operations Hub</div>
              <div className="text-xs sm:text-sm font-bold text-white">
                Sports City Complex, Cairo
              </div>
              <p className="text-[11px] text-zinc-500">Nasr City & New Administrative Capital, Egypt</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-400">Support Availability</div>
              <div className="text-xs sm:text-sm font-bold text-white">
                Match Days: 24 Hours Open
              </div>
              <p className="text-[11px] text-zinc-500">Mon - Fri: 9:00 AM – 9:00 PM (EET)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Self-Service FAQs Promo Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.14 }}
        className="rounded-3xl p-6 bg-gradient-to-r from-blue-600/10 via-zinc-900 to-zinc-950 border border-blue-500/20 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[#3B82F6] shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Have a common question?</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Find instant answers regarding match ticket transfers, digital QR passes, stadium gates, and refund terms in our FAQ library.
            </p>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-1 group"
            >
              <span>Explore 20+ Frequently Asked Questions</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 4. Guarantee / Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] sm:text-xs text-zinc-300 font-medium">
            100% Verified Tickets
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] sm:text-xs text-zinc-300 font-medium">
            Secure Fan Protection
          </span>
        </div>
      </div>
    </div>
  );
}
