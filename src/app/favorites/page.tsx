import { Suspense } from "react";
import { Metadata } from "next";
import { FavoritesExplorer } from "@/components/favorites/favorites-explorer";

export const metadata: Metadata = {
  title: "Your Favorites | Tiqora",
  description:
    "View and manage your saved sports matches, concerts, theater shows, and festival tickets on Tiqora.",
};

export default function FavoritesPage() {
  return (
    <main className="min-h-screen pb-16 bg-[#080B12]">
      <Suspense
        fallback={
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
            <div className="w-full h-32 rounded-2xl bg-zinc-900/50" />
            <div className="flex gap-6">
              <div className="w-52 h-64 rounded-2xl bg-zinc-900/50 hidden md:block" />
              <div className="flex-1 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-zinc-900/50" />
                ))}
              </div>
              <div className="w-64 h-80 rounded-2xl bg-zinc-900/50 hidden xl:block" />
            </div>
          </div>
        }
      >
        <FavoritesExplorer />
      </Suspense>
    </main>
  );
}
