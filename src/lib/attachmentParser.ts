/**
 * Attachment type detection and preview helpers.
 *
 * Extends the original DOCX-only attachment flow to support the broader
 * set of formats accepted by the Portfolio attachment picker (documents,
 * spreadsheets, and images), without duplicating any existing parsing logic.
 */

import { marked } from "marked";
import { parseDocxToHtml } from "./docxParser";
import { uploadPdf } from "./uploads";

export type AttachmentType =
  | "document"
  | "image"
  | "pdf"
  | "spreadsheet"
  | "markdown"
  | "text";

export type PreviewType = "html" | "image" | "file";

export interface AttachmentPreview {
  attachmentType: AttachmentType;
  previewType: PreviewType;
  previewContent: string | null;
  fileName: string;
  /** Stored file URL, returned by server-side uploads (PDF). */
  url?: string;
  /** Upload timestamp, returned by server-side uploads (PDF). */
  attachmentTime?: string;
  /** Original file name, returned by server-side uploads (PDF). */
  attachmentName?: string;
}

const EXTENSIONS: Record<AttachmentType, string[]> = {
  document: ["docx", "rtf", "odt"],
  spreadsheet: ["csv", "xls", "xlsx", "ods"],
  pdf: ["pdf"],
  markdown: ["md"],
  text: ["txt"],
  image: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tif", "tiff"],
};

function getExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Determine the attachment category for a given file based on its extension.
 */
export function detectAttachmentType(file: File): AttachmentType {
  const ext = getExtension(file.name);
  for (const [type, extensions] of Object.entries(EXTENSIONS) as [
    AttachmentType,
    string[]
  ][]) {
    if (extensions.includes(ext)) {
      return type;
    }
  }
  // Fall back to MIME type if the extension wasn't recognized
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  return "document";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Convert plain text into paragraph HTML, escaping content and preserving
 * blank lines between paragraphs.
 */
export function textToHtml(text: string): string {
  const paragraphs = text.split(/\r\n\r\n|\n\n|\r\r/);
  return paragraphs
    .map((paragraph) => {
      if (!paragraph.trim()) {
        return "<p>&nbsp;</p>";
      }
      const escaped = escapeHtml(paragraph).replace(/\r\n|\n|\r/g, "<br>");
      return `<p>${escaped}</p>`;
    })
    .join("\n");
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function humanLabel(attachmentType: AttachmentType): string {
  switch (attachmentType) {
    case "pdf":
      return "PDF selected";
    case "spreadsheet":
      return "Spreadsheet selected";
    default:
      return "Document selected";
  }
}

/**
 * Build the preview state for a selected attachment based on its detected
 * type. DOCX continues to use the existing Mammoth-based parser unchanged.
 */
export async function buildAttachmentPreview(
  file: File
): Promise<AttachmentPreview> {
  const attachmentType = detectAttachmentType(file);
  const ext = getExtension(file.name);

  switch (attachmentType) {
    case "image": {
      return {
        attachmentType,
        previewType: "image",
        previewContent: URL.createObjectURL(file),
        fileName: file.name,
      };
    }

    case "pdf": {
      // PDFs are extracted server-side (POST /api/uploads/pdf) rather than in
      // the browser. The result is stored in the same shape the DOCX flow
      // produces, so the rest of the attachment workflow is unchanged.
      const uploaded = await uploadPdf(file);
      return {
        attachmentType,
        previewType: "html",
        previewContent: uploaded.content,
        fileName: uploaded.attachmentName || file.name,
        url: uploaded.url,
        attachmentTime: uploaded.attachmentTime,
        attachmentName: uploaded.attachmentName,
      };
    }

    case "spreadsheet": {
      return {
        attachmentType,
        previewType: "file",
        previewContent: `${humanLabel(attachmentType)}:\n${file.name}`,
        fileName: file.name,
      };
    }

    case "markdown": {
      const raw = await readFileAsText(file);
      const html = await marked.parse(raw);
      return {
        attachmentType,
        previewType: "html",
        previewContent: html,
        fileName: file.name,
      };
    }

    case "text": {
      const raw = await readFileAsText(file);
      return {
        attachmentType,
        previewType: "html",
        previewContent: textToHtml(raw),
        fileName: file.name,
      };
    }

    case "document":
    default: {
      if (ext === "docx") {
        const html = await parseDocxToHtml(file);
        return {
          attachmentType: "document",
          previewType: "html",
          previewContent: html,
          fileName: file.name,
        };
      }

      // RTF / ODT: no client-side conversion available
      return {
        attachmentType: "document",
        previewType: "file",
        previewContent: `Document selected:\n${file.name}`,
        fileName: file.name,
      };
    }
  }
}

/**
 * Wrap an already-uploaded image URL in the same markup the PDF flow stores,
 * so an image attachment is rendered by the portfolio detail view exactly like
 * a converted document page.
 *
 * @param url Public URL of the uploaded image.
 * @param fileName Original file name, used as the alt text.
 */
export function buildImageAttachmentHtml(url: string, fileName: string): string {
  return `<div class="pdf-portfolio">\n  <img src="${escapeHtml(url)}" alt="${escapeHtml(
    fileName
  )}" loading="lazy" />\n</div>`;
}
