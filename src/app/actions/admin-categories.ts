"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminCaller } from "@/lib/admin-guard";
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from "@/lib/validations/category";
import {
  processAndConvertToWebP,
  extractStoragePathFromUrl,
} from "@/lib/image-processing";
import type { CategoryRow } from "@/types/categories";

export type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Revalidates all relevant category paths and tags on-demand.
 */
function triggerCategoryCacheRevalidation() {
  try {
    revalidatePath("/categories");
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidateTag("categories", "default");
  } catch {
    // Non-critical if called outside request scope
  }
}

/**
 * Fetches categories with server-side search, order, and 10-per-page pagination.
 */
export async function getCategoriesAction(params: {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}): Promise<
  ServerActionResult<{
    categories: CategoryRow[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>
> {
  try {
    const { supabase } = await verifyAdminCaller();

    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize || 10;
    const query = params.searchQuery?.trim() || "";

    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;

    let dbQuery = supabase
      .from("categories")
      .select("*", { count: "exact" });

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,slug.ilike.%${query}%`);
    }

    // Order by display_order ascending, then created_at descending
    dbQuery = dbQuery
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(fromIndex, toIndex);

    const { data, count, error } = await dbQuery;

    if (error) {
      return { success: false, error: error.message };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      success: true,
      data: {
        categories: (data as CategoryRow[]) || [],
        totalCount,
        currentPage: page,
        totalPages,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch categories";
    return { success: false, error: message };
  }
}

/**
 * Fetches a single category by ID for the edit page.
 */
export async function getCategoryByIdAction(
  id: string
): Promise<ServerActionResult<CategoryRow>> {
  try {
    const { supabase } = await verifyAdminCaller();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: data as CategoryRow };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch category";
    return { success: false, error: message };
  }
}

/**
 * Creates a new category with WebP image compression, storage upload, and DB insert.
 */
export async function createCategoryAction(
  formData: FormData
): Promise<ServerActionResult<CategoryRow>> {
  try {
    await verifyAdminCaller();

    // 1. Extract raw form fields
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      small_description: (formData.get("small_description") as string) || null,
      icon: formData.get("icon") as string,
      is_popular: formData.get("is_popular") === "true",
      is_active: formData.get("is_active") === "true",
      display_order: Number(formData.get("display_order") || 0),
    };

    // 2. Validate with Zod
    const validation = createCategorySchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      };
    }

    // 3. Process image file
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "Category cover picture is required" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Validate true MIME & dimensions and convert to WebP
    const processed = await processAndConvertToWebP(inputBuffer, {
      maxWidth: 2560,
      maxHeight: 1440,
      minWidth: 200,
      minHeight: 200,
      quality: 85,
    });

    // 4. Upload to Supabase Storage bucket 'category-images'
    const adminClient = createAdminClient();
    const storagePath = `categories/${validation.data.slug}-${Date.now()}.webp`;

    const { error: uploadError } = await adminClient.storage
      .from("category-images")
      .upload(storagePath, processed.buffer, {
        contentType: processed.contentType,
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Failed to upload category image: ${uploadError.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from("category-images").getPublicUrl(storagePath);

    // 5. Insert category row
    const { data: inserted, error: insertError } = await adminClient
      .from("categories")
      .insert({
        name: validation.data.name,
        slug: validation.data.slug,
        pic: publicUrl,
        small_description: validation.data.small_description || null,
        icon: validation.data.icon,
        is_popular: validation.data.is_popular,
        is_active: validation.data.is_active,
        display_order: validation.data.display_order,
      })
      .select()
      .single();

    if (insertError) {
      // Rollback uploaded image if insert fails
      await adminClient.storage.from("category-images").remove([storagePath]);
      return {
        success: false,
        error: `Database error: ${insertError.message}`,
      };
    }

    triggerCategoryCacheRevalidation();

    return { success: true, data: inserted as CategoryRow };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category";
    return { success: false, error: message };
  }
}

/**
 * Updates a category. If a new image is provided, compresses to WebP, uploads, and deletes the old image.
 */
export async function updateCategoryAction(
  formData: FormData
): Promise<ServerActionResult<CategoryRow>> {
  try {
    await verifyAdminCaller();

    const rawData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      small_description: (formData.get("small_description") as string) || null,
      icon: formData.get("icon") as string,
      is_popular: formData.get("is_popular") === "true",
      is_active: formData.get("is_active") === "true",
      display_order: Number(formData.get("display_order") || 0),
      existingPicUrl: (formData.get("existingPicUrl") as string) || null,
    };

    const validation = updateCategorySchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      };
    }

    const adminClient = createAdminClient();
    let finalPicUrl = validation.data.existingPicUrl || null;
    const file = formData.get("file") as File | null;

    // Handle new image upload if provided
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      const processed = await processAndConvertToWebP(inputBuffer, {
        maxWidth: 2560,
        maxHeight: 1440,
        minWidth: 200,
        minHeight: 200,
        quality: 85,
      });

      const newStoragePath = `categories/${validation.data.slug}-${Date.now()}.webp`;

      const { error: uploadError } = await adminClient.storage
        .from("category-images")
        .upload(newStoragePath, processed.buffer, {
          contentType: processed.contentType,
          upsert: true,
        });

      if (uploadError) {
        return {
          success: false,
          error: `Failed to upload new category image: ${uploadError.message}`,
        };
      }

      const {
        data: { publicUrl },
      } = adminClient.storage.from("category-images").getPublicUrl(newStoragePath);

      // Clean up old image from bucket if one existed
      if (validation.data.existingPicUrl) {
        const oldStoragePath = extractStoragePathFromUrl(
          validation.data.existingPicUrl,
          "category-images"
        );
        if (oldStoragePath) {
          await adminClient.storage
            .from("category-images")
            .remove([oldStoragePath]);
        }
      }

      finalPicUrl = publicUrl;
    }

    // Update database row
    const { data: updated, error: updateError } = await adminClient
      .from("categories")
      .update({
        name: validation.data.name,
        slug: validation.data.slug,
        pic: finalPicUrl,
        small_description: validation.data.small_description || null,
        icon: validation.data.icon,
        is_popular: validation.data.is_popular,
        is_active: validation.data.is_active,
        display_order: validation.data.display_order,
      })
      .eq("id", validation.data.id)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: `Database error: ${updateError.message}` };
    }

    triggerCategoryCacheRevalidation();

    return { success: true, data: updated as CategoryRow };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update category";
    return { success: false, error: message };
  }
}

/**
 * Deletes a category safely. Checks referential integrity first (blocked if events exist),
 * and deletes associated image from category-images bucket.
 */
export async function deleteCategoryAction(
  categoryId: string
): Promise<ServerActionResult<{ deletedId: string }>> {
  try {
    await verifyAdminCaller();

    if (!categoryId) {
      return { success: false, error: "Category ID is required" };
    }

    const adminClient = createAdminClient();

    // 1. Referential Integrity Guard: Check if events or dependent items exist
    try {
      const { count, error: countError } = await adminClient
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("category_id", categoryId);

      if (!countError && count && count > 0) {
        return {
          success: false,
          error: `Cannot delete category: ${count} event(s) are currently assigned to it. Please reassign or delete these events first.`,
        };
      }
    } catch {
      // If events table is not yet created in Supabase, proceed with category deletion
    }

    // 2. Fetch category to retrieve pic URL for storage deletion
    const { data: category } = await adminClient
      .from("categories")
      .select("pic")
      .eq("id", categoryId)
      .single();

    // 3. Delete category from database
    const { error: deleteError } = await adminClient
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // 4. Remove image from bucket if one existed
    if (category?.pic) {
      const storagePath = extractStoragePathFromUrl(category.pic, "category-images");
      if (storagePath) {
        await adminClient.storage.from("category-images").remove([storagePath]);
      }
    }

    triggerCategoryCacheRevalidation();

    return { success: true, data: { deletedId: categoryId } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete category";
    return { success: false, error: message };
  }
}

/**
 * Instantly toggles is_active status with on-demand cache revalidation.
 */
export async function toggleCategoryActiveAction(
  categoryId: string,
  currentState: boolean
): Promise<ServerActionResult<{ is_active: boolean }>> {
  try {
    await verifyAdminCaller();

    const adminClient = createAdminClient();
    const newState = !currentState;

    const { error } = await adminClient
      .from("categories")
      .update({ is_active: newState })
      .eq("id", categoryId);

    if (error) return { success: false, error: error.message };

    triggerCategoryCacheRevalidation();

    return { success: true, data: { is_active: newState } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle status";
    return { success: false, error: message };
  }
}

/**
 * Instantly toggles is_popular status with on-demand cache revalidation.
 */
export async function toggleCategoryPopularAction(
  categoryId: string,
  currentState: boolean
): Promise<ServerActionResult<{ is_popular: boolean }>> {
  try {
    await verifyAdminCaller();

    const adminClient = createAdminClient();
    const newState = !currentState;

    const { error } = await adminClient
      .from("categories")
      .update({ is_popular: newState })
      .eq("id", categoryId);

    if (error) return { success: false, error: error.message };

    triggerCategoryCacheRevalidation();

    return { success: true, data: { is_popular: newState } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle popularity";
    return { success: false, error: message };
  }
}

/**
 * Batch updates display_order for categories (drag-and-drop or arrow reordering).
 */
export async function reorderCategoriesAction(
  items: { id: string; display_order: number }[]
): Promise<ServerActionResult<{ updatedCount: number }>> {
  try {
    await verifyAdminCaller();

    const validation = reorderCategoriesSchema.safeParse({ items });
    if (!validation.success) {
      return { success: false, error: "Invalid reorder payload" };
    }

    const adminClient = createAdminClient();

    // Execute sequential or parallel updates
    await Promise.all(
      validation.data.items.map((item) =>
        adminClient
          .from("categories")
          .update({ display_order: item.display_order })
          .eq("id", item.id)
      )
    );

    triggerCategoryCacheRevalidation();

    return { success: true, data: { updatedCount: validation.data.items.length } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder categories";
    return { success: false, error: message };
  }
}
