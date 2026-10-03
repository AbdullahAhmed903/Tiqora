"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  KeyRound,
  Shield,
  Tag,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateStaffPermissionsAction } from "@/app/actions/admin-organizers";
import type { StaffMemberRow, PermissionSection, AccessLevel } from "@/types/auth";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staff: StaffMemberRow;
  availableCategories: Array<{ id: string; name: string; slug: string; icon: string | null }>;
}

const ALL_SECTIONS: { key: PermissionSection; label: string; description: string }[] = [
  { key: "events", label: "Events", description: "Create & manage matches, concerts, listings" },
  { key: "venues", label: "Venues", description: "Stadiums, arenas, and seating layouts" },
  { key: "tickets", label: "Tickets", description: "Tier pricing, inventory, allocation" },
  { key: "bookings", label: "Bookings", description: "Customer reservations & order records" },
  { key: "coupons", label: "Coupons", description: "Promo codes, discounts & flash sales" },
  { key: "analytics", label: "Analytics", description: "Sales dashboards & conversion reports" },
  { key: "support", label: "Support", description: "Customer inquiries & dispute resolution" },
];

export function EditStaffModal({
  isOpen,
  onClose,
  onSuccess,
  staff,
  availableCategories,
}: EditStaffModalProps) {
  // Initialize existing specializations
  const [specializations, setSpecializations] = useState<string[]>(
    staff.specializations || []
  );
  const [customSpecInput, setCustomSpecInput] = useState("");

  // Initialize section permissions from staff.permissions
  const initialPerms: Record<PermissionSection, "none" | AccessLevel> = {
    events: "none",
    venues: "none",
    tickets: "none",
    bookings: "none",
    coupons: "none",
    analytics: "none",
    support: "none",
  };

  staff.permissions.forEach((p) => {
    initialPerms[p.section] = p.access_level;
  });

  const [permissions, setPermissions] = useState<Record<PermissionSection, "none" | AccessLevel>>(
    initialPerms
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleSpecialization = (slug: string) => {
    setSpecializations((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleAddCustomSpecialization = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customSpecInput.trim()) {
      e.preventDefault();
      const val = customSpecInput.trim().toLowerCase();
      if (!specializations.includes(val)) {
        setSpecializations((prev) => [...prev, val]);
      }
      setCustomSpecInput("");
    }
  };

  const handlePermissionPreset = (preset: "full" | "read" | "none") => {
    const updated: Record<PermissionSection, "none" | AccessLevel> = {
      events: preset === "full" ? "write" : preset === "read" ? "read" : "none",
      venues: preset === "full" ? "write" : preset === "read" ? "read" : "none",
      tickets: preset === "full" ? "write" : preset === "read" ? "read" : "none",
      bookings: preset === "full" ? "write" : preset === "read" ? "read" : "none",
      coupons: preset === "full" ? "write" : preset === "read" ? "read" : "none",
      analytics: preset === "full" ? "write" : preset === "read" ? "read" : "none",
      support: preset === "full" ? "write" : preset === "read" ? "read" : "none",
    };
    setPermissions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activePermissions = Object.entries(permissions)
      .filter(([, level]) => level !== "none")
      .map(([section, access_level]) => ({
        section: section as PermissionSection,
        access_level: access_level as AccessLevel,
      }));

    setIsSubmitting(true);
    const toastId = toast.loading("Updating permissions & specializations...");

    try {
      const res = await updateStaffPermissionsAction({
        target_user_id: staff.id,
        specializations,
        permissions: activePermissions,
      });

      if (res.success) {
        toast.success(`Updated permissions for ${staff.full_name || staff.username}!`, {
          id: toastId,
        });
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Failed to update permissions.", { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isSubmitting ? undefined : onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 14 }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-10 overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Edit Permissions & Specializations
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Managing access for{" "}
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {staff.full_name || staff.username}
                  </span>{" "}
                  ({staff.role})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Domain Specializations */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span>Domain Specializations</span>
                  </label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Tag the event categories this organizer manages (e.g. Football events only, Music, etc.).
                  </p>
                </div>
                {specializations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSpecializations([])}
                    className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => {
                  const isSelected = specializations.includes(cat.slug);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleToggleSpecialization(cat.slug)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSpecInput}
                  onChange={(e) => setCustomSpecInput(e.target.value)}
                  onKeyDown={handleAddCustomSpecialization}
                  placeholder="Or type custom specialization & press Enter..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Section Permissions Matrix */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span>Section Access Levels</span>
                  </label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Configure read and write permissions for each console section.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => handlePermissionPreset("full")}
                    className="px-2 py-0.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Full Write
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePermissionPreset("read")}
                    className="px-2 py-0.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Read Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePermissionPreset("none")}
                    className="px-2 py-0.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                {ALL_SECTIONS.map((sec) => {
                  const currentLevel = permissions[sec.key];

                  return (
                    <div
                      key={sec.key}
                      className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">
                          {sec.label}
                        </p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {sec.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-200/60 dark:bg-zinc-800 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() =>
                            setPermissions((prev) => ({
                              ...prev,
                              [sec.key]: "none",
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentLevel === "none"
                              ? "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm"
                              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          }`}
                        >
                          None
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPermissions((prev) => ({
                              ...prev,
                              [sec.key]: "read",
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentLevel === "read"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          }`}
                        >
                          Read
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPermissions((prev) => ({
                              ...prev,
                              [sec.key]: "write",
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentLevel === "write"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          }`}
                        >
                          Write
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onClose}
                className="rounded-xl text-xs font-semibold h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-10 px-5 shadow-md shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Permissions"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
