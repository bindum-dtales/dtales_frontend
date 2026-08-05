import type { LucideIcon } from "lucide-react";

export type CapabilitySubcategory = {
  label: string;
  icon: LucideIcon;
};

export type CapabilityCta = {
  heading: string;
  description: string;
  buttonLabel: string;
};

export type ContentCardItem = {
  id: string | number;
  title: string;
  description: string;
  subcategory?: string;
  company_name?: string;
  cover_image_url: string;
  link?: string;
};
