import React from 'react';
import SchemaScript from './SchemaScript';
import { buildRouteUrl } from '../../src/config/site';

export type FaqItem = {
  question: string;
  answer: string;
};

type FAQPageSchemaProps = {
  name: string;
  description: string;
  path: string;
  items: FaqItem[];
};

const FAQPageSchema: React.FC<FAQPageSchemaProps> = ({ name, description, path, items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${buildRouteUrl(path)}#faqpage`,
        name,
        description,
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  );
};

export default FAQPageSchema;
