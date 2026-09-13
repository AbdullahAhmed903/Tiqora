import { Suspense } from "react";
import { Metadata } from "next";
import { CategoriesExplorer } from "@/components/categories/categories-explorer";

export const metadata: Metadata = {
  title: "All Categories | Tiqora",
  description:
    "Explore and browse all event categories on Tiqora — from thrilling sports matches and concerts to theater, festivals, conferences, and workshops.",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pb-16 bg-[#080B12]">
      <Suspense
        fallback={
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-12">
            <div className="w-full h-96 rounded-3xl bg-zinc-900/50" />
            <div className="space-y-4">
              <div className="w-48 h-8 rounded-full bg-zinc-900/50" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl bg-zinc-900/50" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <CategoriesExplorer />
      </Suspense>
    </main>
  );
}
