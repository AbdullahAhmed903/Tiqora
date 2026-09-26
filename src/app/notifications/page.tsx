import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NotificationsView } from "@/components/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications & Alerts | Tiqora",
  description:
    "View and manage your real-time sports match countdowns, e-ticket digital gate passes, exclusive drops, and security updates on Tiqora.",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, we can optionally fetch user profile stats or counts
  let favoritesCount = 13;
  if (user) {
    const { count } = await supabase
      .from("user_favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (typeof count === "number") {
      favoritesCount = count;
    }
  }

  return (
    <main className="min-h-screen pb-20 bg-[#080B12]">
      <NotificationsView favoritesCount={favoritesCount} />
    </main>
  );
}
