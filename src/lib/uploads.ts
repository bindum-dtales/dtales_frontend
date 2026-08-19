/**
 * Unified upload functions for both images and DOCX files.
 * Used consistently across all admin editors (Blogs, Case Studies).
 */

import { ApiError, apiFetch } from './api';

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

  const data = await apiFetch<{ url?: string }>("/api/uploads/image", {
    method: "POST",
    headers: {},
    body: formData,
  });
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

  const data = await apiFetch<{ url?: string }>("/api/uploads/docx", {
    method: "POST",
    headers: {},
    body: formData,
  });
  if (!data?.url) {
    throw new Error("DOCX upload returned empty response");
  }
  return data.url as string;
}

/**
 * Shape returned by `POST /api/uploads/pdf`.
 */
export interface PdfUploadResult {
  /** Public URL of the stored PDF. */
  url: string;
  /** Text/HTML the backend extracted from the PDF. */
  content: string;
  attachmentType: string;
  attachmentTime: string;
  attachmentName: string;
}

/** Shown when the backend cannot read text out of the PDF. */
export const PDF_EXTRACTION_MESSAGE =
  "This PDF could not be read. Please upload a text-based PDF.";

/**
 * Upload a PDF file to the backend for storage and text extraction.
 *
 * Flow:
 *   1. Send the PDF to the backend (same auth/base URL as every other upload)
 *   2. Backend stores the file and extracts its content
 *   3. Backend returns the stored URL plus the extracted content
 *
 * @param file - PDF file to upload and extract
 * @returns The stored URL, extracted content and attachment metadata
 * @throws Error with a user-facing message on auth, extraction or network failure
 */
export async function uploadPdf(file: File): Promise<PdfUploadResult> {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);

  let data: Partial<PdfUploadResult> | null;
  try {
    data = await apiFetch<Partial<PdfUploadResult>>("/api/uploads/pdf", {
      method: "POST",
      // Empty headers so the browser sets the multipart boundary itself; the
      // Authorization header is still attached by the shared fetch wrapper.
      headers: {},
      body: formData,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.code === "PDF_EXTRACTION_FAILED") {
        throw new Error(PDF_EXTRACTION_MESSAGE);
      }
      if (err.code === "UNAUTHORIZED" || err.code === "FORBIDDEN") {
        throw new Error("Your session has expired. Please sign in again to upload files.");
      }
      throw new Error(err.message || "PDF upload failed");
    }

    const message = err instanceof Error ? err.message : "";
    if (/\b401\b|unauthor/i.test(message)) {
      throw new Error("Your session has expired. Please sign in again to upload files.");
    }
    if (/\b422\b/.test(message)) {
      throw new Error(PDF_EXTRACTION_MESSAGE);
    }
    throw err;
  }

  if (!data?.url) {
    throw new Error("PDF upload returned empty response");
  }
  if (!data.content?.trim()) {
    throw new Error(PDF_EXTRACTION_MESSAGE);
  }

  return {
    url: data.url,
    content: data.content,
    attachmentType: data.attachmentType || "pdf",
    attachmentTime: data.attachmentTime || "",
    attachmentName: data.attachmentName || file.name,
  };
}

/**
 * Upload a PDF article body through the shared document endpoint.
 *
 * The backend detects the `.pdf` extension on `POST /api/uploads/docx` and
 * delegates to its PDF rendering/storage pipeline, returning the same
 * `content` HTML the DOCX path produces. That is the endpoint the Blog and
 * Case Study editors use; Portfolio attachments keep using `uploadPdf` and
 * `POST /api/uploads/pdf`, which is a separate flow and is not touched here.
 *
 * @param file - PDF file to upload and extract
 * @returns The extracted HTML for the `content` field; never empty
 * @throws Error with a user-facing message on auth, extraction or network failure
 */
export async function uploadDocumentPdf(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);

  let data: Partial<PdfUploadResult> | null;
  try {
    data = await apiFetch<Partial<PdfUploadResult>>("/api/uploads/docx", {
      // Empty headers so the browser sets the multipart boundary itself; the
      // Authorization header is still attached by the shared fetch wrapper.
      method: "POST",
      headers: {},
      body: formData,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.code === "PDF_EXTRACTION_FAILED") {
        throw new Error(PDF_EXTRACTION_MESSAGE);
      }
      if (err.code === "UNAUTHORIZED" || err.code === "FORBIDDEN") {
        throw new Error("Your session has expired. Please sign in again to upload files.");
      }
      throw new Error(err.message || "PDF upload failed");
    }

    const message = err instanceof Error ? err.message : "";
    if (/\b401\b|unauthor/i.test(message)) {
      throw new Error("Your session has expired. Please sign in again to upload files.");
    }
    if (/\b422\b/.test(message)) {
      throw new Error(PDF_EXTRACTION_MESSAGE);
    }
    throw err;
  }

  // Only `content` is required: it is what gets stored. The stored file URL is
  // not part of the Blog / Case Study payload, so its absence is not an error.
  if (!data?.content?.trim()) {
    throw new Error(PDF_EXTRACTION_MESSAGE);
  }

  return data.content;
}
