import React from 'react';
import SchemaScript from './SchemaScript';
import { buildRouteUrl, slugify } from '../../src/config/site';

export type ServiceSchemaItem = {
  serviceType: string;
  description: string;
  audience?: string;
  areaServed?: string;
  path?: string;
};

type ServiceSchemaProps = {
  services: ServiceSchemaItem[];
};

const ServiceSchema: React.FC<ServiceSchemaProps> = ({ services }) => {
  if (!services.length) {
    return null;
  }

  return (
    <SchemaScript
      data={services.map((service) => {
        const serviceUrl = buildRouteUrl(service.path ?? '/services');

        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${serviceUrl}#${slugify(service.serviceType) || 'service'}`,
          name: service.serviceType,
          serviceType: service.serviceType,
          description: service.description,
          provider: { '@id': `${buildRouteUrl('/')}#organization` },
          url: serviceUrl,
          ...(service.areaServed ? { areaServed: service.areaServed } : {}),
          ...(service.audience
            ? {
                audience: {
                  '@type': 'Audience',
                  audienceType: service.audience,
                },
              }
            : {}),
        };
      })}
    />
  );
};

export default ServiceSchema;
