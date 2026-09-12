export interface Category {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  href: string;
}

export interface FeaturedEvent {
  id: string;
  month: string;
  day: string;
  category: string;
  title: string;
  location: string;
  price: number;
  image: string;
  href: string;
}

export interface FootballMatch {
  id: string;
  isLive?: boolean;
  time?: string;
  date?: string;
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
  title: string;
  league: string;
  venue: string;
  href: string;
}

export interface RecentlyAddedEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  highlightWord: string;
  titleLine3: string;
  description: string;
  image: string;
}

export interface CategoryEvent {
  id: string;
  title: string;
  category: "sports" | "concerts" | "theater" | "festivals" | "conferences" | "workshops" | "cultural" | "exhibitions" | "other" | string;
  subcategory: string;
  subcategoryLabel: string;
  date: string;
  time: string;
  fullDate: string; // ISO date format YYYY-MM-DD for accurate date filtering
  monthShort?: string; // e.g. "NOV"
  dayNumber?: string;  // e.g. "20"
  year?: string;       // e.g. "2025"
  venue: string;
  city: string;
  country: string;
  minPrice: number;
  maxPrice: number;
  priceFormatted: string; // e.g. "$25 - $150"
  image: string;
  slug: string;
  isPopular?: boolean;
}

export interface CategoryPillItem {
  id: string;
  label: string;
  iconName: string;
  subcategoryId: string;
}

export interface FilterState {
  date: "all" | "today" | "weekend" | "7days" | "30days";
  location: string;
  maxPrice: number;
  subcategory: string;
  sort: "featured" | "date" | "price-asc" | "price-desc" | "popular";
}

