import { PlaceholderCapabilityPage } from "./CapabilityPage/PlaceholderPage";
import { DIGITAL_EXPERIENCE_SUBCATEGORIES } from "./CapabilityPage/data/subcategories";

export default function DigitalExperience() {
  return (
    <PlaceholderCapabilityPage
      title="Digital Experience"
      subcategories={DIGITAL_EXPERIENCE_SUBCATEGORIES}
      activeSubcategory={DIGITAL_EXPERIENCE_SUBCATEGORIES[0].label}
    />
  );
}
