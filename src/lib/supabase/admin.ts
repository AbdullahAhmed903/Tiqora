import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin client initialized with the Secret Key (SUPABASE_SECRET_KEY).
 * STRICTLY for server-side use only (Server Actions, Route Handlers).
 * Never expose this client or the secret key to the browser!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) is not defined in your environment variables."
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
