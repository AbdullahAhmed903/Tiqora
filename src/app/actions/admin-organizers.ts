"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminCaller } from "@/lib/admin-guard";
import {
  createStaffAccountSchema,
  updateStaffRoleSchema,
  toggleStaffStatusSchema,
  updateStaffPermissionsSchema,
  type CreateStaffAccountInput,
  type UpdateStaffRoleInput,
  type ToggleStaffStatusInput,
  type UpdateStaffPermissionsInput,
  type CreateOrganizerInput,
  type UpdateOrganizerPermissionsInput,
} from "@/lib/validations/staff";
import type { StaffMemberRow, OrganizerPermission, Profile } from "@/types/auth";

export type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Fetches staff members (Admins and Organizers) with server-side pagination,
 * filters (role, status), search query, permissions, and specializations.
 */
export async function getStaffMembersAction(params: {
  page?: number;
  pageSize?: number;
  role?: "all" | "admin" | "organizer";
  status?: "all" | "active" | "suspended";
  searchQuery?: string;
}): Promise<
  ServerActionResult<{
    staff: StaffMemberRow[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>
> {
  try {
    const { supabase } = await verifyAdminCaller();

    const page = Math.max(1, params.page || 1);
    const pageSize = Math.max(1, Math.min(50, params.pageSize || 10));
    const roleFilter = params.role || "all";
    const statusFilter = params.status || "all";
    const query = params.searchQuery?.trim() || "";

    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;

    // 1. Base query on profiles for staff members (admin or organizer)
    let dbQuery = supabase
      .from("profiles")
      .select("*", { count: "exact" });

    // Role filtering
    if (roleFilter === "admin") {
      dbQuery = dbQuery.eq("role", "admin");
    } else if (roleFilter === "organizer") {
      dbQuery = dbQuery.eq("role", "organizer");
    } else {
      dbQuery = dbQuery.in("role", ["admin", "organizer"]);
    }

    // Status filtering
    if (statusFilter !== "all") {
      dbQuery = dbQuery.eq("status", statusFilter);
    }

    // Keyword search across full_name, email, and username
    if (query) {
      dbQuery = dbQuery.or(
        `full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`
      );
    }

    // Chronological order & range pagination
    dbQuery = dbQuery
      .order("created_at", { ascending: false })
      .range(fromIndex, toIndex);

    const { data: profiles, count, error: profileError } = await dbQuery;

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    if (!profiles || profiles.length === 0) {
      return {
        success: true,
        data: {
          staff: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 1,
        },
      };
    }

    const userIds = profiles.map((p) => p.id);

    // 2. Fetch permissions & specializations from organizer_permissions
    const { data: permissionsData, error: permError } = await supabase
      .from("organizer_permissions")
      .select(`
        *,
        granted_by_user:profiles!granted_by(id, full_name, email)
      `)
      .in("user_id", userIds);

    if (permError) {
      return { success: false, error: permError.message };
    }

    // Map permissions by user_id
    const permissionsByUser: Record<string, OrganizerPermission[]> = {};
    const specializationsByUser: Record<string, Set<string>> = {};
    const grantedByUserMap: Record<
      string,
      { id: string; full_name: string | null; email: string | null }
    > = {};

    for (const p of permissionsData || []) {
      if (!permissionsByUser[p.user_id]) {
        permissionsByUser[p.user_id] = [];
      }
      permissionsByUser[p.user_id].push({
        id: p.id,
        user_id: p.user_id,
        section: p.section,
        access_level: p.access_level,
        specializations: Array.isArray(p.specializations) ? p.specializations : [],
        granted_by: p.granted_by,
        created_at: p.created_at,
        updated_at: p.updated_at,
      });

      // Collect specializations
      if (!specializationsByUser[p.user_id]) {
        specializationsByUser[p.user_id] = new Set<string>();
      }
      if (Array.isArray(p.specializations)) {
        p.specializations.forEach((s: string) => {
          if (s) specializationsByUser[p.user_id].add(s);
        });
      }

      // Track who granted it
      if (p.granted_by_user && !grantedByUserMap[p.user_id]) {
        grantedByUserMap[p.user_id] = p.granted_by_user;
      }
    }

    // 3. Assemble composite StaffMemberRow array
    const staffMembers: StaffMemberRow[] = profiles.map((prof: Profile) => {
      const userPerms = permissionsByUser[prof.id] || [];
      const userSpecs = specializationsByUser[prof.id]
        ? Array.from(specializationsByUser[prof.id])
        : [];

      return {
        ...prof,
        permissions: userPerms,
        specializations: userSpecs,
        granted_by_user: grantedByUserMap[prof.id] || null,
      };
    });

    return {
      success: true,
      data: {
        staff: staffMembers,
        totalCount,
        currentPage: page,
        totalPages,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load staff members.";
    return { success: false, error: message };
  }
}

/**
 * Creates an Admin or Organizer account with assigned specializations and section access.
 * STRICTLY restricted to administrators.
 */
export async function createStaffAccountAction(
  input: CreateStaffAccountInput
): Promise<ServerActionResult<{ userId: string }>> {
  try {
    const validation = createStaffAccountSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const {
      email,
      temporary_password,
      username,
      full_name,
      role,
      specializations,
      permissions,
    } = validation.data;

    // 1. Verify caller is an active administrator
    const { user: caller } = await verifyAdminCaller();

    // 2. Initialize Supabase Admin client
    const adminClient = createAdminClient();

    // 3. Create the auth user in Supabase GoTrue Auth
    const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: temporary_password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name: full_name || null,
      },
    });

    if (createError || !newUserData.user) {
      return {
        success: false,
        error: createError?.message || "Failed to create account in authentication service.",
      };
    }

    const newUserId = newUserData.user.id;

    // 4. Update the created profile role
    const { error: updateRoleError } = await adminClient
      .from("profiles")
      .update({
        role,
        full_name: full_name || null,
        username,
        email,
      })
      .eq("id", newUserId);

    if (updateRoleError) {
      return {
        success: false,
        error: `Account created, but failed to set role: ${updateRoleError.message}`,
      };
    }

    // 5. If role is organizer, insert designated section permissions with specializations
    if (permissions.length > 0) {
      const permissionRecords = permissions.map((p) => ({
        user_id: newUserId,
        section: p.section,
        access_level: p.access_level,
        specializations: specializations,
        granted_by: caller.id,
      }));

      const { error: permError } = await adminClient
        .from("organizer_permissions")
        .insert(permissionRecords);

      if (permError) {
        return {
          success: false,
          error: `Account created, but permission assignment failed: ${permError.message}`,
        };
      }
    }

    // 6. Record audit log
    await adminClient.from("admin_audit_logs").insert({
      admin_id: caller.id,
      target_user_id: newUserId,
      action: "CREATE_STAFF_ACCOUNT",
      metadata: {
        username,
        email,
        role,
        specializations,
        permissions_count: permissions.length,
      },
    });

    revalidatePath("/admin/organizers");
    return { success: true, data: { userId: newUserId } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Toggles a staff member's account status (active <-> suspended).
 * Includes self-lockout protection so an admin cannot suspend themselves.
 */
export async function toggleStaffStatusAction(
  input: ToggleStaffStatusInput
): Promise<ServerActionResult<{ status: string }>> {
  try {
    const validation = toggleStaffStatusSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { target_user_id, new_status } = validation.data;
    const { user: caller } = await verifyAdminCaller();

    // Guardrail: Cannot suspend own account
    if (target_user_id === caller.id && new_status === "suspended") {
      return {
        success: false,
        error: "Security restriction: You cannot suspend your own administrator account.",
      };
    }

    const adminClient = createAdminClient();

    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ status: new_status, updated_at: new Date().toISOString() })
      .eq("id", target_user_id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Audit log
    await adminClient.from("admin_audit_logs").insert({
      admin_id: caller.id,
      target_user_id,
      action: new_status === "suspended" ? "SUSPEND_STAFF_ACCOUNT" : "ACTIVATE_STAFF_ACCOUNT",
      metadata: { new_status },
    });

    revalidatePath("/admin/organizers");
    return { success: true, data: { status: new_status } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update account status.";
    return { success: false, error: message };
  }
}

/**
 * Promotes or demotes a staff member's role (admin <-> organizer <-> user).
 * Includes self-demotion protection and clean permission revocation when demoting to user.
 */
export async function updateStaffRoleAction(
  input: UpdateStaffRoleInput
): Promise<ServerActionResult<{ role: string }>> {
  try {
    const validation = updateStaffRoleSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { target_user_id, new_role } = validation.data;
    const { user: caller } = await verifyAdminCaller();

    // Guardrail: Cannot demote own account
    if (target_user_id === caller.id && new_role !== "admin") {
      return {
        success: false,
        error: "Security restriction: You cannot demote your own administrator account.",
      };
    }

    const adminClient = createAdminClient();

    // Fetch previous role for audit
    const { data: previousProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", target_user_id)
      .single();

    // Update profile role
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ role: new_role, updated_at: new Date().toISOString() })
      .eq("id", target_user_id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // If demoting to regular user, wipe all organizer_permissions
    if (new_role === "user") {
      await adminClient
        .from("organizer_permissions")
        .delete()
        .eq("user_id", target_user_id);
    }

    // Audit log
    await adminClient.from("admin_audit_logs").insert({
      admin_id: caller.id,
      target_user_id,
      action: "UPDATE_STAFF_ROLE",
      metadata: {
        previous_role: previousProfile?.role || null,
        new_role,
      },
    });

    revalidatePath("/admin/organizers");
    return { success: true, data: { role: new_role } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update staff role.";
    return { success: false, error: message };
  }
}

/**
 * Updates an organizer's section permissions and event specializations.
 */
export async function updateStaffPermissionsAction(
  input: UpdateStaffPermissionsInput
): Promise<ServerActionResult<{ updatedCount: number }>> {
  try {
    const validation = updateStaffPermissionsSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { target_user_id, specializations, permissions } = validation.data;
    const { user: caller } = await verifyAdminCaller();

    const adminClient = createAdminClient();

    // 1. Wipe existing permissions for this user
    const { error: deleteError } = await adminClient
      .from("organizer_permissions")
      .delete()
      .eq("user_id", target_user_id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // 2. Insert new permissions with assigned specializations
    if (permissions.length > 0) {
      const records = permissions.map((p) => ({
        user_id: target_user_id,
        section: p.section,
        access_level: p.access_level,
        specializations,
        granted_by: caller.id,
      }));

      const { error: insertError } = await adminClient
        .from("organizer_permissions")
        .insert(records);

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }

    // 3. Audit log
    await adminClient.from("admin_audit_logs").insert({
      admin_id: caller.id,
      target_user_id,
      action: "UPDATE_STAFF_PERMISSIONS",
      metadata: {
        specializations,
        permissions,
      },
    });

    revalidatePath("/admin/organizers");
    return { success: true, data: { updatedCount: permissions.length } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update permissions.";
    return { success: false, error: message };
  }
}

/**
 * Helper to fetch active categories for the specialization multi-select dropdown.
 */
export async function getActiveCategoriesForStaffAction(): Promise<
  ServerActionResult<Array<{ id: string; name: string; slug: string; icon: string | null }>>
> {
  try {
    const { supabase } = await verifyAdminCaller();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, icon")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load categories.";
    return { success: false, error: message };
  }
}

// ------------------------------------------------------------------------------
// Backward Compatibility Wrappers
// ------------------------------------------------------------------------------

export async function createOrganizerAccount(
  input: CreateOrganizerInput
): Promise<ServerActionResult<{ userId: string }>> {
  return createStaffAccountAction({
    ...input,
    role: "organizer",
    specializations: [],
    full_name: input.full_name || "",
  });
}

export async function updateOrganizerPermissions(
  input: UpdateOrganizerPermissionsInput
): Promise<ServerActionResult<{ updatedCount: number }>> {
  return updateStaffPermissionsAction({
    target_user_id: input.organizer_id,
    specializations: [],
    permissions: input.permissions,
  });
}
