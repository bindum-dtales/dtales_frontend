import React from 'react';
import SchemaScript from './SchemaScript';
import { buildRouteUrl } from '../../src/config/site';

type AboutPageSchemaProps = {
  path: string;
  name: string;
  description: string;
};

const AboutPageSchema: React.FC<AboutPageSchemaProps> = ({ path, name, description }) => {
  const pageUrl = buildRouteUrl(path);

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${pageUrl}#aboutpage`,
        url: pageUrl,
        name,
        description,
        mainEntity: { '@id': `${buildRouteUrl('/')}#organization` },
        about: { '@id': `${buildRouteUrl('/')}#organization` },
      }}
    />
  );
};

export default AboutPageSchema;
