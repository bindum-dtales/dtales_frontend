import React from 'react';
import SchemaScript from './SchemaScript';
import {
  buildAbsoluteUrl,
  buildRouteUrl,
  FOUNDERS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_LINKEDIN,
  SITE_LOGO_PATH,
  SITE_NAME,
} from '../../src/config/site';

const OrganizationSchema: React.FC = () => {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${buildRouteUrl('/')}#organization`,
        name: SITE_NAME,
        url: buildRouteUrl('/'),
        description: SITE_DESCRIPTION,
        logo: {
          '@type': 'ImageObject',
          url: buildAbsoluteUrl(SITE_LOGO_PATH),
          contentUrl: buildAbsoluteUrl(SITE_LOGO_PATH),
        },
        sameAs: [SITE_LINKEDIN],
        email: SITE_EMAIL,
        founder: FOUNDERS.map((founder) => ({
          '@type': 'Person',
          name: founder.name,
          jobTitle: founder.jobTitle,
          image: founder.image ? buildAbsoluteUrl(founder.image) : undefined,
          sameAs: founder.sameAs,
          worksFor: { '@id': `${buildRouteUrl('/')}#organization` },
        })),
      }}
    />
  );
};

export default OrganizationSchema;
