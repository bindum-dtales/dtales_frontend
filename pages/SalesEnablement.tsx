import { PlaceholderCapabilityPage } from "./CapabilityPage/PlaceholderPage";
import { SALES_ENABLEMENT_SUBCATEGORIES } from "./CapabilityPage/data/subcategories";

export default function SalesEnablement() {
  return (
    <PlaceholderCapabilityPage
      title="Sales Enablement"
      subcategories={SALES_ENABLEMENT_SUBCATEGORIES}
      activeSubcategory={SALES_ENABLEMENT_SUBCATEGORIES[0].label}
    />
  );
}
