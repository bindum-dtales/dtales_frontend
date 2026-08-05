import { PlaceholderCapabilityPage } from "./CapabilityPage/PlaceholderPage";
import { GTM_STRATEGY_SUBCATEGORIES } from "./CapabilityPage/data/subcategories";

export default function GtmStrategy() {
  return (
    <PlaceholderCapabilityPage
      title="GTM Strategy"
      subcategories={GTM_STRATEGY_SUBCATEGORIES}
      activeSubcategory={GTM_STRATEGY_SUBCATEGORIES[0].label}
    />
  );
}
