/**
 * HTML Sanitizer
 *
 * Portfolio "document" entries store HTML that was converted from an uploaded
 * document. That HTML is untrusted, so it must be sanitized before it is handed
 * to `dangerouslySetInnerHTML`.
 *
 * The sanitizer is allowlist based: anything that is not explicitly allowed is
 * dropped. Parsing happens through `DOMParser`, which produces an inert document
 * (no scripts run, no resources are fetched), so the walk below is safe.
 */

const ALLOWED_TAGS = new Set([
  "a", "abbr", "article", "b", "blockquote", "br", "caption", "code", "col",
  "colgroup", "div", "em", "figcaption", "figure", "h1", "h2", "h3", "h4", "h5",
  "h6", "hr", "i", "img", "li", "mark", "ol", "p", "pre", "s", "section",
  "small", "span", "strong", "sub", "sup", "table", "tbody", "td", "tfoot",
  "th", "thead", "tr", "u", "ul",
]);

/** Attributes allowed on every allowed tag. */
const GLOBAL_ATTRIBUTES = new Set(["id", "title", "dir", "lang"]);

/** Attributes allowed only on specific tags. */
const TAG_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel", "name"]),
  img: new Set(["src", "alt", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan", "headers"]),
  th: new Set(["colspan", "rowspan", "headers", "scope"]),
  col: new Set(["span"]),
  colgroup: new Set(["span"]),
  ol: new Set(["start", "type"]),
};

const ALLOWED_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

const ALLOWED_IMAGE_DATA_TYPES = new Set([
  "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp",
  "image/avif", "image/bmp",
]);

/** Strips whitespace and control characters used to obfuscate a URL scheme. */
function normalizeUrl(value: string): string {
  return value.replace(/[\s\u0000-\u001f\u007f]/g, "").toLowerCase();
}

function isSafeLinkUrl(value: string): boolean {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;

  // Fragment, root-relative and relative URLs carry no scheme.
  if (normalized.startsWith("#") || normalized.startsWith("/")) return true;

  const schemeMatch = normalized.match(/^([a-z][a-z0-9+.-]*):/);
  if (!schemeMatch) return true;

  return ALLOWED_LINK_PROTOCOLS.has(`${schemeMatch[1]}:`);
}

function isSafeImageUrl(value: string): boolean {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;
  if (normalized.startsWith("/")) return true;

  const schemeMatch = normalized.match(/^([a-z][a-z0-9+.-]*):/);
  if (!schemeMatch) return true;

  const scheme = schemeMatch[1];
  if (scheme === "http" || scheme === "https") return true;

  // Documents converted to HTML commonly inline their images as data URIs.
  if (scheme === "data") {
    const mediaType = normalized.slice("data:".length).split(";")[0].split(",")[0];
    return ALLOWED_IMAGE_DATA_TYPES.has(mediaType);
  }

  return false;
}

/** Cleans an element's attributes. Returns false when the element was dropped. */
function sanitizeElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();
  const allowedForTag = TAG_ATTRIBUTES[tagName];

  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase();
    const value = attribute.value;

    const isAllowed = GLOBAL_ATTRIBUTES.has(name) || Boolean(allowedForTag?.has(name));
    if (!isAllowed) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (tagName === "a" && name === "href" && !isSafeLinkUrl(value)) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (tagName === "img" && name === "src" && !isSafeImageUrl(value)) {
      element.removeAttribute(attribute.name);
    }
  }

  // Links that open in a new tab must not leak the opener.
  if (tagName === "a" && element.getAttribute("target")) {
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
  }

  // An image without a usable source is noise.
  if (tagName === "img" && !element.getAttribute("src")) {
    element.remove();
    return false;
  }

  return true;
}

function sanitizeNode(node: Node): void {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) continue;

    if (child.nodeType !== Node.ELEMENT_NODE) {
      child.remove();
      continue;
    }

    const element = child as Element;
    const tagName = element.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      // Drop the element together with everything it contains, so that a
      // `<script>` body never leaks back into the document as text.
      element.remove();
      continue;
    }

    if (sanitizeElement(element)) {
      sanitizeNode(element);
    }
  }
}

/**
 * Returns an allowlisted copy of `html` that is safe to inject into the page.
 *
 * @param html Untrusted HTML, typically converted from an uploaded document.
 * @returns Sanitized HTML, or an empty string when there is nothing to render.
 */
export function sanitizeHtml(html?: string | null): string {
  if (!html) return "";
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    return "";
  }

  try {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    sanitizeNode(parsed.body);
    return parsed.body.innerHTML;
  } catch (error) {
    console.error("Failed to sanitize portfolio content:", error);
    return "";
  }
}
