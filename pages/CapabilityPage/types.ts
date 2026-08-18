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
  /** External project URL. Absent for document-based portfolio entries. */
  link?: string;
  /** HTML converted from an uploaded document. Absent for link-based entries. */
  content?: string | null;
};
