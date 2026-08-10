import {
  PenLine,
  Linkedin,
  Instagram,
  Megaphone,
  Target,
  Presentation,
  BookOpen,
  FileText,
  IdCard,
  Plug,
  Code2,
  Library,
  Video,
  PlayCircle,
  Sparkles,
  Globe,
  LayoutTemplate,
  Palette,
  MessageSquare,
  CalendarCheck,
} from "lucide-react";
import type { CapabilitySubcategory } from "../types";

export const PRODUCT_MARKETING_SUBCATEGORIES: CapabilitySubcategory[] = [
  { label: "Blogs", icon: PenLine },
  { label: "LinkedIn Posts", icon: Linkedin },
  { label: "IG Posts", icon: Instagram },
  { label: "Campaigns", icon: Megaphone },
  { label: "LinkedIn Ads", icon: Target },
];

export const SALES_ENABLEMENT_SUBCATEGORIES: CapabilitySubcategory[] = [
  { label: "Slide Decks", icon: Presentation },
  { label: "Brochures", icon: BookOpen },
  { label: "Flyers", icon: FileText },
  { label: "Service Profiles", icon: IdCard },
];

export const TECHNICAL_DOCUMENTATION_SUBCATEGORIES: CapabilitySubcategory[] = [
  { label: "Integration Docs", icon: Plug },
  { label: "User Guides", icon: BookOpen },
  { label: "API Guides", icon: Code2 },
  { label: "Docs Portal", icon: Library },
];

export const PRODUCT_EXPERIENCE_SUBCATEGORIES: CapabilitySubcategory[] = [
  { label: "Ad Videos", icon: Video },
  { label: "Product Demos", icon: PlayCircle },
  { label: "Feature Demos", icon: Sparkles },
];

export const DIGITAL_EXPERIENCE_SUBCATEGORIES: CapabilitySubcategory[] = [
  { label: "Product Webpages", icon: Globe },
  { label: "Prototypes", icon: LayoutTemplate },
  { label: "Brand Systems", icon: Palette },
  { label: "Campaign", icon: Megaphone },
];

export const GTM_STRATEGY_SUBCATEGORIES: CapabilitySubcategory[] = [
  { label: "Messaging", icon: MessageSquare },
  { label: "Positioning", icon: Target },
  { label: "Content Strategy", icon: FileText },
  { label: "Campaign Planning", icon: CalendarCheck },
];
