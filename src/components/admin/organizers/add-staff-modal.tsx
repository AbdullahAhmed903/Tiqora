"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  Mail,
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Briefcase,
  Check,
  Loader2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createStaffAccountAction } from "@/app/actions/admin-organizers";
import type { PermissionSection, AccessLevel } from "@/types/auth";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export function AddStaffModal({
  isOpen,
  onClose,
  onSuccess,
  availableCategories,
}: AddStaffModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"organizer" | "admin">("organizer");

  // Selected category slugs/names for specializations
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [customSpecInput, setCustomSpecInput] = useState("");

  // Section permissions: map from section -> 'none' | 'read' | 'write'
  const [sectionPermissions, setSectionPermissions] = useState<
    Record<PermissionSection, "none" | AccessLevel>
  >({
    events: "write",
    venues: "read",
    tickets: "write",
    bookings: "read",
    coupons: "none",
    analytics: "read",
    support: "none",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random strong dummy password
  const handleGeneratePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
    toast.info("Generated a secure dummy password.");
  };

  // Auto-suggest username from email or full name
  const handleSuggestUsername = () => {
    const base = fullName
      ? fullName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 16)
      : email
      ? email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 16)
      : "staff";
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setUsername(`${base}_${randomSuffix}`);
  };

  const handleToggleSpecialization = (slug: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleAddCustomSpecialization = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customSpecInput.trim()) {
      e.preventDefault();
      const val = customSpecInput.trim().toLowerCase();
      if (!selectedSpecializations.includes(val)) {
        setSelectedSpecializations((prev) => [...prev, val]);
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
    setSectionPermissions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter the staff member's full name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!username.trim() || username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    // Assemble assigned permissions (excluding 'none')
    const activePermissions = Object.entries(sectionPermissions)
      .filter(([, level]) => level !== "none")
      .map(([section, access_level]) => ({
        section: section as PermissionSection,
        access_level: access_level as AccessLevel,
      }));

    setIsSubmitting(true);
    const toastId = toast.loading("Creating staff account...");

    try {
      const res = await createStaffAccountAction({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        temporary_password: password,
        role,
        specializations: selectedSpecializations,
        permissions: role === "admin" ? [] : activePermissions,
      });

      if (res.success) {
        toast.success(`Account created for ${fullName} (${role})!`, { id: toastId });
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Failed to create account.", { id: toastId });
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
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isSubmitting ? undefined : onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
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
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Add New Staff Member
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Provision an administrator or organizer with designated access levels.
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Staff Role & Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === "organizer"
                      ? "bg-blue-50/60 dark:bg-blue-950/30 border-blue-500/80 ring-2 ring-blue-500/20"
                      : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <Briefcase className={`w-5 h-5 mt-0.5 ${role === "organizer" ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"}`} />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white block">
                      Organizer
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block leading-tight mt-0.5">
                      Scoped by event specializations & specific section permissions.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === "admin"
                      ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-500/80 ring-2 ring-purple-500/20"
                      : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <Shield className={`w-5 h-5 mt-0.5 ${role === "admin" ? "text-purple-600 dark:text-purple-400" : "text-zinc-400"}`} />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white block">
                      Administrator
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block leading-tight mt-0.5">
                      Full administrative authority across all sections & console features.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Full Legal Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Rashford"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Login Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="organizer@tiqora.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Username with generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-blue-500" />
                    <span>Username</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestUsername}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Suggest
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. marcus_events"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Dummy / Temporary Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Dummy Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Event Category Specializations */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span>Domain Specializations</span>
                  </label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Select the event categories this organizer specializes in (e.g. Football events only, Music, etc.).
                  </p>
                </div>
                {selectedSpecializations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSpecializations([])}
                    className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => {
                  const isSelected = selectedSpecializations.includes(cat.slug);
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

              {/* Custom specialization tag adder */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSpecInput}
                  onChange={(e) => setCustomSpecInput(e.target.value)}
                  onKeyDown={handleAddCustomSpecialization}
                  placeholder="Or type a custom specialization (e.g. esports) & press Enter..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Section Permissions Matrix (Active for Organizer) */}
            {role === "organizer" && (
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-500" />
                      <span>Section Permissions & Access Level</span>
                    </label>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Determine which administrative sections this organizer can access.
                    </p>
                  </div>

                  {/* Preset Buttons */}
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
                    const currentLevel = sectionPermissions[sec.key];

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

                        {/* 3-State Level Selector */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-200/60 dark:bg-zinc-800 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() =>
                              setSectionPermissions((prev) => ({
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
                              setSectionPermissions((prev) => ({
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
                              setSectionPermissions((prev) => ({
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
            )}

            {/* Actions */}
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
                    Creating Staff Member...
                  </>
                ) : (
                  `Create ${role === "admin" ? "Administrator" : "Organizer"}`
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
