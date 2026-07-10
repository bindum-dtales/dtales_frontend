export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function stripHtml(html?: string | null): string {
  if (!html) {
    return '';
  }

  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncate(value: string, limit: number): string {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trimEnd()}…`;
}

export function keywordsFromText(value: string, limit = 12): string[] {
  const stopWords = new Set([
    'and',
    'the',
    'for',
    'with',
    'from',
    'into',
    'that',
    'your',
    'our',
    'are',
    'this',
    'will',
    'you',
  ]);

  const keywords = new Set<string>();

  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 3 && !stopWords.has(token))
    .forEach((token) => keywords.add(token));

  return Array.from(keywords).slice(0, limit);
}
