/**
 * Unified upload functions for both images and DOCX files.
 * Used consistently across all admin editors (Blogs, Case Studies).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dtales-backend.onrender.com";

/**
 * Upload an image to Supabase Storage via the backend.
 *
 * @param file - Image file to upload
 * @returns URL of uploaded image, or null if upload fails
 * @throws Never throws; returns null on error (caller should check)
 */
export async function uploadImage(file: File): Promise<string | null> {
  if (!file) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/api/uploads/image`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type - browser will set it with multipart boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || errorData.error || "Failed to upload image";
      console.error("❌ Image upload failed:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Image uploaded successfully:", data.url);
    return data.url as string;
  } catch (err: any) {
    const errorMessage = err.message || "Failed to upload image";
    console.error("Image upload error:", errorMessage);
    throw new Error(errorMessage);
  }
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
export async function uploadDocx(file: File): Promise<string | null> {
  if (!file) {
    return null;
  }

  if (!file.name.endsWith(".docx")) {
    const error = "Only .docx files are allowed";
    console.error("❌ DOCX upload rejected:", error);
    throw new Error(error);
  }

  try {
    const formData = new FormData();
    formData.append("contentFile", file);

    const response = await fetch(`${API_BASE_URL}/api/uploads/docx`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type - browser will set it with multipart boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || errorData.error || "Failed to upload .docx file";
      console.error("❌ DOCX upload failed:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ DOCX parsed successfully");
    return data.html as string;
  } catch (err: any) {
    const errorMessage = err.message || "Failed to process .docx file";
    console.error("DOCX upload error:", errorMessage);
    throw new Error(errorMessage);
  }
}
