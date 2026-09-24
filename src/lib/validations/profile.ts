import { z } from "zod";
import { fullNameSchema, passwordSchema, phoneSchema } from "./auth";

// ------------------------------------------------------------------------------
// Profile Information Update Schema
// ------------------------------------------------------------------------------
export const updateProfileSchema = z.object({
  full_name: fullNameSchema.optional().nullable().or(z.literal("")),
  phone_number: phoneSchema.optional().nullable().or(z.literal("")),
  date_of_birth: z
    .string()
    .trim()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Please provide a valid date in YYYY-MM-DD format",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ------------------------------------------------------------------------------
// Change Password Schema (Email/Password users only)
// ------------------------------------------------------------------------------
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
