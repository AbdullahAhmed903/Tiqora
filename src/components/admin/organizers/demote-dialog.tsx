"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  targetRole: "admin" | "organizer" | "user";
  isLoading?: boolean;
}

export function DemoteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  targetRole,
  isLoading = false,
}: DemoteConfirmationDialogProps) {
  if (!isOpen) return null;

  const isDemotingToUser = targetRole === "user";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {isDemotingToUser ? "Demote to Regular User" : `Change Role to ${targetRole.toUpperCase()}`}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Are you sure you want to change the role of{" "}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {userName}
                </span>{" "}
                to <span className="font-bold uppercase text-amber-500">{targetRole}</span>?
              </p>

              {isDemotingToUser && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                  ⚠️ This action will immediately revoke all access to the administrative console and remove all organizer permissions.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-xl text-xs font-semibold h-9 px-4 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`rounded-xl text-xs font-semibold h-9 px-4 text-white shadow-md transition-all ${
                isDemotingToUser
                  ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Updating...
                </>
              ) : (
                `Confirm Role Change`
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
