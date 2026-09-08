import { CategorySection } from "@/components/home/category-section";
import { FeaturedEventsSection } from "@/components/home/featured-events-section";
import { FootballMatchesSection } from "@/components/home/football-matches-section";
import { RecentlyAddedSection } from "@/components/home/recently-added-section";

export const metadata = {
  title: "Events | Tiqora",
  description: "Browse and book tickets for football matches, concerts, theater, and festivals worldwide.",
};

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 sm:space-y-16">
      {/* Category Explorer */}
      <CategorySection />

      {/* Featured / Upcoming Events */}
      <FeaturedEventsSection />

      {/* Live & Upcoming Football Matches */}
      <FootballMatchesSection />

      {/* Recently Added Events */}
      <RecentlyAddedSection />
    </div>
  );
}
