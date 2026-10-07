"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Camera,
  Trash2,
  Loader2,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAvatarManager } from "@/hooks/use-avatar-manager";
import type { Profile, ProfileStats } from "@/types/auth";

interface ProfileHeaderProps {
  profile: Profile;
  stats: ProfileStats;
  onProfileUpdate: (updated: Partial<Profile>) => void;
}

export function ProfileHeader({
  profile,
  stats,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const {
    fileInputRef,
    isUploading,
    isDeleting,
    handleAvatarSelect,
    handleAvatarDelete: handleDeleteAvatar,
  } = useAvatarManager({
    currentAvatarUrl: profile.avatar_url,
    onAvatarChange: (newUrl) => onProfileUpdate({ avatar_url: newUrl }),
  });

  const copyUsername = () => {
    navigator.clipboard.writeText(`@${profile.username}`);
    setCopied(true);
    toast.success(`Copied @${profile.username} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = () => {
    if (profile.full_name?.trim()) {
      const parts = profile.full_name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return profile.username.slice(0, 2).toUpperCase();
  };

  const renderRoleBadge = () => {
    switch (profile.role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrator
          </span>
        );
      case "organizer":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            Event Organizer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#3B82F6]" />
            Community Member
          </span>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 p-6 sm:p-8 backdrop-blur-2xl shadow-sm dark:shadow-2xl">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
        {/* Avatar Container with Hover Upload */}
        <div className="flex flex-col items-center flex-shrink-0 gap-2.5">
          <div className="relative group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-zinc-200 dark:ring-zinc-800/80 group-hover:ring-[#2563EB] transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#2563EB] to-indigo-900 flex items-center justify-center shadow-md dark:shadow-2xl">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <span className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                  {getInitials()}
                </span>
              )}

              {/* Upload Overlay */}
              <label
                htmlFor="avatar-upload"
                className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isUploading ? "opacity-100" : ""
                }`}
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">
                      Change
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={isUploading}
              onChange={handleAvatarSelect}
            />

            {/* Quick Delete Avatar Button (Only when avatar exists) */}
            {profile.avatar_url && !isUploading && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={isDeleting}
                aria-label="Remove profile photo"
                title="Remove profile photo"
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/50 shadow-md transition-colors cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Dimension Guidance Helper */}
          <div className="flex flex-col items-center text-center max-w-[160px] space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Recommended:</span>
              <span className="text-blue-600 dark:text-[#3B82F6] font-bold">512×512</span>
            </span>
            <p className="text-[10px] text-zinc-500 leading-tight">
              Square (1:1) • Max 2MB<br />JPG, PNG, WebP or GIF
            </p>
          </div>
        </div>

        {/* User Profile Info & Metadata */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              {profile.full_name || profile.username}
            </h1>
            {renderRoleBadge()}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            {/* Username pill with copy button */}
            <button
              type="button"
              onClick={copyUsername}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800"
              title="Copy username"
            >
              <span>@{profile.username}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-zinc-500" />
              )}
            </button>

            {/* Email */}
            {profile.email && (
              <span className="text-zinc-600 dark:text-zinc-400">{profile.email}</span>
            )}

            {/* Member Since */}
            <span className="inline-flex items-center gap-1 text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              Member since {stats.memberSinceFormatted}
            </span>
          </div>

          {/* Quick Status Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Account Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
