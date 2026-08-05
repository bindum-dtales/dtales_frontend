import { PlaceholderCapabilityPage } from "./CapabilityPage/PlaceholderPage";
import { PRODUCT_EXPERIENCE_SUBCATEGORIES } from "./CapabilityPage/data/subcategories";

export default function ProductExperience() {
  return (
    <PlaceholderCapabilityPage
      title="Product Experience"
      subcategories={PRODUCT_EXPERIENCE_SUBCATEGORIES}
      activeSubcategory={PRODUCT_EXPERIENCE_SUBCATEGORIES[0].label}
    />
  );
}
