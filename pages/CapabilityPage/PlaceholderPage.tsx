import SEO from "../../components/seo/SEO";
import { CapabilityPageTemplate } from "./index";
import { DEFAULT_CAPABILITY_CTA } from "./data/cta";
import type { CapabilitySubcategory } from "./types";

type PlaceholderCapabilityPageProps = {
  title: string;
  subcategories: CapabilitySubcategory[];
  activeSubcategory: string;
};

export function PlaceholderCapabilityPage({
  title,
  subcategories,
  activeSubcategory,
}: PlaceholderCapabilityPageProps) {
  return (
    <>
      <SEO title={`${title} | DTALES Tech`} description={`${title} capability page.`} />
      <CapabilityPageTemplate
        capability={title}
        subcategories={subcategories}
        activeSubcategory={activeSubcategory}
        cta={DEFAULT_CAPABILITY_CTA}
      />
    </>
  );
}
