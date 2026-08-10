#!/usr/bin/env node
// Generates public/sitemap.xml and public/robots.txt from the app's own route
// table (App.tsx) plus live data from the production API. Runs automatically
// before every `npm run build` — see the "build" script in package.json.
//
// URL format: this app uses HashRouter, and src/config/site.ts already builds
// every canonical/OG URL in the app as `${origin}/#${path}` (see buildRouteUrl).
// Sitemap entries mirror that exact format so <loc> matches what each page's
// own <link rel="canonical"> tag declares.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://dtales.tech').replace(/\/+$/, '');
const API_BASE = (process.env.VITE_API_BASE_URL || 'https://api.dtales.tech').replace(/\/+$/, '');

// Every public route registered in App.tsx. Admin/login routes are
// intentionally excluded (also blocked in robots.txt).
const STATIC_ROUTES = [
  '/',
  '/services',
  '/portfolio',
  '/team',
  '/blogs',
  '/case-studies',
  '/work/product-marketing',
  '/work/sales-enablement',
  '/work/technical-documentation',
  '/work/product-experience',
  '/work/digital-experience',
  '/work/gtm-strategy',
  '/contact',
  '/terms',
  '/privacy',
];

// Dynamic detail routes: [API endpoint, route prefix]. Both the endpoint and
// the route prefix already exist in src/lib/api.ts / App.tsx — nothing new
// is invented here.
const DYNAMIC_SOURCES = [
  { endpoint: '/api/portfolio', routePrefix: '/portfolio' },
  { endpoint: '/api/blogs', routePrefix: '/blogs' },
  { endpoint: '/api/case-studies', routePrefix: '/case-studies' },
];

function routeUrl(pathname) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}/#${normalized}`;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isPublished(item) {
  // Some list endpoints only ever return published items and omit the flag
  // entirely; only exclude items explicitly marked unpublished.
  return item.published !== false;
}

async function fetchJson(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      console.warn(`[sitemap] ${url} responded with ${res.status}, skipping.`);
      return [];
    }
    const body = await res.json();
    // Endpoints may respond with a raw array or a { success, data } envelope
    // (see src/lib/api.ts safeFetch) — support both.
    const data = body && typeof body === 'object' && !Array.isArray(body) && 'data' in body
      ? body.data
      : body;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[sitemap] Failed to fetch ${url}: ${err.message}. Skipping.`);
    return [];
  }
}

// The list endpoint returning an item is not proof its detail page resolves —
// verify the actual detail endpoint each page fetches (e.g. PortfolioDetails.tsx
// calls GET /api/portfolio/:id) before trusting the URL. Catches cases where a
// list endpoint exists but its singular detail route does not.
async function detailUrlIsLive(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return false;
    const body = await res.json();
    const data = body && typeof body === 'object' && !Array.isArray(body) && 'data' in body
      ? body.data
      : body;
    return data !== null && data !== undefined && !(typeof data === 'object' && Object.keys(data).length === 0);
  } catch {
    return false;
  }
}

async function buildDynamicEntries() {
  const results = await Promise.all(
    DYNAMIC_SOURCES.map(async ({ endpoint, routePrefix }) => {
      const items = (await fetchJson(endpoint))
        .filter(isPublished)
        .filter((item) => item.id !== undefined && item.id !== null);

      const verified = await Promise.all(
        items.map(async (item) => {
          const isLive = await detailUrlIsLive(`${endpoint}/${item.id}`);
          if (!isLive) {
            console.warn(
              `[sitemap] Skipping ${routePrefix}/${item.id}: ${endpoint}/${item.id} did not resolve on the production API.`
            );
            return null;
          }
          return {
            loc: routeUrl(`${routePrefix}/${item.id}`),
            lastmod: toIsoDate(item.updated_at || item.created_at),
          };
        })
      );

      return verified.filter(Boolean);
    })
  );
  return results.flat();
}

function renderSitemap(entries) {
  const urlTags = entries
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : '';
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodTag}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>\n`;
}

function renderRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

async function main() {
  const staticEntries = STATIC_ROUTES.map((route) => ({ loc: routeUrl(route), lastmod: null }));
  const dynamicEntries = await buildDynamicEntries();
  const sitemap = renderSitemap([...staticEntries, ...dynamicEntries]);

  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), renderRobotsTxt(), 'utf-8');

  console.log(
    `[sitemap] Wrote ${staticEntries.length} static + ${dynamicEntries.length} dynamic URLs to public/sitemap.xml`
  );
}

main().catch((err) => {
  console.error('[sitemap] Generation failed:', err);
  process.exitCode = 1;
});
