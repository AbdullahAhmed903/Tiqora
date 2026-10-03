import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
  fullNameSchema,
  permissionSectionEnum,
  accessLevelEnum,
  sectionPermissionAssignmentSchema,
  createOrganizerSchema,
  updateOrganizerPermissionsSchema,
  type CreateOrganizerInput,
  type UpdateOrganizerPermissionsInput,
} from "./auth";

export {
  permissionSectionEnum,
  accessLevelEnum,
  sectionPermissionAssignmentSchema,
  createOrganizerSchema,
  updateOrganizerPermissionsSchema,
  type CreateOrganizerInput,
  type UpdateOrganizerPermissionsInput,
};

export const staffRoleEnum = z.enum(["admin", "organizer"]);
export const allRolesEnum = z.enum(["admin", "organizer", "user"]);
export const staffStatusEnum = z.enum(["active", "suspended"]);

export const createStaffAccountSchema = z.object({
  full_name: fullNameSchema,
  email: emailSchema,
  username: usernameSchema,
  temporary_password: passwordSchema,
  role: staffRoleEnum,
  specializations: z.array(z.string().min(1)).default([]),
  permissions: z.array(sectionPermissionAssignmentSchema).default([]),
});

export type CreateStaffAccountInput = z.infer<typeof createStaffAccountSchema>;

export const updateStaffRoleSchema = z.object({
  target_user_id: z.string().uuid("Invalid staff user ID"),
  new_role: allRolesEnum,
});

export type UpdateStaffRoleInput = z.infer<typeof updateStaffRoleSchema>;

export const toggleStaffStatusSchema = z.object({
  target_user_id: z.string().uuid("Invalid staff user ID"),
  new_status: staffStatusEnum,
});

export type ToggleStaffStatusInput = z.infer<typeof toggleStaffStatusSchema>;

export const updateStaffPermissionsSchema = z.object({
  target_user_id: z.string().uuid("Invalid staff user ID"),
  specializations: z.array(z.string().min(1)).default([]),
  permissions: z.array(sectionPermissionAssignmentSchema).default([]),
});

export type UpdateStaffPermissionsInput = z.infer<typeof updateStaffPermissionsSchema>;
