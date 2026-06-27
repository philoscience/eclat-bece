/**
 * Image validation and compression utilities for quiz question images.
 *
 * - validateImageFile: Rejects files > 3 MB or non-image MIME types.
 * - compressImage: Uses Canvas API to resize and compress to < 1 MB WebP.
 */

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_DIMENSION = 1200; // px – scale down if either axis exceeds this

/**
 * Validates an image file before processing.
 * @returns Error message string, or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Image must be under 3 MB";
  }
  return null;
}

/**
 * Compresses an image file to under `maxSizeKB` using the Canvas API.
 * Always outputs WebP format for consistency and optimal compression.
 */
export async function compressImage(
  file: File,
  maxSizeKB = 950
): Promise<File> {
  // If the file is already small enough and is webp, return as-is
  if (file.size <= maxSizeKB * 1024 && file.type === "image/webp") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Scale down if either dimension exceeds MAX_DIMENSION
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try progressively lower quality until under maxSizeKB
  let quality = 0.85;
  const QUALITY_FLOOR = 0.5;
  const QUALITY_STEP = 0.05;

  while (quality >= QUALITY_FLOOR) {
    const blob = await canvas.convertToBlob({ type: "image/webp", quality });

    if (blob.size <= maxSizeKB * 1024 || quality <= QUALITY_FLOOR) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      return new File([blob], `${baseName}.webp`, { type: "image/webp" });
    }

    quality -= QUALITY_STEP;
  }

  // Fallback – return at floor quality
  const finalBlob = await canvas.convertToBlob({
    type: "image/webp",
    quality: QUALITY_FLOOR,
  });
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([finalBlob], `${baseName}.webp`, { type: "image/webp" });
}
