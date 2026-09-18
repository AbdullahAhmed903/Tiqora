import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(60, "Slug must be at most 60 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric and hyphens (e.g. premier-league)",
    }),
  small_description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters")
    .optional()
    .nullable()
    .default(""),
  icon: z
    .string()
    .trim()
    .min(1, "Please choose an icon for this category"),
  is_popular: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const createCategorySchema = categorySchema;

export const updateCategorySchema = categorySchema.extend({
  id: z.string().uuid("Invalid category ID"),
  existingPicUrl: z.string().optional().nullable(),
});

export const reorderCategoriesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      display_order: z.number().int().min(0),
    })
  ),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;
