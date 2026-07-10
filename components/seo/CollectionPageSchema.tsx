import React from 'react';
import SchemaScript from './SchemaScript';
import { buildAbsoluteUrl, buildRouteUrl, slugify } from '../../src/config/site';

type CollectionItem = {
  name: string;
  url: string;
  image?: string;
  description?: string;
};

type CollectionPageSchemaProps = {
  path: string;
  name: string;
  description: string;
  items: CollectionItem[];
};

const CollectionPageSchema: React.FC<CollectionPageSchemaProps> = ({ path, name, description, items }) => {
  if (!items.length) {
    return null;
  }

  const pageUrl = buildRouteUrl(path);

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collectionpage`,
        url: pageUrl,
        name,
        description,
        mainEntity: {
          '@type': 'ItemList',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'CreativeWork',
              '@id': `${/^https?:\/\//i.test(item.url) ? item.url : buildRouteUrl(item.url)}#${slugify(item.name) || 'item'}`,
              name: item.name,
              url: /^https?:\/\//i.test(item.url) ? item.url : buildRouteUrl(item.url),
              ...(item.description ? { description: item.description } : {}),
              ...(item.image
                ? {
                    image: {
                      '@type': 'ImageObject',
                      url: buildAbsoluteUrl(item.image),
                      contentUrl: buildAbsoluteUrl(item.image),
                    },
                  }
                : {}),
            },
          })),
        },
      }}
    />
  );
};

export default CollectionPageSchema;
