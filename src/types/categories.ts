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
