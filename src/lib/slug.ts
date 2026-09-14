/**
 * Shared utility for generating and sanitizing URL slugs.
 * Converts any string into a clean, lowercased, kebab-case slug
 * conforming to: ^[a-z0-9]+(?:-[a-z0-9]+)*$
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Normalize unicode characters (e.g. accents)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace non-alphanumeric characters (including spaces and symbols) with single hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Validates whether a slug matches the kebab-case database pattern.
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
