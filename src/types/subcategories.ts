export interface SubcategoryRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  icon: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubcategoryWithCategory extends SubcategoryRow {
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  } | null;
}

export interface ParentCategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface SubcategoryStats {
  total: number;
  published: number;
  drafts: number;
}
