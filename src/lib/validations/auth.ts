import { z } from "zod";
import {
  USERNAME_REGEX,
  PHONE_REGEX,
  STRICT_EMAIL_REGEX,
  passwordSchema,
  phoneSchema,
  optionalPhoneSchema,
  fullNameSchema,
  optionalFullNameSchema,
  usernameSchema,
  emailSchema,
  strictEmailSchema,
} from "./shared";

// Re-export shared tokens for seamless backward compatibility
export {
  USERNAME_REGEX,
  PHONE_REGEX,
  STRICT_EMAIL_REGEX,
  passwordSchema,
  phoneSchema,
  optionalPhoneSchema,
  fullNameSchema,
  optionalFullNameSchema,
  usernameSchema,
  emailSchema,
  strictEmailSchema,
};

// ------------------------------------------------------------------------------
// Sign Up (Email & Password)
// Only email, password, and username are required at initial signup.
// ------------------------------------------------------------------------------
export const signUpWithEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export type SignUpWithEmailInput = z.infer<typeof signUpWithEmailSchema>;

// ------------------------------------------------------------------------------
// Sign In (Email or Username & Password)
// ------------------------------------------------------------------------------
export const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ------------------------------------------------------------------------------
// Admin Creating Organizer Account
// Admin creates organizer with email, temporary password, username, and assigned sections.
// ------------------------------------------------------------------------------
export const permissionSectionEnum = z.enum([
  "events",
  "venues",
  "tickets",
  "bookings",
  "coupons",
  "analytics",
  "support",
]);

export const accessLevelEnum = z.enum(["read", "write"]);

export const sectionPermissionAssignmentSchema = z.object({
  section: permissionSectionEnum,
  access_level: accessLevelEnum,
});

export const createOrganizerSchema = z.object({
  email: emailSchema,
  temporary_password: passwordSchema,
  username: usernameSchema,
  full_name: fullNameSchema.optional(),
  permissions: z.array(sectionPermissionAssignmentSchema).default([]),
});

export type CreateOrganizerInput = z.infer<typeof createOrganizerSchema>;

// ------------------------------------------------------------------------------
// Admin Updating Permissions for an Organizer
// ------------------------------------------------------------------------------
export const updateOrganizerPermissionsSchema = z.object({
  organizer_id: z.string().uuid("Invalid organizer ID"),
  permissions: z.array(sectionPermissionAssignmentSchema),
});

export type UpdateOrganizerPermissionsInput = z.infer<typeof updateOrganizerPermissionsSchema>;

// ------------------------------------------------------------------------------
// Forgot Password (Email only)
// ------------------------------------------------------------------------------
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ------------------------------------------------------------------------------
// Reset Password (Password and Repeat Password only)
// ------------------------------------------------------------------------------
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ------------------------------------------------------------------------------
// Admin Login (Email & Password only)
// ------------------------------------------------------------------------------
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
