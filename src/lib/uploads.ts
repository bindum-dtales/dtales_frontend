/**
 * Unified upload functions for both images and DOCX files.
 * Used consistently across all admin editors (Blogs, Case Studies).
 */

import { apiUpload } from './api';

/**
 * Upload an image to Supabase Storage via the backend.
 *
 * @param file - Image file to upload
 * @returns URL of uploaded image, or null if upload fails
 * @throws Never throws; returns null on error (caller should check)
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("image", file);

  const data = await apiUpload<{ url?: string }>("uploads/image", formData);
  if (!data?.url) {
    throw new Error("Image upload returned empty response");
  }
  return data.url as string;
}

/**
 * Upload a DOCX file to the backend for parsing.
 *
 * Flow:
 *   1. Send DOCX file to backend
 *   2. Backend parses DOCX → HTML using Mammoth
 *   3. Backend uploads embedded images to Supabase Storage
 *   4. Backend returns clean HTML with Supabase public URLs
 *
 * @param file - DOCX file to upload and parse
 * @returns HTML content from DOCX, or null if upload/parsing fails
 * @throws Never throws; returns null on error (caller should check)
 */
export async function uploadDocx(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);

  const data = await apiUpload<{ url?: string }>("uploads/docx", formData);
  if (!data?.url) {
    throw new Error("DOCX upload returned empty response");
  }
  return data.url as string;
}
