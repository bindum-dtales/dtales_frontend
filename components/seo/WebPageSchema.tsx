import React from 'react';
import SchemaScript from './SchemaScript';
import { buildAbsoluteUrl, buildRouteUrl, SITE_NAME } from '../../src/config/site';

type WebPageSchemaProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  additionalTypes?: string[];
  breadcrumbId?: string;
};

const WebPageSchema: React.FC<WebPageSchemaProps> = ({
  title,
  description,
  path = '/',
  image,
  additionalTypes = [],
  breadcrumbId,
}) => {
  const canonicalUrl = buildRouteUrl(path);

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': ['WebPage', ...additionalTypes],
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${buildRouteUrl('/')}#website` },
        publisher: { '@id': `${buildRouteUrl('/')}#organization` },
        about: { '@id': `${buildRouteUrl('/')}#organization` },
        ...(image
          ? {
              primaryImageOfPage: {
                '@type': 'ImageObject',
                url: buildAbsoluteUrl(image),
                contentUrl: buildAbsoluteUrl(image),
                caption: `${SITE_NAME} ${title}`,
              },
            }
          : {}),
        ...(breadcrumbId ? { breadcrumb: { '@id': breadcrumbId } } : {}),
      }}
    />
  );
};

export default WebPageSchema;
