import { z } from "zod";
import {
  STRICT_EMAIL_REGEX,
  DISPOSABLE_EMAIL_DOMAINS,
  strictEmailSchema,
} from "./shared";

// Re-export for backward compatibility
export { STRICT_EMAIL_REGEX, DISPOSABLE_EMAIL_DOMAINS };

export const newsletterSubscribeSchema = z.object({
  email: strictEmailSchema,
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
