import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { EventsExplorer } from "@/components/events/events-explorer";
import { getCategoryPills } from "@/lib/supabase/queries/categories";

export const metadata: Metadata = {
  title: "Events & Sports Explorer | Tiqora",
  description:
    "Discover and book verified tickets for premier football matches, basketball leagues, concerts, theater shows, and cultural festivals.",
};

interface EventsPageProps {
  searchParams: Promise<{ category?: string; [key: string]: string | undefined }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;

  // If a legacy or query URL like /events?category=sports is visited, redirect to the clean slug page /events/sports
  if (
    params.category &&
    params.category.toLowerCase() !== "all" &&
    params.category.toLowerCase() !== "events"
  ) {
    redirect(`/events/${params.category.toLowerCase()}`);
  }

  const pills = await getCategoryPills("all");

  return (
    <main className="min-h-screen pb-16 bg-[#080B12]">
      <Suspense
        fallback={
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
            <div className="w-full h-64 rounded-3xl bg-zinc-900/50" />
            <div className="flex gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-24 h-9 rounded-full bg-zinc-900/50" />
              ))}
            </div>
            <div className="flex gap-6">
              <div className="w-52 xl:w-56 h-96 rounded-2xl bg-zinc-900/50 hidden lg:block" />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl bg-zinc-900/50" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <EventsExplorer initialCategory="all" initialPills={pills} />
      </Suspense>
    </main>
  );
}
