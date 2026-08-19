/**
 * Shared resolution of "where does this portfolio card go?".
 *
 * Portfolio entries reach the visitor in one of three states, and both the
 * Work Library cards and the Capability page cards must treat them identically:
 *
 *   1. An external Project Link -> open the external URL.
 *   2. An attachment stored as a bare file URL -> open that file directly.
 *   3. Everything else -> open the in-app detail view at `/portfolio/:id`.
 *      That covers both converted attachments (stored as HTML in `content`)
 *      and records that have neither a link nor an attachment yet: the detail
 *      page renders whatever the record does have, so every card stays
 *      reachable. The id is the record's own database id, nothing derived.
 *
 * `none` is reserved for a record with no usable id, which the API should
 * never return; it exists only so a malformed record cannot produce a link to
 * `/portfolio/undefined`.
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
  /** Opens the in-app detail view for this record. */
  | { kind: "internal"; to: string; label: string }
  /** Unreachable for any record the API returns; see the note above. */
  | { kind: "none" };

/** A stored attachment kept as a plain URL rather than converted HTML. */
const BARE_URL = /^https?:\/\/[^\s<>"']+$/i;

export function resolvePortfolioTarget(item: PortfolioTargetSource): PortfolioTarget {
  const link = item.link?.trim();
  if (link) {
    return { kind: "external", href: link, label: "View Project" };
  }

  const content = item.content?.trim();
  if (content && BARE_URL.test(content)) {
    return { kind: "external", href: content, label: "View Document" };
  }

  const id = typeof item.id === "number" ? String(item.id) : item.id?.trim();
  if (id) {
    return { kind: "internal", to: `/portfolio/${id}`, label: "View Project" };
  }

  return { kind: "none" };
}
