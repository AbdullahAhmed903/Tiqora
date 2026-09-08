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

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    tag: "LIVE THE MOMENT. BOOK YOUR NEXT EXPERIENCE.",
    titleLine1: "BIGGER",
    titleLine2: "EVENTS",
    highlightWord: "CLOSER",
    titleLine3: "TO YOU",
    description:
      "From football matches to concerts, theater, festivals and more — all in one place.",
    image: "/hero/ChatGPT Image Sep 8, 2026, 03_29_09 PM.png",
  },
  {
    id: "slide-2",
    tag: "STADIUM EMOTIONS. UNMISSABLE MATCHES.",
    titleLine1: "FEEL THE",
    titleLine2: "STADIUM",
    highlightWord: "ENERGY",
    titleLine3: "LIVE",
    description:
      "Witness premier league, champions league, and international sports clashes live from top seats.",
    image: "/hero/ChatGPT Image Sep 8, 2026, 03_28_22 PM.png",
  },
  {
    id: "slide-3",
    tag: "WORLD CLASS MUSIC & ARENA TOURS.",
    titleLine1: "WORLD CLASS",
    titleLine2: "CONCERTS",
    highlightWord: "NEAR",
    titleLine3: "YOU",
    description:
      "Secure instant verified tickets for sold-out stadium concerts, festivals, and theatrical shows.",
    image: "/hero/ChatGPT Image Sep 8, 2026, 03_27_57 PM.png",
  },
  {
    id: "slide-4",
    tag: "THEATER & CULTURAL FESTIVALS.",
    titleLine1: "DISCOVER",
    titleLine2: "UNFORGETTABLE",
    highlightWord: "SHOWS",
    titleLine3: "TODAY",
    description:
      "Experience world-class drama, live orchestral performances, and spectacular festival events.",
    image: "/hero/ChatGPT Image Sep 8, 2026, 03_29_09 PM.png",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "sports",
    name: "Sports",
    subtitle: "Live Matches",
    iconName: "Trophy",
    href: "/events?category=sports",
  },
  {
    id: "concerts",
    name: "Concerts",
    subtitle: "Music Events",
    iconName: "Music",
    href: "/events?category=concerts",
  },
  {
    id: "theater",
    name: "Theater",
    subtitle: "Plays & Shows",
    iconName: "Theater",
    href: "/events?category=theater",
  },
  {
    id: "festivals",
    name: "Festivals",
    subtitle: "Cultural Events",
    iconName: "Sparkles",
    href: "/events?category=festivals",
  },
  {
    id: "gaming",
    name: "Gaming",
    subtitle: "Tournaments",
    iconName: "Gamepad2",
    href: "/events?category=gaming",
  },
  {
    id: "family",
    name: "Family",
    subtitle: "For Everyone",
    iconName: "Heart",
    href: "/events?category=family",
  },
  {
    id: "business",
    name: "Business",
    subtitle: "Conferences",
    iconName: "Briefcase",
    href: "/events?category=business",
  },
  {
    id: "more",
    name: "More",
    subtitle: "More Events",
    iconName: "Grid",
    href: "/events",
  },
];

export const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: "real-barca",
    month: "OCT",
    day: "26",
    category: "FOOTBALL",
    title: "Real Madrid vs Barcelona",
    location: "Santiago Bernabéu, Madrid",
    price: 49,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    href: "/events/real-madrid-vs-barcelona",
  },
  {
    id: "the-weeknd",
    month: "NOV",
    day: "12",
    category: "CONCERT",
    title: "The Weeknd – After Hours Tour",
    location: "Cairo International Stadium",
    price: 79,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    href: "/events/the-weeknd-after-hours",
  },
  {
    id: "soundstorm",
    month: "DEC",
    day: "05",
    category: "FESTIVAL",
    title: "Soundstorm 2025",
    location: "Riyadh, Saudi Arabia",
    price: 99,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    href: "/events/soundstorm-2025",
  },
  {
    id: "phantom-opera",
    month: "NOV",
    day: "18",
    category: "THEATER",
    title: "The Phantom of the Opera",
    location: "Cairo Opera House",
    price: 45,
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1200&auto=format&fit=crop",
    href: "/events/phantom-of-the-opera",
  },
];

export const FOOTBALL_MATCHES: FootballMatch[] = [
  {
    id: "liv-mufc",
    isLive: true,
    homeTeam: {
      name: "Liverpool",
      logo: "🔴",
    },
    awayTeam: {
      name: "Man United",
      logo: "🔴",
    },
    title: "Liverpool vs Man United",
    league: "Premier League",
    venue: "Anfield, Liverpool",
    href: "/events/liverpool-vs-man-united",
  },
  {
    id: "hilal-nassr",
    time: "Today 9:00 PM",
    homeTeam: {
      name: "Al Hilal",
      logo: "🔵",
    },
    awayTeam: {
      name: "Al Nassr",
      logo: "🟡",
    },
    title: "Al Hilal vs Al Nassr",
    league: "Saudi Pro League",
    venue: "Kingdom Arena",
    href: "/events/al-hilal-vs-al-nassr",
  },
  {
    id: "mci-ars",
    time: "Oct 20 10:00 PM",
    homeTeam: {
      name: "Man City",
      logo: "🩵",
    },
    awayTeam: {
      name: "Arsenal",
      logo: "🔴",
    },
    title: "Man City vs Arsenal",
    league: "Premier League",
    venue: "Etihad Stadium",
    href: "/events/man-city-vs-arsenal",
  },
  {
    id: "inter-acm",
    time: "Oct 20 10:00 PM",
    homeTeam: {
      name: "Inter Milan",
      logo: "🔵",
    },
    awayTeam: {
      name: "AC Milan",
      logo: "🔴",
    },
    title: "Inter Milan vs AC Milan",
    league: "Serie A",
    venue: "San Siro",
    href: "/events/inter-vs-ac-milan",
  },
  {
    id: "bayern-bvb",
    time: "Oct 22 9:45 PM",
    homeTeam: {
      name: "Bayern Munich",
      logo: "🔴",
    },
    awayTeam: {
      name: "Dortmund",
      logo: "🟡",
    },
    title: "Bayern Munich vs Dortmund",
    league: "Bundesliga",
    venue: "Allianz Arena",
    href: "/events/bayern-vs-dortmund",
  },
];

export const RECENTLY_ADDED: RecentlyAddedEvent[] = [
  {
    id: "coldplay-spheres",
    title: "Coldplay Music of the Spheres",
    category: "Concert",
    date: "Dec 15, 2025",
    location: "Cairo",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    href: "/events/coldplay-cairo",
  },
  {
    id: "nba-games",
    title: "NBA Global Games",
    category: "Sports",
    date: "Jan 10, 2026",
    location: "Abu Dhabi",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop",
    href: "/events/nba-global-games",
  },
  {
    id: "riyadh-season",
    title: "Riyadh Season Festival",
    category: "Festival",
    date: "Nov 28, 2025",
    location: "Riyadh",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop",
    href: "/events/riyadh-season",
  },
  {
    id: "harry-potter",
    title: "Harry Potter and the Cursed Child",
    category: "Theater",
    date: "Jan 5, 2026",
    location: "London",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=400&auto=format&fit=crop",
    href: "/events/harry-potter-cursed-child",
  },
  {
    id: "ufc-fight-night",
    title: "UFC Fight Night",
    category: "Sports",
    date: "Dec 2, 2025",
    location: "New York",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=400&auto=format&fit=crop",
    href: "/events/ufc-fight-night",
  },
];
