import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedEventsSection } from "@/components/home/featured-events-section";
import { FootballMatchesSection } from "@/components/home/football-matches-section";
import { RecentlyAddedSection } from "@/components/home/recently-added-section";
import { BannerCtaSection } from "@/components/home/banner-cta-section";
import { AppPromoSection } from "@/components/home/app-promo-section";

export default function HomePage() {
  return (
    <div className="w-full py-4 sm:py-6 space-y-12 sm:space-y-16">
      {/* 1. Hero Carousel Section - Full Width with small margin left & right */}
      <div className="w-full px-2 sm:px-4 lg:px-6 max-w-[1920px] mx-auto">
        <HeroSection />
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 2. Explore by Category */}
        <CategorySection />

        {/* 3. Featured Hot Events Near You */}
        <FeaturedEventsSection />

        {/* 4. Live & Upcoming Football Matches */}
        <FootballMatchesSection />

        {/* 5. Recently Added Events */}
        <RecentlyAddedSection />

        {/* 6. Banner CTA with Platform Statistics */}
        <BannerCtaSection />

        {/* 7. Mobile App Promotional Highlight */}
        <AppPromoSection />
      </div>
    </div>
  );
}
