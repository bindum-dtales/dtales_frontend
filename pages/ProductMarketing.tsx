import { PlaceholderCapabilityPage } from "./CapabilityPage/PlaceholderPage";
import { PRODUCT_MARKETING_SUBCATEGORIES } from "./CapabilityPage/data/subcategories";

export default function ProductMarketing() {
  return (
    <PlaceholderCapabilityPage
      title="Product Marketing"
      subcategories={PRODUCT_MARKETING_SUBCATEGORIES}
      activeSubcategory={PRODUCT_MARKETING_SUBCATEGORIES[0].label}
    />
  );
}
