import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile/profile-view";
import type { Profile, ProfileStats } from "@/types/auth";

export const metadata: Metadata = {
  title: "Your Profile | Tiqora",
  description:
    "Manage your personal information, profile photo, and security credentials on Tiqora.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Authenticate user on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  // 2. Fetch profile from database
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Graceful fallback for accounts created before DB triggers or edge cases
  if (!profile) {
    const fallbackUsername =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      `user_${user.id.slice(0, 8)}`;

    const { data: createdProfile } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username: fallbackUsername,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          role: "user",
          status: "active",
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    profile = createdProfile;
  }

  // 3. Detect authentication provider (Google OAuth vs Email/Password)
  const isGoogleUser =
    user.app_metadata?.provider === "google" ||
    user.identities?.some((id) => id.provider === "google") ||
    false;

  // 4. Format profile stats
  const memberDate = profile?.created_at
    ? new Date(profile.created_at)
    : new Date();
  const memberSinceFormatted = memberDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // TODO: Replace favoritesCount with dynamic query from user_favorites once database persistence is active
  const stats: ProfileStats = {
    favoritesCount: 13,
    ticketsCount: 0,
    memberSinceFormatted,
  };

  return (
    <main className="min-h-screen pb-20 bg-[#080B12]">
      <ProfileView
        initialProfile={profile as Profile}
        stats={stats}
        isGoogleUser={isGoogleUser}
      />
    </main>
  );
}
