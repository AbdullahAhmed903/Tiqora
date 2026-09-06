import { z } from "zod";

// Regular expressions
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // E.164 international format

// ------------------------------------------------------------------------------
// Sign Up (Email & Password)
// Only email, password, and username are required at initial signup.
// ------------------------------------------------------------------------------
export const signUpWithEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(USERNAME_REGEX, "Username can only contain letters, numbers, and underscores"),
});

export type SignUpWithEmailInput = z.infer<typeof signUpWithEmailSchema>;

// ------------------------------------------------------------------------------
// User Profile Update
// User fills in phone number, full name, and date of birth later in their profile.
// ------------------------------------------------------------------------------
export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(80).optional().nullable(),
  phone_number: z
    .string()
    .regex(PHONE_REGEX, "Please enter a valid phone number (e.g. +1234567890)")
    .optional()
    .nullable()
    .or(z.literal("")),
  date_of_birth: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Please provide a valid date in YYYY-MM-DD format",
    })
    .optional()
    .nullable(),
  avatar_url: z.string().url("Invalid avatar URL").optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

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
  email: z.string().email("Please provide a valid organizer email"),
  temporary_password: z.string().min(8, "Temporary password must be at least 8 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(USERNAME_REGEX, "Username can only contain letters, numbers, and underscores"),
  full_name: z.string().min(2, "Full name must be at least 2 characters").optional(),
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
