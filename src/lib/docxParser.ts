/**
 * DOCX to HTML Parser
 * Uses Mammoth.js to convert DOCX files to clean HTML
 * Embedded images are converted to base64 data URLs
 */

import mammoth from "mammoth/mammoth.browser";

/**
 * Parse a DOCX file to HTML
 * @param file - The DOCX file to parse
 * @returns Promise<string> - HTML content
 * @throws Error if parsing fails
 */
export async function parseDocxToHtml(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.type.includes("wordprocessingml") && !file.name.endsWith(".docx")) {
    throw new Error("Invalid file type. Please upload a .docx file.");
  }

  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert DOCX to HTML with embedded images as base64
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        // Convert embedded images to base64 data URLs
        convertImage: mammoth.images.imgElement((image: any) => {
          return image.read("base64").then((base64Data: string) => {
            const dataUrl = `data:${image.contentType};base64,${base64Data}`;
            return {
              src: dataUrl,
            };
          });
        }),
      }
    );

    const html = result.value;

    if (!html || !html.trim()) {
      throw new Error("No content found in DOCX file");
    }

    return html;
  } catch (err: any) {
    throw new Error(
      err.message || "Failed to parse DOCX file. Ensure it's a valid .docx file."
    );
  }
}
