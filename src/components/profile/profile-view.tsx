"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, Activity, Layers } from "lucide-react";
import { UserSidebar } from "@/components/layout/user-sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfoForm } from "@/components/profile/profile-info-form";
import { ProfileSecurityCard } from "@/components/profile/profile-security-card";
import { ProfileActivityCard } from "@/components/profile/profile-activity-card";
import type { Profile, ProfileStats } from "@/types/auth";

interface ProfileViewProps {
  initialProfile: Profile;
  stats: ProfileStats;
  isGoogleUser: boolean;
}

type TabKey = "info" | "security" | "activity";

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabItem[] = [
  {
    key: "info",
    label: "Personal Info",
    icon: User,
    description: "Manage your legal name, contact telephone, and identity details.",
  },
  {
    key: "security",
    label: "Security & Access",
    icon: ShieldCheck,
    description: "Account authentication provider and password credentials.",
  },
  {
    key: "activity",
    label: "Activity",
    icon: Activity,
    description: "Quick shortcuts to your events, favorites, and tickets.",
  },
];

export function ProfileView({
  initialProfile,
  stats,
  isGoogleUser,
}: ProfileViewProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [activeTab, setActiveTab] = useState<TabKey>("info");

  const handleProfileUpdate = (updated: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const activeTabMeta = TABS.find((t) => t.key === activeTab);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 2-Column Layout matching Favorites: Sidebar (Sticky) | Main Profile Area */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Sidebar: Sticky (scrolls with user) on desktop & Mobile horizontal pills on mobile */}
        <aside className="w-full md:w-52 xl:w-56 flex-shrink-0 md:sticky md:top-24">
          <UserSidebar favoritesCount={stats.favoritesCount} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Profile Hero Header */}
          <ProfileHeader
            profile={profile}
            stats={stats}
            onProfileUpdate={handleProfileUpdate}
          />

          {/* Main Content Card with Animated Tabs */}
          <div className="rounded-3xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-xl shadow-sm dark:shadow-2xl">
            {/* Tab Selection Bar */}
            <div className="border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-8 pt-4 pb-0 bg-zinc-50 dark:bg-zinc-900/30 rounded-t-3xl">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex items-center gap-2.5 px-4 py-3.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer select-none ${
                        isActive
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-[#2563EB] dark:text-[#3B82F6]" : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      />
                      <span>{tab.label}</span>

                      {/* Active Indicator Underline */}
                      {isActive && (
                        <motion.div
                          layoutId="profileTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] shadow-[0_0_12px_#2563EB]"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Header Banner */}
            {activeTabMeta && (
              <div className="px-6 sm:px-8 pt-6 pb-2 border-b border-zinc-200 dark:border-zinc-800/40">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>{activeTabMeta.label}</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {activeTabMeta.description}
                </p>
              </div>
            )}

            {/* Tab Content Panel */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                >
                  {activeTab === "info" && (
                    <ProfileInfoForm
                      profile={profile}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  )}

                  {activeTab === "security" && (
                    <ProfileSecurityCard
                      isGoogleUser={isGoogleUser}
                      userEmail={profile.email}
                    />
                  )}

                  {activeTab === "activity" && (
                    <ProfileActivityCard profile={profile} stats={stats} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
