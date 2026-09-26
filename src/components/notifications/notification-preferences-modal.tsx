"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Check, BellRing, ShieldCheck, Ticket, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NotificationPreferenceSetting } from "@/types/notifications";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreferenceSetting[];
  onSavePreferences: (updated: NotificationPreferenceSetting[]) => void;
}

export function NotificationPreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}: NotificationPreferencesModalProps) {
  const [localPrefs, setLocalPrefs] = React.useState<NotificationPreferenceSetting[]>(preferences);
  const [prevPreferences, setPrevPreferences] = React.useState(preferences);

  // Sync state during render when preferences prop changes
  if (preferences !== prevPreferences) {
    setPrevPreferences(preferences);
    setLocalPrefs(preferences);
  }

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setLocalPrefs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    toast.success("Notification preferences updated successfully");
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "matches":
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case "tickets":
        return <Ticket className="w-4 h-4 text-[#3B82F6]" />;
      case "promos":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "security":
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <BellRing className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-[#0B0F19] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 text-[#3B82F6] flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Notification Preferences
                </h2>
                <p className="text-xs text-zinc-400">
                  Control which alerts you receive across Tiqora
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notification preferences modal"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Items List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {localPrefs.map((pref) => (
              <div
                key={pref.id}
                onClick={() => handleToggle(pref.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 ${
                  pref.enabled
                    ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    : "bg-zinc-950/40 border-zinc-800/40 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getCategoryIcon(pref.category)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {pref.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">
                      {pref.description}
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div
                  className={`w-11 h-6 rounded-full p-1 transition-colors flex-shrink-0 flex items-center ${
                    pref.enabled ? "bg-[#2563EB]" : "bg-zinc-800"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-4 h-4 rounded-full bg-white shadow-md ${
                      pref.enabled ? "ml-auto" : "ml-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs px-5 py-2 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-6 py-2 shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
