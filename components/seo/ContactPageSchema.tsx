import React from 'react';
import SchemaScript from './SchemaScript';
import { buildRouteUrl } from '../../src/config/site';

type ContactPageSchemaProps = {
  path: string;
  name: string;
  description: string;
};

const ContactPageSchema: React.FC<ContactPageSchemaProps> = ({ path, name, description }) => {
  const pageUrl = buildRouteUrl(path);

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${pageUrl}#contactpage`,
        url: pageUrl,
        name,
        description,
        mainEntity: { '@id': `${buildRouteUrl('/')}#organization` },
        about: { '@id': `${buildRouteUrl('/')}#organization` },
      }}
    />
  );
};

export default ContactPageSchema;
