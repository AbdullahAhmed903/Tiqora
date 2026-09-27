import { z } from "zod";

// ------------------------------------------------------------------------------
// Regular Expressions
// ------------------------------------------------------------------------------

/**
 * Username format: alphanumeric and underscore only, 3-30 chars
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * International phone number in E.164 format: optional leading '+', country code, and national number.
 * Allows between 7 and 15 digits total (e.g. +201012345678 or +1234567890).
 */
export const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

/**
 * Strict RFC-compliant regex for email validation (from newsletter validation):
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

// ------------------------------------------------------------------------------
// Core Shared Validation Tokens
// ------------------------------------------------------------------------------

/**
 * Strict RFC-compliant email schema (lowercased, trimmed, length-bounded, formatted).
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Email address is too short")
  .max(254, "Email address must not exceed 254 characters")
  .regex(STRICT_EMAIL_REGEX, "Please enter a valid email address (e.g. user@example.com)");

/**
 * Disposable email domain filter helper
 */
export const isDisposableEmail = (email: string): boolean => {
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(parts[1].toLowerCase());
};

/**
 * Enhanced email schema that forbids disposable/temporary email domains.
 */
export const strictEmailSchema = emailSchema.refine(
  (val) => !isDisposableEmail(val),
  "Temporary or disposable email addresses are not supported"
);

/**
 * Full name schema: trimmed, 2-80 characters.
 */
export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(80, "Full name cannot exceed 80 characters");

export const optionalFullNameSchema = fullNameSchema.optional().nullable().or(z.literal(""));

/**
 * Unified international phone number schema (E.164 format).
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, "Please enter a valid international phone number (e.g. +201012345678 or +1234567890)");

export const optionalPhoneSchema = phoneSchema.optional().nullable().or(z.literal(""));

/**
 * Username schema: trimmed, 3-30 characters, alphanumeric and underscore.
 */
export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must be at most 30 characters long")
  .regex(USERNAME_REGEX, "Username can only contain letters, numbers, and underscores");

/**
 * Password schema: minimum 8 characters, maximum 128 characters.
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password cannot exceed 128 characters");
