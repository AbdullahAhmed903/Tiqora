"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Camera,
  Trash2,
  Loader2,
  CheckCircle2,
  Shield,
  Briefcase,
  Tag,
  KeyRound,
  RotateCcw,
  Save,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/profile/custom-calendar";
import { updateProfileAction } from "@/app/actions/profile";
import { useAvatarManager } from "@/hooks/use-avatar-manager";
import type { Profile, OrganizerPermission } from "@/types/auth";

interface AdminProfileViewProps {
  initialProfile: Profile;
  permissions: OrganizerPermission[];
  specializations: string[];
  grantedByUser?: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
}

export function AdminProfileView({
  initialProfile,
  permissions,
  specializations,
  grantedByUser,
}: AdminProfileViewProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  // Editable fields state
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [dob, setDob] = useState(profile.date_of_birth || "");
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    fullName.trim() !== (profile.full_name || "") ||
    phoneNumber.trim() !== (profile.phone_number || "") ||
    dob.trim() !== (profile.date_of_birth || "");

  const handleReset = () => {
    setFullName(profile.full_name || "");
    setPhoneNumber(profile.phone_number || "");
    setDob(profile.date_of_birth || "");
  };

  // Avatar management with shared validation & delete confirmation
  const {
    fileInputRef,
    isUploading: isUploadingAvatar,
    isDeleting: isDeletingAvatar,
    handleAvatarSelect,
    handleAvatarDelete,
  } = useAvatarManager({
    currentAvatarUrl: profile.avatar_url,
    onAvatarChange: (newUrl) =>
      setProfile((prev) => ({ ...prev, avatar_url: newUrl })),
  });

  // Profile Save Handler
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
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim() || undefined,
        date_of_birth: dob.trim() || undefined,
      });

      if (res.success && res.profile) {
        setProfile(res.profile);
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        toast.error(res.error || "Failed to update profile.", { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred saving changes.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = profile.role === "admin";
  const isOrganizer = profile.role === "organizer";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleAvatarSelect}
        className="hidden"
      />

      {/* Staff Hero Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center font-bold text-2xl text-zinc-600 dark:text-zinc-300">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username}
                  fill
                  className="object-cover"
                  sizes="112px"
                  priority
                />
              ) : (
                <span>{(profile.full_name || profile.username).slice(0, 2).toUpperCase()}</span>
              )}

              {/* Uploading Overlay */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>

            {/* Change Photo Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              title="Change profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Remove Photo Button */}
            {profile.avatar_url && (
              <button
                type="button"
                onClick={handleAvatarDelete}
                disabled={isDeletingAvatar}
                className="absolute -top-2 -right-2 p-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User Bio and Badges */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {profile.full_name || profile.username}
              </h2>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                {/* Role Badge */}
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                    <Shield className="w-3.5 h-3.5 text-purple-500" />
                    Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    Organizer
                  </span>
                )}

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    profile.status === "active"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                      : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      profile.status === "active" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span className="capitalize">{profile.status}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-mono">@{profile.username}</p>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Registered staff member since{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Personal Information Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>Personal Information</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Modify your legal name, contact telephone, and date of birth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name (Editable) */}
            <div className="space-y-1.5">
              <label
                htmlFor="staff_fullname"
                className="text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                Full Name
              </label>
              <input
                id="staff_fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full legal name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone Number (Editable) */}
            <div className="space-y-1.5">
              <label
                htmlFor="staff_phone"
                className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>Contact Phone</span>
              </label>
              <input
                id="staff_phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Date of Birth (Editable with CustomCalendar) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="staff_dob"
                className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Date of Birth</span>
              </label>
              <div className="w-full sm:w-1/2">
                <CustomCalendar
                  id="staff_dob"
                  value={dob}
                  onChange={(d) => setDob(d)}
                  placeholder="Select birth date"
                  placement="top"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
            {hasChanges ? (
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                You have unsaved changes
              </span>
            ) : (
              <span className="text-xs text-zinc-400">All changes saved</span>
            )}

            <div className="flex items-center gap-2.5">
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={handleReset}
                  className="rounded-xl text-xs h-9 px-3.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset
                </Button>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={!hasChanges || isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-9 px-5 shadow-md shadow-blue-600/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save Details
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Read-Only System Credentials & Governance Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            <span>System & Governance Details</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            The following fields are strictly managed by system administrators and authentication policies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email (Locked) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {profile.email || "No email on record"}
            </p>
            <p className="text-[11px] text-zinc-400">
              Managed by authentication service.
            </p>
          </div>

          {/* Role (Locked) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Shield className="w-3.5 h-3.5" />
                System Role
              </span>
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                {profile.role}
              </span>
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
              {profile.role === "admin" ? "Platform Administrator" : "Event Organizer"}
            </p>
            <p className="text-[11px] text-zinc-400">
              {profile.role === "admin"
                ? "Full unrestricted privileges across Tiqora."
                : "Role-scoped organizer permissions."}
            </p>
          </div>

          {/* Specializations (Locked Badges) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Tag className="w-3.5 h-3.5" />
                Event Specializations
              </span>
              <span className="text-[10px] text-zinc-400">Configured by Admin</span>
            </div>
            <div className="pt-1">
              {isAdmin ? (
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Global Authority (All Categories)
                </p>
              ) : specializations.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 capitalize border border-blue-200/60 dark:border-blue-800/40"
                    >
                      <Tag className="w-3 h-3 text-blue-500" />
                      {spec} Events
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  No specific categories designated.
                </p>
              )}
            </div>
          </div>

          {/* Account Status (Locked) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-bold">Account Moderation Status</span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                  profile.status === "active" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {profile.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Account status is governed by security policies and administrator compliance rules.
            </p>
          </div>
        </div>

        {/* Assigned Section Permissions Breakdown (For Organizers) */}
        {isOrganizer && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                <span>Assigned Console Permissions</span>
              </h4>
              {grantedByUser && (
                <span className="text-[11px] text-zinc-400">
                  Approved by {grantedByUser.full_name || grantedByUser.email}
                </span>
              )}
            </div>

            {permissions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 capitalize">
                      {perm.section}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        perm.access_level === "write"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {perm.access_level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>No section permissions currently assigned. Contact an administrator.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
