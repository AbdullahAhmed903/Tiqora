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
