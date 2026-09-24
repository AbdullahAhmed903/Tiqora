"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Calendar,
  Lock,
  Mail,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/profile";
import type { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/profile/custom-calendar";

interface ProfileInfoFormProps {
  profile: Profile;
  onProfileUpdate: (updated: Partial<Profile>) => void;
}

export function ProfileInfoForm({
  profile,
  onProfileUpdate,
}: ProfileInfoFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [dob, setDob] = useState(profile.date_of_birth || "");
  const [isSaving, setIsSaving] = useState(false);

  // Detect unsaved changes
  const hasChanges =
    fullName.trim() !== (profile.full_name || "") ||
    phoneNumber.trim() !== (profile.phone_number || "") ||
    dob.trim() !== (profile.date_of_birth || "");

  const handleReset = () => {
    setFullName(profile.full_name || "");
    setPhoneNumber(profile.phone_number || "");
    setDob(profile.date_of_birth || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving profile changes...");

    try {
      const res = await updateProfileAction({
        full_name: fullName,
        phone_number: phoneNumber,
        date_of_birth: dob,
      });

      if (res.success && res.profile) {
        onProfileUpdate(res.profile);
        toast.success("Profile details updated successfully!", { id: toastId });
      } else {
        toast.error(res.error || "Failed to update profile.", { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred while saving.", {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="full_name"
            className="text-xs font-bold text-zinc-300 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Full Name</span>
          </label>
          <input
            id="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. John Doe"
            maxLength={80}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
          <p className="text-[11px] text-zinc-500">
            Displayed on event tickets, reservations, and community views.
          </p>
        </div>

        {/* Username (Locked) */}
        <div className="space-y-1.5">
          <label
            htmlFor="username_locked"
            className="text-xs font-bold text-zinc-400 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Username</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">
              Unique handle
            </span>
          </label>
          <div className="relative">
            <input
              id="username_locked"
              type="text"
              value={`@${profile.username}`}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-sm text-zinc-400 font-mono cursor-not-allowed select-none"
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            Your unique identity across Tiqora. Cannot be altered directly.
          </p>
        </div>

        {/* Email Address (Locked & Verified) */}
        <div className="space-y-1.5">
          <label
            htmlFor="email_locked"
            className="text-xs font-bold text-zinc-400 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>Email Address</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </label>
          <input
            id="email_locked"
            type="email"
            value={profile.email || "No email on record"}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-sm text-zinc-400 cursor-not-allowed select-none"
          />
          <p className="text-[11px] text-zinc-500">
            Used for ticket confirmations, receipts, and account security.
          </p>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone_number"
            className="text-xs font-bold text-zinc-300 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Phone Number</span>
          </label>
          <input
            id="phone_number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 234 567 8900"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
          <p className="text-[11px] text-zinc-500">
            For critical event day alerts and SMS reminders (international format with +).
          </p>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5 md:col-span-2">
          <label
            htmlFor="date_of_birth"
            className="text-xs font-bold text-zinc-300 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Date of Birth</span>
          </label>
          <div className="w-full md:w-1/2">
            <CustomCalendar
              id="date_of_birth"
              value={dob}
              onChange={(newDate) => setDob(newDate)}
              placeholder="Select your date of birth"
              placement="top"
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            Required for age-restricted sports events, festivals, and VIP access.
          </p>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          {hasChanges && (
            <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              You have unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {hasChanges && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={handleReset}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800 cursor-pointer h-9 px-3.5 text-xs font-bold rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={!hasChanges || isSaving}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs h-9 px-5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
