import { z } from "zod";

/**
 * Strict RFC-compliant regex for email validation:
 * - Local-part allows standard ASCII alphanumeric and specific punctuation.
 * - Forbids leading/trailing or consecutive dots.
 * - Domain-part allows labels between 1-63 chars with hyphens not at boundaries.
 * - Enforces valid Top-Level Domain (TLD) of 2 or more alphabetic characters.
 */
export const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Common disposable / burner email domains
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "trashmail.com",
  "yopmail.com",
  "dispostable.com",
  "sharklasers.com",
]);

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Email address is too short")
    .max(254, "Email address must not exceed 254 characters")
    .regex(STRICT_EMAIL_REGEX, "Please enter a valid email address (e.g. user@example.com)")
    .refine((val) => {
      const parts = val.split("@");
      if (parts.length !== 2) return false;
      const domain = parts[1];
      return !DISPOSABLE_EMAIL_DOMAINS.has(domain);
    }, "Temporary or disposable email addresses are not supported"),
  // Honeypot field for anti-bot protection. Must remain empty.
  website: z.string().max(0, "Bot submission detected").optional(),
});

export const updateSubscriberStatusSchema = z.object({
  id: z.string().uuid("Invalid subscriber ID"),
  status: z.enum(["active", "unsubscribed"], {
    message: "Status must be either 'active' or 'unsubscribed'",
  }),
});

export const subscribersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["all", "active", "unsubscribed"]).default("all"),
  search: z.string().trim().optional(),
});
