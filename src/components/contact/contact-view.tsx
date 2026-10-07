"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Ticket,
  Calendar,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { ContactInfo } from "./contact-info";
import { ContactForm } from "./contact-form";
import { SUPPORT_STATS } from "@/lib/contact-data";

export function ContactView() {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-12">
      {/* 1. Hero Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10 md:p-12 bg-white dark:bg-gradient-to-br dark:from-[#0B0F19] dark:via-[#0E1528] dark:to-[#080B12] border border-zinc-200 dark:border-zinc-800/80 text-center shadow-xs dark:shadow-2xl"
      >
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider shadow-xs dark:shadow-[0_0_12px_rgba(37,99,235,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#3B82F6]" />
            <span>Customer Care &amp; Matchday Operations</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            How Can We Help You?
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Have a question about your match tickets, gate entry, billing, or hosting an event?
            Select your department, attach any details, and our sports care specialists will respond immediately.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-2xl mx-auto">
            {SUPPORT_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/90 text-center"
              >
                <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  {stat.label}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 2. Main Two-Column Layout: Contact Channels & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct channels, hotline, office (lg:col-span-5) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <ContactInfo />
        </div>

        {/* Right Column: Interactive Contact Form (lg:col-span-7) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <ContactForm />
        </div>
      </div>

      {/* 3. Quick Action Cards Footer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="pt-6"
      >
        <div className="text-center space-y-1 mb-6">
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Common Quick Self-Service Links
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Speed up your request by visiting dedicated portal sections
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Action 1: QR Tickets */}
          <Link
            href="/profile"
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all flex items-start gap-3.5 shadow-xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                <span>My Bookings &amp; QR Passes</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                Access your active match passes and download digital QR codes.
              </p>
            </div>
          </Link>

          {/* Action 2: Event Schedule */}
          <Link
            href="/events"
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all flex items-start gap-3.5 shadow-xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                <span>Browse All Fixtures</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                Explore match dates, kick-off times, and stadium gate allocations.
              </p>
            </div>
          </Link>

          {/* Action 3: FAQs */}
          <Link
            href="/faqs"
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all flex items-start gap-3.5 shadow-xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center justify-between">
                <span>Knowledge Base &amp; FAQs</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                Answers on refund policies, transfer rules, and stadium security.
              </p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
