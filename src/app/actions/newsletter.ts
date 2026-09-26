"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimiter, getClientIp } from "@/lib/rate-limit";
import {
  newsletterSubscribeSchema,
  updateSubscriberStatusSchema,
  subscribersQuerySchema,
} from "@/lib/validations/newsletter";
import {
  NewsletterStatus,
  NewsletterSubscriptionResult,
  GetSubscribersParams,
  PaginatedSubscribersResult,
} from "@/types/newsletter";

/**
 * Public Server Action: Subscribes an email to the newsletter.
 * Enforces honeypot check, Zod validation, dual-tier rate limiting, and idempotent duplicate handling.
 */
export async function subscribeNewsletterAction(
  input: { email: string; website?: string }
): Promise<NewsletterSubscriptionResult> {
  try {
    // 1. Honeypot Anti-Bot Filter
    if (input.website && input.website.trim().length > 0) {
      // Silently return success to bot without consuming DB resources
      return {
        success: true,
        message: "Thank you for subscribing to Tiqora newsletter!",
        code: "SUCCESS",
      };
    }

    // 2. Strict Zod Validation
    const validationResult = newsletterSubscribeSchema.safeParse(input);
    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message || "Please provide a valid email address";
      return {
        success: false,
        message: firstError,
        code: "INVALID_INPUT",
      };
    }

    const { email: normalizedEmail } = validationResult.data;

    // 3. Resolve Client IP & Dual-Tier Rate Limiting
    const headersList = await headers();
    const clientIp = getClientIp(headersList);

    // Tier 1: Per-IP Limit (Max 3 submissions per 10 minutes)
    const ipLimit = rateLimiter.check(
      `newsletter:ip:${clientIp}`,
      3,
      10 * 60 * 1000
    );
    if (!ipLimit.allowed) {
      return {
        success: false,
        message: "Too many subscription requests. Please wait a few minutes before trying again.",
        code: "RATE_LIMITED",
      };
    }

    // Tier 2: Global Endpoint Guard (Max 60 submissions per minute site-wide)
    const globalLimit = rateLimiter.check(
      "newsletter:global:subscribe",
      60,
      60 * 1000
    );
    if (!globalLimit.allowed) {
      return {
        success: false,
        message: "Our newsletter service is experiencing heavy traffic. Please try again shortly.",
        code: "RATE_LIMITED",
      };
    }

    // 4. Supabase Client & Idempotency / Duplicate Check
    const supabase = await createClient();

    // Check if email already exists
    const { data: existing, error: selectError } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Newsletter query error:", selectError);
    }

    if (existing) {
      if (existing.status === "active") {
        return {
          success: true,
          message: "You're already subscribed to Tiqora newsletter!",
          code: "ALREADY_SUBSCRIBED",
        };
      } else {
        // Reactivate previously unsubscribed contact
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({
            status: "active",
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Reactivation error:", updateError);
          return {
            success: false,
            message: "Unable to update subscription. Please try again.",
            code: "ERROR",
          };
        }

        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          code: "REACTIVATED",
        };
      }
    }

    // 5. Insert New Subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        status: "active",
        source: "footer",
      });

    if (insertError) {
      // Race condition check for unique constraint violation (PostgreSQL error 23505)
      if (insertError.code === "23505") {
        return {
          success: true,
          message: "You're already subscribed to Tiqora newsletter!",
          code: "ALREADY_SUBSCRIBED",
        };
      }

      console.error("Newsletter insert error:", insertError);
      return {
        success: false,
        message: "Failed to process subscription. Please try again.",
        code: "ERROR",
      };
    }

    return {
      success: true,
      message: "Thank you for subscribing to Tiqora newsletter!",
      code: "SUCCESS",
    };
  } catch (error) {
    console.error("subscribeNewsletterAction unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      code: "ERROR",
    };
  }
}

/**
 * Helper to authenticate and assert that the current user has the admin role.
 */
async function assertAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please sign in to access admin resources");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Administrator privileges required");
  }

  return { supabase, user };
}

/**
 * Admin Action: Fetch paginated newsletter subscribers with optional status filter and search.
 */
export async function getNewsletterSubscribersAction(
  rawParams: GetSubscribersParams = {}
): Promise<{ success: boolean; data?: PaginatedSubscribersResult; error?: string }> {
  try {
    const { supabase } = await assertAdminUser();

    const parseResult = subscribersQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message };
    }

    const { page, limit, status, search } = parseResult.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search && search.trim().length > 0) {
      query = query.ilike("email", `%${search.trim()}%`);
    }

    query = query
      .order("subscribed_at", { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("getNewsletterSubscribersAction error:", error);
      return { success: false, error: error.message };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        subscribers: data || [],
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load subscribers";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Update a subscriber's status (e.g. active <-> unsubscribed).
 */
export async function updateNewsletterSubscriberStatusAction(
  id: string,
  newStatus: NewsletterStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await assertAdminUser();

    const parseResult = updateSubscriberStatusSchema.safeParse({ id, status: newStatus });
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message };
    }

    const updatePayload: {
      status: NewsletterStatus;
      unsubscribed_at?: string | null;
      subscribed_at?: string;
    } = {
      status: newStatus,
    };

    if (newStatus === "unsubscribed") {
      updatePayload.unsubscribed_at = new Date().toISOString();
    } else {
      updatePayload.unsubscribed_at = null;
      updatePayload.subscribed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("updateNewsletterSubscriberStatusAction error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update subscriber";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Delete a subscriber record permanently.
 */
export async function deleteNewsletterSubscriberAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await assertAdminUser();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteNewsletterSubscriberAction error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete subscriber";
    return { success: false, error: message };
  }
}
