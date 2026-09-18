export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  pic: string | null;
  small_description: string | null;
  icon: string | null;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  eventsCount: number;
  description: string;
  iconName: string;
  iconBg: string;
  iconColor?: string;
  image: string;
  slug: string;
  href: string;
  isPopular?: boolean;
  tags?: string[];
}

export interface PopularCategoryItem {
  id: string;
  name: string;
  eventsCount: number;
  iconName: string;
  iconBg: string;
  href: string;
}

/** Minimal category payload for Navbar (name, slug, icon only) */
export interface NavbarCategory {
  name: string;
  slug: string;
  icon: string | null;
}

/** Minimal category payload for Home Page (name, slug, icon only) */
export interface HomeCategory {
  name: string;
  slug: string;
  icon: string | null;
}

/** Category payload for Explore Categories page */
export interface ExploreCategory {
  id: string;
  name: string;
  slug: string;
  pic: string | null;
  icon: string | null;
  small_description: string | null;
  is_popular: boolean;
}

/** Minimal category payload for Popular categories row */
export interface PopularCategory {
  name: string;
  slug: string;
  icon: string | null;
}

/** Minimal pill item for categories and subcategories */
export interface CategoryPill {
  name: string;
  slug: string;
  icon: string | null;
}
