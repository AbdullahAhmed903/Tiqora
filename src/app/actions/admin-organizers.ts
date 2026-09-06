"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createOrganizerSchema,
  updateOrganizerPermissionsSchema,
  type CreateOrganizerInput,
  type UpdateOrganizerPermissionsInput,
} from "@/lib/validations/auth";

type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Creates an organizer account with designated section permissions.
 * STRICTLY restricted to administrators.
 */
export async function createOrganizerAccount(
  input: CreateOrganizerInput
): Promise<ServerActionResult<{ userId: string }>> {
  try {
    // 1. Validate payload with Zod
    const validation = createOrganizerSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { email, temporary_password, username, full_name, permissions } = validation.data;

    // 2. Verify caller's identity and admin role
    const supabase = await createClient();
    const {
      data: { user: caller },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !caller) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const { data: callerProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (profileError || callerProfile?.role !== "admin") {
      return { success: false, error: "Forbidden: Only administrators can create organizers." };
    }

    // 3. Create auth user using Supabase Admin Auth API
    const adminClient = createAdminClient();

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
        error: createError?.message || "Failed to create organizer account in authentication service.",
      };
    }

    const newUserId = newUserData.user.id;

    // 4. Update the created profile to role 'organizer'
    const { error: updateRoleError } = await adminClient
      .from("profiles")
      .update({ role: "organizer" })
      .eq("id", newUserId);

    if (updateRoleError) {
      return {
        success: false,
        error: `Account created, but failed to elevate role: ${updateRoleError.message}`,
      };
    }

    // 5. Insert initial organizer section permissions
    if (permissions.length > 0) {
      const permissionRecords = permissions.map((p) => ({
        user_id: newUserId,
        section: p.section,
        access_level: p.access_level,
        granted_by: caller.id,
      }));

      const { error: permError } = await adminClient
        .from("organizer_permissions")
        .insert(permissionRecords);

      if (permError) {
        return {
          success: false,
          error: `Account created and promoted, but permission assignment failed: ${permError.message}`,
        };
      }
    }

    // 6. Record audit log
    await adminClient.from("admin_audit_logs").insert({
      admin_id: caller.id,
      target_user_id: newUserId,
      action: "create_organizer",
      metadata: {
        username,
        email,
        assigned_permissions: permissions,
      },
    });

    return { success: true, data: { userId: newUserId } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Updates permissions for an existing organizer.
 * STRICTLY restricted to administrators.
 */
export async function updateOrganizerPermissions(
  input: UpdateOrganizerPermissionsInput
): Promise<ServerActionResult<{ updatedCount: number }>> {
  try {
    const validation = updateOrganizerPermissionsSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { organizer_id, permissions } = validation.data;

    // 1. Verify caller is an admin
    const supabase = await createClient();
    const {
      data: { user: caller },
    } = await supabase.auth.getUser();

    if (!caller) {
      return { success: false, error: "Unauthorized." };
    }

    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (callerProfile?.role !== "admin") {
      return { success: false, error: "Forbidden: Only administrators can update permissions." };
    }

    const adminClient = createAdminClient();

    // 2. Wipe existing and insert new (or upsert)
    const { error: deleteError } = await adminClient
      .from("organizer_permissions")
      .delete()
      .eq("user_id", organizer_id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    if (permissions.length > 0) {
      const records = permissions.map((p) => ({
        user_id: organizer_id,
        section: p.section,
        access_level: p.access_level,
        granted_by: caller.id,
      }));

      const { error: insertError } = await adminClient
        .from("organizer_permissions")
        .insert(records);

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }

    // 3. Record audit log
    await adminClient.from("admin_audit_logs").insert({
      admin_id: caller.id,
      target_user_id: organizer_id,
      action: "update_organizer_permissions",
      metadata: {
        permissions,
      },
    });

    return { success: true, data: { updatedCount: permissions.length } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
