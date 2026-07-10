import React from 'react';
import SchemaScript from './SchemaScript';
import { NAVIGATION_LINKS, SITE_NAVIGATION_ID, buildRouteUrl } from '../../src/config/site';

const NavigationSchema: React.FC = () => {
  return (
    <SchemaScript
      data={NAVIGATION_LINKS.map((link, index) => ({
        '@context': 'https://schema.org',
        '@type': 'SiteNavigationElement',
        '@id': `${buildRouteUrl(link.path)}#nav-${index + 1}`,
        name: link.name,
        url: buildRouteUrl(link.path),
        isPartOf: { '@id': `${buildRouteUrl('/')}#website` },
        identifier: SITE_NAVIGATION_ID,
      }))}
    />
  );
};

export default NavigationSchema;
