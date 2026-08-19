/**
 * Shared resolution of "where does this portfolio card go?".
 *
 * Portfolio entries reach the visitor in one of three states, and both the
 * Work Library cards and the Capability page cards must treat them identically:
 *
 *   1. An external Project Link  -> open the external URL.
 *   2. No link, but an uploaded attachment -> open the attachment. Attachments
 *      are persisted in `content` (the only attachment-bearing field the
 *      portfolio API returns): document/PDF uploads are stored as converted
 *      HTML and open in the internal detail view, while an attachment stored
 *      as a bare file URL is opened directly in the browser.
 *   3. Neither -> nothing to open yet.
 */

/** Minimal shape needed to resolve a target, shared by every card type. */
export type PortfolioTargetSource = {
  id: string | number;
  link?: string | null;
  content?: string | null;
};

export type PortfolioTarget =
  /** Opens in a new tab: an external project, or a directly stored file. */
  | { kind: "external"; href: string; label: string }
  /** Opens the in-app detail view that renders the converted attachment. */
  | { kind: "internal"; to: string; label: string }
  /** Nothing published for this entry yet. */
  | { kind: "none" };

/** A stored attachment kept as a plain URL rather than converted HTML. */
const BARE_URL = /^https?:\/\/[^\s<>"']+$/i;

export function resolvePortfolioTarget(item: PortfolioTargetSource): PortfolioTarget {
  const link = item.link?.trim();
  if (link) {
    return { kind: "external", href: link, label: "View Project" };
  }

  const content = item.content?.trim();
  if (content) {
    if (BARE_URL.test(content)) {
      return { kind: "external", href: content, label: "View Document" };
    }
    return { kind: "internal", to: `/portfolio/${item.id}`, label: "View Project" };
  }

  return { kind: "none" };
}
