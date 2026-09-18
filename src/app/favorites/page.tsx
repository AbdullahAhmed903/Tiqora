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
              <div className="w-52 xl:w-56 h-72 rounded-2xl bg-zinc-900/50 hidden md:block flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="w-full h-10 rounded-full bg-zinc-900/50" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-zinc-900/50" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <FavoritesExplorer />
      </Suspense>
    </main>
  );
}
