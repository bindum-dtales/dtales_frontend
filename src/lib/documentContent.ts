/**
 * Document -> HTML for the Blog and Case Study editors.
 *
 * Both editors store their article body in the existing `content` field as an
 * HTML string. This module is the single place that turns an uploaded file into
 * that string, so the two editors cannot drift apart:
 *
 *   DOCX -> `parseDocxToHtml` (client-side Mammoth), exactly as before.
 *   PDF  -> `uploadDocumentPdf`, the same existing `POST /api/uploads/docx`
 *           endpoint, which detects the `.pdf` extension server-side and runs
 *           its PDF rendering pipeline.
 *
 * Nothing else is accepted, and neither branch can return empty HTML: the DOCX
 * parser throws on an empty document and `uploadDocumentPdf` throws when the
 * backend extracts no text. That keeps an empty `content` out of the payload.
 */

import { parseDocxToHtml } from "./docxParser";
import { uploadDocumentPdf } from "./uploads";

/** `accept` value for the Blog / Case Study document pickers. */
export const DOCUMENT_ACCEPT =
  ".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";

/** Shown when a file is neither a DOCX nor a PDF. */
export const UNSUPPORTED_DOCUMENT_MESSAGE =
  "Unsupported file type. Please upload a DOCX or PDF file.";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function getExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Convert an uploaded article document into the HTML stored in `content`.
 *
 * @param file DOCX or PDF file chosen by the administrator.
 * @returns HTML for the `content` field; never empty.
 * @throws Error with a user-facing message for unsupported or unreadable files.
 */
export async function parseDocumentToHtml(file: File): Promise<string> {
  const extension = getExtension(file.name);

  // Extension first, MIME as the fallback: browsers and operating systems are
  // inconsistent about the type they report for Office documents.
  if (extension === "docx" || file.type === DOCX_MIME) {
    return parseDocxToHtml(file);
  }

  if (extension === "pdf" || file.type === "application/pdf") {
    return uploadDocumentPdf(file);
  }

  throw new Error(UNSUPPORTED_DOCUMENT_MESSAGE);
}
