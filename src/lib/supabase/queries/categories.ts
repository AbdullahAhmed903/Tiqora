import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  NavbarCategory,
  HomeCategory,
  ExploreCategory,
  PopularCategory,
  CategoryPill,
} from "@/types/categories";

const CACHE_TAG = "categories";
const REVALIDATE_TIME = 86400; // 24 hours (long-lived cache; revalidated on-demand when admin updates)

/**
 * Fetches categories specifically for the global Navbar.
 * Cached via unstable_cache with tag 'categories'.
 */
export const getNavbarCategories = unstable_cache(
  async (): Promise<NavbarCategory[]> => {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("categories")
        .select("name, slug, icon")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("[getNavbarCategories] Error:", error.message);
        return [];
      }

      return (data as NavbarCategory[]) || [];
    } catch (err) {
      console.error("[getNavbarCategories] Unexpected error:", err);
      return [];
    }
  },
  ["navbar-categories"],
  { tags: [CACHE_TAG], revalidate: REVALIDATE_TIME }
);

/**
 * Fetches categories specifically for the Home Page "Browse by Category" section.
 * Reuses getNavbarCategories() (cached via unstable_cache) and slices the top 7.
 * Eliminates redundant Supabase HTTP requests completely.
 */
export async function getHomeCategories(): Promise<HomeCategory[]> {
  const allCategories = await getNavbarCategories();
  return allCategories.slice(0, 7);
}

/**
 * Fetches categories specifically for the Explore Categories page grid.
 * Cached via unstable_cache with tag 'categories'.
 */
export const getExploreCategories = unstable_cache(
  async (): Promise<ExploreCategory[]> => {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, pic, icon, small_description, is_popular")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("[getExploreCategories] Error:", error.message);
        return [];
      }

      return (data as ExploreCategory[]) || [];
    } catch (err) {
      console.error("[getExploreCategories] Unexpected error:", err);
      return [];
    }
  },
  ["explore-categories"],
  { tags: [CACHE_TAG], revalidate: REVALIDATE_TIME }
);

/**
 * Fetches popular categories specifically for the popular categories row.
 * Cached via unstable_cache with tag 'categories'.
 */
export const getPopularCategories = unstable_cache(
  async (): Promise<PopularCategory[]> => {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("categories")
        .select("name, slug, icon")
        .eq("is_active", true)
        .eq("is_popular", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("[getPopularCategories] Error:", error.message);
        return [];
      }

      return (data as PopularCategory[]) || [];
    } catch (err) {
      console.error("[getPopularCategories] Unexpected error:", err);
      return [];
    }
  },
  ["popular-categories"],
  { tags: [CACHE_TAG], revalidate: REVALIDATE_TIME }
);

/**
 * Fetches navigation pills for Events Explorer:
 * - When `categorySlug` is empty, "all", or "events": returns active categories (`name, slug, icon`).
 * - When `categorySlug` is specific (e.g. "sports", "family"): returns published subcategories (`name, slug, icon`).
 * Cached strictly per slug to prevent cross-category cache pollution.
 */
export async function getCategoryPills(
  categorySlug?: string
): Promise<CategoryPill[]> {
  const slug = categorySlug
    ? decodeURIComponent(categorySlug).toLowerCase().trim()
    : "all";

  return unstable_cache(
    async (): Promise<CategoryPill[]> => {
      try {
        const supabase = createPublicClient();

        if (!slug || slug === "all" || slug === "events") {
          const { data, error } = await supabase
            .from("categories")
            .select("name, slug, icon")
            .eq("is_active", true)
            .order("display_order", { ascending: true })
            .order("name", { ascending: true });

          if (error) {
            console.error("[getCategoryPills - all] Error:", error.message);
            return [];
          }

          return (data as CategoryPill[]) || [];
        }

        const { data, error } = await supabase
          .from("subcategories")
          .select("name, slug, icon, categories!inner(slug)")
          .eq("categories.slug", slug)
          .eq("is_published", true)
          .order("display_order", { ascending: true })
          .order("name", { ascending: true });

        if (error) {
          console.error(`[getCategoryPills - ${slug}] Error:`, error.message);
          return [];
        }

        return ((data as { name: string; slug: string; icon: string | null }[]) || []).map(
          (item) => ({
            name: item.name,
            slug: item.slug,
            icon: item.icon,
          })
        );
      } catch (err) {
        console.error(`[getCategoryPills - ${slug}] Unexpected error:`, err);
        return [];
      }
    },
    ["category-pills", slug],
    { tags: [CACHE_TAG, "subcategories"], revalidate: REVALIDATE_TIME }
  )();
}
