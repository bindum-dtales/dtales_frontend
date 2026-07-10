import React from 'react';
import SchemaScript from './SchemaScript';
import { buildRouteUrl, SITE_NAME } from '../../src/config/site';

const WebsiteSchema: React.FC = () => {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${buildRouteUrl('/')}#website`,
        name: SITE_NAME,
        url: buildRouteUrl('/'),
        publisher: { '@id': `${buildRouteUrl('/')}#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${buildRouteUrl('/blogs')}?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
};

export default WebsiteSchema;
