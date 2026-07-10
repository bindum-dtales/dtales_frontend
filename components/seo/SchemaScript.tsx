import React from 'react';
import { safeJsonLd } from './utils';

type SchemaScriptProps = {
  data: unknown;
};

const SchemaScript: React.FC<SchemaScriptProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />;
};

export default SchemaScript;
