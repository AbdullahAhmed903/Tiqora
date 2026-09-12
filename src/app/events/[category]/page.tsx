import { Suspense } from "react";
import { Metadata } from "next";
import { EventsExplorer } from "@/components/events/events-explorer";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const capitalized =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return {
    title: `${capitalized} Events & Tickets | Tiqora`,
    description: `Explore and book verified tickets for top ${capitalized} events, matches, and performances on Tiqora.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

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
        <EventsExplorer initialCategory={category} />
      </Suspense>
    </main>
  );
}
