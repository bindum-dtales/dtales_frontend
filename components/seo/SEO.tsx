import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import OrganizationSchema from './OrganizationSchema';
import WebsiteSchema from './WebsiteSchema';
import NavigationSchema from './NavigationSchema';
import WebPageSchema from './WebPageSchema';
import BreadcrumbSchema, { type BreadcrumbItem } from './BreadcrumbSchema';
import { buildRouteUrl, SITE_DEFAULT_IMAGE, SITE_NAME, buildAbsoluteUrl } from '../../src/config/site';

type SEOProps = {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
};

const BREADCRUMB_LABELS: Record<string, string> = {
  '/': 'Home',
  '/services': 'Services',
  '/portfolio': 'Portfolio',
  '/team': 'Team',
  '/contact': 'Contact',
  '/blogs': 'Blogs',
  '/case-studies': 'Case Studies',
  '/admin': 'Admin',
  '/admin/dashboard': 'Dashboard',
  '/admin/blogs/new': 'New Blog',
  '/admin/blogs/manage': 'Manage Blogs',
  '/admin/case-studies/new': 'New Case Study',
  '/admin/case-studies/manage': 'Manage Case Studies',
  '/admin/portfolio/create': 'Create Portfolio Item',
  '/admin/portfolio/manage': 'Manage Portfolio',
};

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (normalizedPath === '/') {
    return [{ name: 'Home', url: buildRouteUrl('/') }];
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ name: 'Home', url: buildRouteUrl('/') }];

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const label = BREADCRUMB_LABELS[path] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    crumbs.push({ name: label, url: buildRouteUrl(path) });
  });

  return crumbs;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  noindex = false,
  ogType = 'website',
  keywords,
  publishedTime,
  modifiedTime,
  breadcrumbs,
  children,
}) => {
  const location = useLocation();
  const canonicalUrl = buildRouteUrl(location.pathname, location.search);
  const socialImage = buildAbsoluteUrl(image ?? SITE_DEFAULT_IMAGE);
  const resolvedBreadcrumbs = breadcrumbs ?? buildBreadcrumbs(location.pathname);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords?.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {socialImage ? <meta property="og:image" content={socialImage} /> : null}
        <meta name="twitter:card" content={socialImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {socialImage ? <meta name="twitter:image" content={socialImage} /> : null}
        {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
        {modifiedTime ? <meta property="article:modified_time" content={modifiedTime} /> : null}
      </Helmet>

      <WebPageSchema title={title} description={description} path={location.pathname} image={image} />
      <OrganizationSchema />
      <WebsiteSchema />
      <NavigationSchema />
      {resolvedBreadcrumbs.length ? <BreadcrumbSchema items={resolvedBreadcrumbs} /> : null}
      {children}
    </>
  );
};

export default SEO;
