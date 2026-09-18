import { z } from "zod";

export const subcategorySchema = z.object({
  category_id: z
    .string()
    .uuid("Please select a valid parent category"),
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
  icon: z.string().trim().optional().nullable().default("Tag"),
  is_published: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const createSubcategorySchema = subcategorySchema;

export const updateSubcategorySchema = subcategorySchema.extend({
  id: z.string().uuid("Invalid subcategory ID"),
});

export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
