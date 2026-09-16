"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminCaller } from "@/lib/admin-guard";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
  type CreateSubcategoryInput,
  type UpdateSubcategoryInput,
} from "@/lib/validations/subcategory";
import type {
  SubcategoryRow,
  SubcategoryWithCategory,
  ParentCategoryOption,
  SubcategoryStats,
} from "@/types/subcategories";

interface RawSubcategoryRow extends SubcategoryRow {
  category:
    | { id: string; name: string; slug: string; icon: string | null }
    | { id: string; name: string; slug: string; icon: string | null }[]
    | null;
}

export type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Revalidates subcategory and category paths on demand.
 */
function triggerSubcategoryCacheRevalidation() {
  try {
    revalidatePath("/admin/subcategories");
    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/events");
    revalidatePath("/");
    revalidateTag("subcategories", "default");
    revalidateTag("categories", "default");
  } catch {
    // Non-critical if called outside request lifecycle
  }
}

/**
 * Fetches lightweight parent categories list for dropdown filter and modal selection.
 */
export async function getParentCategoriesAction(): Promise<
  ServerActionResult<ParentCategoryOption[]>
> {
  try {
    const { supabase } = await verifyAdminCaller();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, icon")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: (data as ParentCategoryOption[]) || [],
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to fetch parent categories";
    return { success: false, error: msg };
  }
}

/**
 * Fetches subcategories with parent category join, search, category filter, and 10-per-page pagination.
 */
export async function getSubcategoriesAction(params: {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  categoryId?: string;
}): Promise<
  ServerActionResult<{
    subcategories: SubcategoryWithCategory[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    stats: SubcategoryStats;
  }>
> {
  try {
    const { supabase } = await verifyAdminCaller();

    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize || 10;
    const query = params.searchQuery?.trim() || "";
    const categoryFilter = params.categoryId?.trim() || "";

    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;

    // First fetch global stats for the header
    let stats: SubcategoryStats = { total: 0, published: 0, drafts: 0 };
    try {
      const { data: allRows } = await supabase
        .from("subcategories")
        .select("is_published");

      if (allRows) {
        const total = allRows.length;
        const published = allRows.filter((r) => r.is_published).length;
        stats = {
          total,
          published,
          drafts: total - published,
        };
      }
    } catch {
      // Table may not exist yet or empty
    }

    let dbQuery = supabase
      .from("subcategories")
      .select(
        `
        id,
        category_id,
        name,
        slug,
        icon,
        is_published,
        display_order,
        created_at,
        updated_at,
        category:categories (
          id,
          name,
          slug,
          icon
        )
      `,
        { count: "exact" }
      );

    // Apply specific category filter if selected and not "all"
    if (categoryFilter && categoryFilter !== "all") {
      dbQuery = dbQuery.eq("category_id", categoryFilter);
    }

    // Apply Search Query across subcategory name, slug, or matching parent category names
    if (query) {
      // Lookup categories whose names match search query
      const { data: matchedCats } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", `%${query}%`);

      const matchedCatIds = (matchedCats || []).map((c) => c.id);

      if (matchedCatIds.length > 0) {
        dbQuery = dbQuery.or(
          `name.ilike.%${query}%,slug.ilike.%${query}%,category_id.in.(${matchedCatIds.join(
            ","
          )})`
        );
      } else {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,slug.ilike.%${query}%`);
      }
    }

    // Order: created_at descending
    dbQuery = dbQuery
      .order("created_at", { ascending: false })
      .range(fromIndex, toIndex);

    const { data, count, error } = await dbQuery;

    if (error) {
      return { success: false, error: error.message };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Format joined category object
    const rawRows = (data as unknown as RawSubcategoryRow[]) || [];
    const formattedData = rawRows.map((row) => ({
      ...row,
      category: Array.isArray(row.category) ? row.category[0] : row.category,
    })) as SubcategoryWithCategory[];

    return {
      success: true,
      data: {
        subcategories: formattedData,
        totalCount,
        currentPage: page,
        totalPages,
        stats,
      },
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to fetch subcategories";
    return { success: false, error: msg };
  }
}

/**
 * Creates a new subcategory.
 */
export async function createSubcategoryAction(
  input: CreateSubcategoryInput
): Promise<ServerActionResult<SubcategoryWithCategory>> {
  try {
    await verifyAdminCaller();

    const validation = createSubcategorySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      };
    }

    const adminClient = createAdminClient();

    // Check slug uniqueness under parent category
    const { data: existing } = await adminClient
      .from("subcategories")
      .select("id")
      .eq("category_id", validation.data.category_id)
      .ilike("slug", validation.data.slug)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error:
          "A subcategory with this slug already exists under the selected category.",
      };
    }

    const { data: inserted, error: insertError } = await adminClient
      .from("subcategories")
      .insert({
        category_id: validation.data.category_id,
        name: validation.data.name,
        slug: validation.data.slug,
        icon: validation.data.icon || "Tag",
        is_published: validation.data.is_published,
        display_order: validation.data.display_order,
      })
      .select(
        `
        id,
        category_id,
        name,
        slug,
        icon,
        is_published,
        display_order,
        created_at,
        updated_at,
        category:categories (
          id,
          name,
          slug,
          icon
        )
      `
      )
      .single();

    if (insertError) {
      return {
        success: false,
        error: `Database error: ${insertError.message}`,
      };
    }

    triggerSubcategoryCacheRevalidation();

    const result = {
      ...inserted,
      category: Array.isArray(inserted.category)
        ? inserted.category[0]
        : inserted.category,
    } as SubcategoryWithCategory;

    return { success: true, data: result };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to create subcategory";
    return { success: false, error: msg };
  }
}

/**
 * Updates an existing subcategory.
 */
export async function updateSubcategoryAction(
  input: UpdateSubcategoryInput
): Promise<ServerActionResult<SubcategoryWithCategory>> {
  try {
    await verifyAdminCaller();

    const validation = updateSubcategorySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      };
    }

    const adminClient = createAdminClient();

    // Check slug collision excluding current row
    const { data: existing } = await adminClient
      .from("subcategories")
      .select("id")
      .eq("category_id", validation.data.category_id)
      .ilike("slug", validation.data.slug)
      .neq("id", validation.data.id)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error:
          "A subcategory with this slug already exists under the selected category.",
      };
    }

    const { data: updated, error: updateError } = await adminClient
      .from("subcategories")
      .update({
        category_id: validation.data.category_id,
        name: validation.data.name,
        slug: validation.data.slug,
        icon: validation.data.icon || "Tag",
        is_published: validation.data.is_published,
        display_order: validation.data.display_order,
      })
      .eq("id", validation.data.id)
      .select(
        `
        id,
        category_id,
        name,
        slug,
        icon,
        is_published,
        display_order,
        created_at,
        updated_at,
        category:categories (
          id,
          name,
          slug,
          icon
        )
      `
      )
      .single();

    if (updateError) {
      return {
        success: false,
        error: `Database error: ${updateError.message}`,
      };
    }

    triggerSubcategoryCacheRevalidation();

    const result = {
      ...updated,
      category: Array.isArray(updated.category)
        ? updated.category[0]
        : updated.category,
    } as SubcategoryWithCategory;

    return { success: true, data: result };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to update subcategory";
    return { success: false, error: msg };
  }
}

/**
 * Deletes a subcategory safely with referential integrity guard.
 */
export async function deleteSubcategoryAction(
  subcategoryId: string
): Promise<ServerActionResult<{ deletedId: string }>> {
  try {
    await verifyAdminCaller();

    if (!subcategoryId) {
      return { success: false, error: "Subcategory ID is required" };
    }

    const adminClient = createAdminClient();

    // Referential Integrity Guard: Check if events reference this subcategory
    try {
      const { count, error: countError } = await adminClient
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("subcategory_id", subcategoryId);

      if (!countError && count && count > 0) {
        return {
          success: false,
          error: `Cannot delete subcategory: ${count} event(s) are currently assigned to it. Please reassign or delete these events first.`,
        };
      }
    } catch {
      // Events table may not have subcategory_id column yet, proceed
    }

    const { error: deleteError } = await adminClient
      .from("subcategories")
      .delete()
      .eq("id", subcategoryId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    triggerSubcategoryCacheRevalidation();

    return { success: true, data: { deletedId: subcategoryId } };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to delete subcategory";
    return { success: false, error: msg };
  }
}

/**
 * Instantly toggles is_published status with optimistic revalidation.
 */
export async function toggleSubcategoryPublishedAction(
  subcategoryId: string,
  currentState: boolean
): Promise<ServerActionResult<{ is_published: boolean }>> {
  try {
    await verifyAdminCaller();

    const adminClient = createAdminClient();
    const newState = !currentState;

    const { error } = await adminClient
      .from("subcategories")
      .update({ is_published: newState })
      .eq("id", subcategoryId);

    if (error) {
      return { success: false, error: error.message };
    }

    triggerSubcategoryCacheRevalidation();

    return { success: true, data: { is_published: newState } };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to toggle published status";
    return { success: false, error: msg };
  }
}
