import { useCallback, useState } from "react";

/**
 * The "external link OR uploaded document" choice shared by the Blog and Case
 * Study editors.
 *
 * A record carries its body in exactly one of two existing fields:
 *
 *   `link`    -> an external project URL the visitor opens directly.
 *   `content` -> HTML converted from an uploaded DOCX/PDF.
 *
 * The two are mutually exclusive, so this hook owns the whole rule set in one
 * place: which input is disabled, how a saved record seeds the form, and which
 * payload fields the editors send. `toPayloadFields` can only ever describe one
 * of the two, which is what makes "never send both" structural rather than a
 * validation step that could be forgotten.
 */

/** The `link` / `content` half of a Blog or Case Study payload. */
export type LinkOrDocumentFields = {
  link: string | null;
  /**
   * Omitted when a stored document is being kept untouched: the editors have
   * always relied on an absent `content` meaning "leave the existing body
   * alone", and re-sending HTML the editor never loaded would risk changing it.
   */
  content?: string | null;
};

/** Shown when a record would be saved with neither a link nor a document. */
export const MISSING_SOURCE_MESSAGE =
  "Please provide either a project link or upload a document.";

/** Minimal shape of a saved record, as returned by the detail endpoints. */
export type LinkOrDocumentRecord = {
  link?: string | null;
  content?: string | null;
};

export function useLinkOrDocument() {
  const [link, setLink] = useState("");
  /** HTML parsed from a document chosen in this session. */
  const [documentHtml, setDocumentHtml] = useState<string | null>(null);
  /** A document already saved on the record and not removed since. */
  const [hasStoredDocument, setHasStoredDocument] = useState(false);

  const hasLink = link.trim().length > 0;
  const hasDocument = documentHtml !== null || hasStoredDocument;

  /**
   * Seed the form from a saved record. A link wins if a legacy record somehow
   * holds both, matching the precedence the public pages already use.
   */
  const loadRecord = useCallback((record: LinkOrDocumentRecord) => {
    const savedLink = record.link?.trim() || "";
    setLink(savedLink);
    setDocumentHtml(null);
    setHasStoredDocument(!savedLink && Boolean(record.content?.trim()));
  }, []);

  const clearDocument = useCallback(() => {
    setDocumentHtml(null);
    setHasStoredDocument(false);
  }, []);

  const toPayloadFields = useCallback((): LinkOrDocumentFields => {
    if (hasLink) {
      return { link: link.trim(), content: null };
    }
    if (documentHtml) {
      return { link: null, content: documentHtml };
    }
    return { link: null };
  }, [documentHtml, hasLink, link]);

  return {
    link,
    setLink,
    /** True once the link field holds something; disables the document picker. */
    hasLink,
    /** True for a new or a kept stored document; disables the link field. */
    hasDocument,
    /** True only for a document parsed in this session (drives the preview). */
    hasNewDocument: documentHtml !== null,
    setDocumentHtml,
    clearDocument,
    loadRecord,
    toPayloadFields,
  };
}
