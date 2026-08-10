import { PlaceholderCapabilityPage } from "./CapabilityPage/PlaceholderPage";
import { TECHNICAL_DOCUMENTATION_SUBCATEGORIES } from "./CapabilityPage/data/subcategories";

export default function TechnicalDocumentation() {
  return (
    <PlaceholderCapabilityPage
      title="Technical Documentation"
      subcategories={TECHNICAL_DOCUMENTATION_SUBCATEGORIES}
      activeSubcategory={TECHNICAL_DOCUMENTATION_SUBCATEGORIES[0].label}
    />
  );
}
