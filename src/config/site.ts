import { TEAM_MEMBERS, HERO_SLIDES } from '../../constants';
import dtalesLogo from '../assets/dtales-logo.png';

export const SITE_NAME = 'DTALES Tech';

export const SITE_DESCRIPTION =
  'DTALES Tech is a fully-managed marketing and content agency that owns the entire content supply chain, from GTM strategy and technical documentation to AI-era search visibility.';

export const SITE_EMAIL = 'contact@dtales.tech';

export const SITE_LINKEDIN = 'https://www.linkedin.com/company/dtales-tech/posts/?feedView=all';

export const SITE_ORGANIZATION_ID = '#organization';

export const SITE_WEBSITE_ID = '#website';

export const SITE_NAVIGATION_ID = '#navigation';

export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
];

export const SITE_LOGO_PATH = dtalesLogo;

export const SITE_DEFAULT_IMAGE = HERO_SLIDES[0]?.image ?? dtalesLogo;

export const FOUNDERS = TEAM_MEMBERS.filter((member) => /founder/i.test(member.role)).map((member) => ({
  name: member.name,
  jobTitle: member.role,
  image: member.image,
  sameAs: member.linkedin ? [member.linkedin] : [],
}));

export function getSiteOrigin(): string {
  const envUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return '';
}

export function buildAbsoluteUrl(value?: string | null): string {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const origin = getSiteOrigin();
  if (!origin) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${origin}${value}`;
  }

  return `${origin}/${value.replace(/^\/+/, '')}`;
}

export function buildRouteUrl(pathname = '/', search = ''): string {
  const origin = getSiteOrigin();
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${origin}/#${normalizedPath}${search}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
