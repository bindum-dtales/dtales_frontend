/**
 * Unified upload functions for both images and DOCX files.
 * Used consistently across all admin editors (Blogs, Case Studies).
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://dtales-backend.onrender.com";

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
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/uploads/image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const data = await res.json();
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

  const res = await fetch(`${API_BASE_URL}/api/uploads/docx`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const data = await res.json();
  return data.html as string;
}
