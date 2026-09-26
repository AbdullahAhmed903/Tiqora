"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Flame,
  Ticket,
  Trophy,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { FaqItem } from "@/types/faqs";

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const [copied, setCopied] = React.useState(false);
  const [feedbackGiven, setFeedbackGiven] = React.useState<"up" | "down" | null>(null);

  const getCategoryBadge = () => {
    switch (item.category) {
      case "tickets":
        return { label: "Tickets & Passes", icon: Ticket, color: "text-[#3B82F6] bg-blue-950/50 border-blue-500/30" };
      case "stadium":
        return { label: "Match Day & Gates", icon: Trophy, color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/30" };
      case "payments":
        return { label: "Payments & Refunds", icon: CreditCard, color: "text-purple-400 bg-purple-950/50 border-purple-500/30" };
      case "account":
        return { label: "Account & Safety", icon: ShieldCheck, color: "text-amber-400 bg-amber-950/50 border-amber-500/30" };
      case "organizers":
        return { label: "Organizers", icon: Users, color: "text-sky-400 bg-sky-950/50 border-sky-500/30" };
      default:
        return { label: "General", icon: Ticket, color: "text-zinc-400 bg-zinc-900 border-zinc-800" };
    }
  };

  const badge = getCategoryBadge();
  const IconComponent = badge.icon;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/faqs#${item.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Question link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (type: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    if (feedbackGiven) return;
    setFeedbackGiven(type);
    toast.success(
      type === "up"
        ? "Thank you! Glad this answered your question."
        : "Thank you for your feedback. We're actively improving our guides."
    );
  };

  return (
    <motion.div
      layout
      id={item.id}
      className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
        isOpen
          ? "bg-gradient-to-r from-blue-950/20 via-[#0B0F19]/95 to-[#0B0F19]/95 border-blue-500/40 shadow-[0_4px_24px_rgba(37,99,235,0.08)]"
          : "bg-[#0B0F19]/90 border-zinc-800/80 hover:border-zinc-700/90 shadow-md"
      }`}
    >
      {/* Clickable Header Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none group"
      >
        <div className="flex-1 min-w-0 space-y-2">
          {/* Metadata badges: Category + Popular */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${badge.color}`}
            >
              <IconComponent className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>

            {item.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600/15 border border-blue-500/30 text-blue-400">
                <Flame className="w-3 h-3 text-[#3B82F6]" />
                <span>Popular</span>
              </span>
            )}
          </div>

          {/* Question Text */}
          <h3
            className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
              isOpen
                ? "text-white"
                : "text-zinc-200 group-hover:text-white"
            }`}
          >
            {item.question}
          </h3>
        </div>

        {/* Expand / Collapse Indicator */}
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-200 ${
            isOpen
              ? "bg-[#2563EB] border-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] rotate-180"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700"
          }`}
        >
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </div>
      </button>

      {/* Expandable Answer Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60">
              <p className="pt-2">{item.answer}</p>

              {/* Tag Chips */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-zinc-800/40">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mr-1">
                    Related:
                  </span>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Feedback & Share Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-zinc-800/40">
                {/* Helpful feedback */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-medium">
                    Was this helpful?
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleFeedback("up", e)}
                    disabled={feedbackGiven !== null}
                    aria-label="Mark answer as helpful"
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      feedbackGiven === "up"
                        ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleFeedback("down", e)}
                    disabled={feedbackGiven !== null}
                    aria-label="Mark answer as not helpful"
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      feedbackGiven === "down"
                        ? "bg-red-950/60 border-red-500/40 text-red-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Copy Direct Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy link to this answer"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
