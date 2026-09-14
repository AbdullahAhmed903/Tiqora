import sharp, { type Metadata } from "sharp";

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB (2,097,152 bytes)

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
] as const;

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  quality?: number;
}

export interface ProcessedImageResult {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
  originalFormat: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Validates and converts an input image buffer into optimized WebP format using Sharp.
 * Inspects real image metadata / magic bytes directly rather than relying on file extensions.
 */
export async function processAndConvertToWebP(
  inputBuffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
  const {
    maxWidth = 2560,
    maxHeight = 1440,
    minWidth = 200,
    minHeight = 200,
    quality = 85,
  } = options;

  // 1. Validate file size
  if (inputBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      `Image size exceeds the maximum allowed limit of 2MB (${(inputBuffer.length / (1024 * 1024)).toFixed(2)} MB uploaded).`
    );
  }

  // 2. Read metadata directly with Sharp to verify authentic image structure (magic bytes)
  let metadata: Metadata;
  try {
    const image = sharp(inputBuffer);
    metadata = await image.metadata();
  } catch {
    throw new Error("Invalid or corrupted image file. Please upload a valid image.");
  }

  const { format, width, height } = metadata;

  if (!format) {
    throw new Error("Unable to determine image format.");
  }

  // Verify format matches allowed image types
  const mimeMap: Record<string, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    avif: "image/avif",
  };
  const detectedMime = mimeMap[format] || `image/${format}`;
  const isAllowed = (ALLOWED_MIME_TYPES as readonly string[]).includes(detectedMime);
  if (!isAllowed) {
    throw new Error(
      `Unsupported image format (${format}). Allowed formats: JPEG, PNG, WebP, AVIF, SVG, GIF.`
    );
  }

  // 3. Validate image dimensions
  if (width && width < minWidth) {
    throw new Error(`Image width is too small. Minimum width is ${minWidth}px (uploaded: ${width}px).`);
  }
  if (height && height < minHeight) {
    throw new Error(`Image height is too small. Minimum height is ${minHeight}px (uploaded: ${height}px).`);
  }

  // 4. Optimize and convert to WebP
  let pipeline = sharp(inputBuffer);

  // Resize down proportionally if image exceeds maximum resolution
  if ((width && width > maxWidth) || (height && height > maxHeight)) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const webpBuffer = await pipeline
    .webp({
      quality,
      effort: 4,
    })
    .toBuffer();

  const finalMetadata = await sharp(webpBuffer).metadata();

  return {
    buffer: webpBuffer,
    contentType: "image/webp",
    extension: "webp",
    originalFormat: format,
    width: finalMetadata.width || width || 0,
    height: finalMetadata.height || height || 0,
    sizeBytes: webpBuffer.length,
  };
}

/**
 * Extracts the storage file path from a Supabase Storage public URL.
 * e.g., https://xyz.supabase.co/storage/v1/object/public/category-images/categories/football-123.webp
 * Returns: "categories/football-123.webp"
 */
export function extractStoragePathFromUrl(
  publicUrl: string,
  bucketName: string = "category-images"
): string | null {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const index = url.pathname.indexOf(marker);

    if (index !== -1) {
      return decodeURIComponent(url.pathname.substring(index + marker.length));
    }

    // Fallback: check if path contains bucketName/
    const altMarker = `/${bucketName}/`;
    const altIndex = url.pathname.indexOf(altMarker);
    if (altIndex !== -1) {
      return decodeURIComponent(url.pathname.substring(altIndex + altMarker.length));
    }

    return null;
  } catch {
    return null;
  }
}
