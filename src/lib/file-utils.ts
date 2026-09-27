/**
 * Reusable client and isomorphic file handling utilities for Tiqora.
 * Aligned with server-side image processing constants without bundling Node native dependencies (sharp).
 */

// Image MIME types matching server-side ALLOWED_MIME_TYPES from image-processing.ts
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
] as const;

// Document MIME types for general file attachments
export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
] as const;

// Default size limits
export const DEFAULT_MAX_ATTACHMENT_SIZE_BYTES = 2 * 1024 * 1024; // 10 MB
export const DEFAULT_MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB (matches image-processing.ts)

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedMimeTypes?: readonly string[] | string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file against allowed size and MIME types.
 */
export function validateAttachmentFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSizeBytes = DEFAULT_MAX_ATTACHMENT_SIZE_BYTES,
    allowedMimeTypes = [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_DOCUMENT_MIME_TYPES],
  } = options;

  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  // 1. File size check
  if (file.size > maxSizeBytes) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const limitInMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File is too large (${sizeInMb} MB). Maximum allowed size is ${limitInMb} MB.`,
    };
  }

  // 2. MIME type check
  if (allowedMimeTypes.length > 0 && file.type) {
    const isAllowed = allowedMimeTypes.includes(file.type);
    if (!isAllowed) {
      return {
        valid: false,
        error: `Unsupported file format (${file.type || "unknown"}). Allowed formats: JPG, PNG, WebP, SVG, GIF, AVIF, or PDF.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Formats byte size into human readable string (e.g. 450 KB, 2.3 MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Determines if a file is an image based on MIME type or extension.
 */
export function isImageFile(file: File | string): boolean {
  if (typeof file === "string") {
    return /\.(jpe?g|png|webp|svg|gif|avif)$/i.test(file);
  }
  return file.type.startsWith("image/");
}

/**
 * Determines if a file is a PDF document based on MIME type or extension.
 */
export function isPdfFile(file: File | string): boolean {
  if (typeof file === "string") {
    return /\.pdf$/i.test(file);
  }
  return file.type === "application/pdf";
}

/**
 * Safely creates an Object URL preview for an image file.
 */
export function createFilePreview(file: File | null): string | null {
  if (!file || !isImageFile(file)) {
    return null;
  }
  try {
    return URL.createObjectURL(file);
  } catch {
    return null;
  }
}

/**
 * Safely revokes an Object URL preview to avoid browser memory leaks.
 */
export function revokeFilePreview(url: string | null): void {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore if already revoked
    }
  }
}
