import React from 'react';
import SchemaScript from './SchemaScript';
import { buildAbsoluteUrl, buildRouteUrl, slugify } from '../../src/config/site';

export type PersonSchemaItem = {
  name: string;
  jobTitle: string;
  image?: string;
  sameAs?: string[];
  worksFor?: string;
};

type PersonSchemaProps = {
  people: PersonSchemaItem[];
};

const PersonSchema: React.FC<PersonSchemaProps> = ({ people }) => {
  if (!people.length) {
    return null;
  }

  return (
    <SchemaScript
      data={people.map((person) => ({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${buildRouteUrl('/team')}#${slugify(person.name) || 'person'}`,
        name: person.name,
        jobTitle: person.jobTitle,
        ...(person.image ? { image: buildAbsoluteUrl(person.image) } : {}),
        sameAs: person.sameAs?.filter(Boolean),
        worksFor: { '@id': `${buildRouteUrl('/')}#organization` },
      }))}
    />
  );
};

export default PersonSchema;
