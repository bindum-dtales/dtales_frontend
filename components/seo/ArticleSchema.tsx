import React from 'react';
import SchemaScript from './SchemaScript';
import { buildAbsoluteUrl, buildRouteUrl, SITE_NAME, slugify } from '../../src/config/site';
import { keywordsFromText, stripHtml, truncate } from './utils';

type ArticleSchemaProps = {
  path: string;
  headline: string;
  bodyHtml?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string;
  authorUrl?: string;
  schemaType?: 'Article' | 'BlogPosting';
  keywords?: string[];
};

const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  path,
  headline,
  bodyHtml,
  image,
  datePublished,
  dateModified,
  authorName = SITE_NAME,
  authorUrl,
  schemaType = 'Article',
  keywords,
}) => {
  const pageUrl = buildRouteUrl(path);
  const articleBody = stripHtml(bodyHtml);
  const derivedKeywords = keywords?.length ? keywords : keywordsFromText(`${headline} ${articleBody}`);

  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': schemaType,
        '@id': `${pageUrl}#${slugify(headline) || 'article'}`,
        headline,
        name: headline,
        url: pageUrl,
        mainEntityOfPage: { '@id': pageUrl },
        author: {
          '@type': 'Organization',
          name: authorName,
          ...(authorUrl ? { url: authorUrl } : {}),
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: buildRouteUrl('/'),
        },
        ...(image
          ? {
              image: {
                '@type': 'ImageObject',
                url: buildAbsoluteUrl(image),
                contentUrl: buildAbsoluteUrl(image),
              },
            }
          : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : datePublished ? { dateModified: datePublished } : {}),
        ...(articleBody ? { articleBody: truncate(articleBody, 50000) } : {}),
        ...(derivedKeywords.length ? { keywords: derivedKeywords.join(', ') } : {}),
      }}
    />
  );
};

export default ArticleSchema;
