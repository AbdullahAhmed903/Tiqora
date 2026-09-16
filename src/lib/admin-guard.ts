import { createClient } from "@/lib/supabase/server";
import type { User, SupabaseClient } from "@supabase/supabase-js";

export interface AdminCallerContext {
  user: User;
  supabase: SupabaseClient;
}

/**
 * Shared helper to verify caller is authenticated and possesses the 'admin' role.
 * 1. Verifies session using secure supabase.auth.getUser()
 * 2. Fast-path: checks custom claims in JWT app_metadata (0 DB queries)
 * 3. Fallback: checks profiles table if token has not yet refreshed with claims
 * 
 * Throws an Error if unauthenticated or not an administrator.
 */
export async function verifyAdminCaller(): Promise<AdminCallerContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized. Please sign in as an administrator.");
  }

  // Fast path: Check custom claims in JWT app_metadata (0 DB queries)
  if (user.app_metadata?.role === "admin") {
    return { user, supabase };
  }

  // Fallback: Check profiles table if token has not yet refreshed with claims
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Forbidden: Administrator privileges required.");
  }

  return { user, supabase };
}
