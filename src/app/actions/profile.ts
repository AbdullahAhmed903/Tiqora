"use server";

import { createClient } from "@/lib/supabase/server";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "@/lib/validations/profile";
import {
  processAndConvertToWebP,
  extractStoragePathFromUrl,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/image-processing";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/types/auth";

// ------------------------------------------------------------------------------
// 1. Update Profile Info Action (Full Name, Phone, Date of Birth)
// ------------------------------------------------------------------------------
export async function updateProfileAction(input: UpdateProfileInput): Promise<{
  success: boolean;
  profile?: Profile;
  error?: string;
}> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid profile data.";
    return { success: false, error: firstError };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name?.trim() || null,
      phone_number: parsed.data.phone_number?.trim() || null,
      date_of_birth: parsed.data.date_of_birth?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (updateError) {
    return { success: false, error: updateError.message || "Failed to update profile." };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");

  return { success: true, profile: updatedProfile as Profile };
}

// ------------------------------------------------------------------------------
// 2. Upload Profile Avatar Action (Sharp WebP + Cleanup Old Avatar)
// ------------------------------------------------------------------------------
export async function uploadAvatarAction(formData: FormData): Promise<{
  success: boolean;
  avatarUrl?: string;
  error?: string;
}> {
  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "Please select an image file to upload." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      success: false,
      error: `Avatar image must be smaller than 2MB (${(file.size / (1024 * 1024)).toFixed(2)} MB provided).`,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
  }

  try {
    // 1. Convert to Buffer and process via Sharp to optimized WebP
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const processed = await processAndConvertToWebP(inputBuffer, {
      maxWidth: 512,
      maxHeight: 512,
      minWidth: 64,
      minHeight: 64,
      quality: 85,
    });

    // 2. Fetch current avatar URL to clean up old files from the 'avatars' bucket
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (currentProfile?.avatar_url) {
      const oldStoragePath = extractStoragePathFromUrl(
        currentProfile.avatar_url,
        "avatars"
      );
      if (oldStoragePath) {
        // Asynchronously remove previous avatar file from storage (no error thrown if not found)
        await supabase.storage.from("avatars").remove([oldStoragePath]);
      }
    }

    // 3. Upload new WebP avatar to user-scoped directory: avatars/{user_id}/avatar-{timestamp}.webp
    const fileName = `${user.id}/avatar-${Date.now()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, processed.buffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Failed to upload avatar: ${uploadError.message}`,
      };
    }

    // 4. Retrieve public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    // 5. Update user profile record and sync user_metadata
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileUpdateError) {
      return {
        success: false,
        error: `Failed to update profile avatar: ${profileUpdateError.message}`,
      };
    }

    // Sync to auth user_metadata for zero-query client/navbar access
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { success: true, avatarUrl: publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process and upload avatar.";
    return { success: false, error: message };
  }
}

// ------------------------------------------------------------------------------
// 3. Delete Profile Avatar Action (Removes file from bucket & resets DB)
// ------------------------------------------------------------------------------
export async function deleteAvatarAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (currentProfile?.avatar_url) {
    const storagePath = extractStoragePathFromUrl(
      currentProfile.avatar_url,
      "avatars"
    );
    if (storagePath) {
      await supabase.storage.from("avatars").remove([storagePath]);
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message || "Failed to remove avatar." };
  }

  // Sync to auth user_metadata
  await supabase.auth.updateUser({
    data: { avatar_url: null },
  });

  revalidatePath("/profile");
  revalidatePath("/", "layout");

  return { success: true };
}

// ------------------------------------------------------------------------------
// 4. Change Password Action (Email/Password users only)
// ------------------------------------------------------------------------------
export async function changePasswordAction(input: ChangePasswordInput): Promise<{
  success: boolean;
  error?: string;
}> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid password data.";
    return { success: false, error: firstError };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
  }

  // Security check: Google OAuth users cannot change password through this form
  const isGoogleUser =
    user.app_metadata?.provider === "google" ||
    user.identities?.some((id) => id.provider === "google");

  if (isGoogleUser) {
    return {
      success: false,
      error: "You are signed in with Google. Password management is handled by your Google account.",
    };
  }

  // 1. Verify current password by signing in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return { success: false, error: "Current password is incorrect. Please try again." };
  }

  // 2. Set new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message || "Failed to update password." };
  }

  return { success: true };
}
