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
