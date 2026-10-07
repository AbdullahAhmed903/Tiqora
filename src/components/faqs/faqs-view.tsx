"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  X,
  Ticket,
  Trophy,
  CreditCard,
  ShieldCheck,
  Users,
  Smartphone,
  RotateCcw,
  Headphones,
  Sparkles,
  MessageCircle,
  Mail,
  ArrowRight,
  Layers,
} from "lucide-react";
import { FaqAccordionItem } from "./faq-accordion-item";
import {
  FAQS_LIST,
  FAQ_CATEGORIES,
  FAQ_TOPIC_HIGHLIGHTS,
  POPULAR_SEARCH_TAGS,
} from "@/lib/faqs-data";
import { FaqCategory } from "@/types/faqs";
import { Button } from "@/components/ui/button";

export function FaqsView() {
  const [activeCategory, setActiveCategory] = React.useState<FaqCategory>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [openFaqId, setOpenFaqId] = React.useState<string | null>("faq-1");

  // Filter FAQs based on active category and search input
  const filteredFaqs = React.useMemo(() => {
    return FAQS_LIST.filter((faq) => {
      // Category filter
      if (activeCategory !== "all" && faq.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = faq.question.toLowerCase().includes(query);
        const matchesAnswer = faq.answer.toLowerCase().includes(query);
        const matchesTags = faq.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesQuestion && !matchesAnswer && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<FaqCategory, number> = {
      all: FAQS_LIST.length,
      tickets: 0,
      stadium: 0,
      payments: 0,
      account: 0,
      organizers: 0,
    };
    FAQS_LIST.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleToggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleSelectQuickTag = (tag: string) => {
    setSearchQuery(tag);
    setActiveCategory("all");
  };

  const handleTopicCardClick = (cat: FaqCategory) => {
    setActiveCategory(cat);
    setSearchQuery("");
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case "Smartphone":
        return <Smartphone className="w-5 h-5 text-[#3B82F6]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case "RotateCcw":
        return <RotateCcw className="w-5 h-5 text-purple-400" />;
      case "Headphones":
        return <Headphones className="w-5 h-5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getCategoryIcon = (id: FaqCategory) => {
    switch (id) {
      case "tickets":
        return Ticket;
      case "stadium":
        return Trophy;
      case "payments":
        return CreditCard;
      case "account":
        return ShieldCheck;
      case "organizers":
        return Users;
      default:
        return Layers;
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-7 sm:space-y-10">
      {/* 1. Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative bg-white dark:bg-gradient-to-br dark:from-[#0B0F19] dark:via-[#0E1528] dark:to-[#080B12] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 shadow-sm dark:shadow-2xl overflow-hidden text-center"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          {/* Header Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider shadow-xs dark:shadow-[0_0_12px_rgba(37,99,235,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#3B82F6]" />
            <span>Help Center &amp; Knowledge Base</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Instant answers about match day gate access, verified digital QR passes,
            buyer protection refunds, and sports event management on Tiqora.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, topic, or question (e.g. 'refund', 'qr pass', 'gates')..."
                className="w-full bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-10 py-3.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#2563EB] shadow-xs dark:shadow-xl transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3.5">
              <span className="text-[11px] font-semibold text-zinc-500 mr-1">
                Popular searches:
              </span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSelectQuickTag(tag)}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-[11px] font-medium transition-colors cursor-pointer select-none"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Topic Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FAQ_TOPIC_HIGHLIGHTS.map((highlight, index) => (
          <motion.div
            key={highlight.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleTopicCardClick(highlight.category)}
            className="group p-5 rounded-2xl bg-white dark:bg-[#0B0F19]/90 border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-400/60 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer select-none relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              {getTopicIcon(highlight.iconName)}
            </div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {highlight.title}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {highlight.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 3. Category Filter Navigation Pills */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0B0F19]/90 border border-zinc-200 dark:border-zinc-800/80 p-3 shadow-xs dark:shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {FAQ_CATEGORIES.map((cat) => {
            const IconComponent = getCategoryIcon(cat.id);
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id];

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                    : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80"
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FAQs Accordion List */}
      <div className="space-y-3">
        {/* Results Counter if search query is active */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 px-1">
            <span>
              Showing <strong className="text-zinc-900 dark:text-white">{filteredFaqs.length}</strong>{" "}
              {filteredFaqs.length === 1 ? "answer" : "answers"} for &ldquo;
              <span className="text-blue-600 dark:text-blue-400">{searchQuery}</span>&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset search
            </button>
          </div>
        )}

        {filteredFaqs.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-white dark:bg-[#0B0F19]/90 border border-zinc-200 dark:border-zinc-800/80 p-8 sm:p-12 text-center shadow-xs dark:shadow-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
              <HelpCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-1.5">
              No matching questions found
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-5 leading-relaxed">
              We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Try different
              keywords or reach out to our support specialists directly.
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="rounded-full border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                Clear Filters
              </Button>
              <Link href="/events">
                <Button
                  type="button"
                  className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                >
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Accordion Items List */
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => (
              <FaqAccordionItem
                key={faq.id}
                item={faq}
                isOpen={openFaqId === faq.id}
                onToggle={() => handleToggleFaq(faq.id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 5. Direct Contact & Support CTA Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-blue-50/60 dark:bg-gradient-to-r dark:from-[#0E1528] dark:via-[#0B0F19] dark:to-[#0E1528] border border-blue-200 dark:border-blue-500/30 p-5 sm:p-8 md:p-10 shadow-xs dark:shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-[#3B82F6] text-[11px] font-bold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>24/7 Match Concierge</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Still have questions or need gate assistance?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            Our match ticketing specialists and support marshals are available 24/7
            to resolve booking, payment, and venue access inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
          <a
            href="mailto:support@tiqora.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Email Support</span>
          </a>

          <Link href="/events">
            <Button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg shadow-blue-600/20 dark:shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>Browse Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
