import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase client for unauthenticated, cookieless data fetching.
 * Specifically built for Next.js ISR, SSG, and unstable_cache data caching.
 *
 * Uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and never accesses cookies() or headers(),
 * ensuring Next.js static caching and unstable_cache operate without runtime errors.
 */
export function createPublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "placeholder-publishable-key";

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
