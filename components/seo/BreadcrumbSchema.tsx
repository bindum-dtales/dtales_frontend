import React from 'react';
import SchemaScript from './SchemaScript';
import { buildRouteUrl } from '../../src/config/site';

export type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
  id?: string;
};

const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items, id }) => {
  if (!items.length) {
    return null;
  }

  const breadcrumbId = id ?? `${buildRouteUrl(items[items.length - 1]?.url ?? '/')}#breadcrumb`;

  const normalizedItems = items.map((item) => ({
    name: item.name,
    url: /^https?:\/\//i.test(item.url) ? item.url : buildRouteUrl(item.url),
  }));

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: normalizedItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
};

export default BreadcrumbSchema;
