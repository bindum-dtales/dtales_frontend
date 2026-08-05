export type PortfolioCapability = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
};

export const PORTFOLIO_CAPABILITIES: PortfolioCapability[] = [
  {
    number: "01",
    title: "Product Marketing",
    description: "Content that builds awareness and generates demand.",
    bullets: ["Blogs", "LinkedIn Posts", "IG Posts", "Campaigns", "LinkedIn Ads"],
    href: "/work/product-marketing",
  },
  {
    number: "02",
    title: "Sales Enablement",
    description: "Tools and collateral that help teams win more deals.",
    bullets: ["Slide Decks", "Brochures", "Flyers", "Service Profiles"],
    href: "/work/sales-enablement",
  },
  {
    number: "03",
    title: "Technical Documentation",
    description: "Clear documentation that improves adoption and reduces support.",
    bullets: ["Integration Docs", "User Guides", "API Guides", "Doc Portal"],
    href: "/work/technical-documentation",
  },
  {
    number: "04",
    title: "Product Experience",
    description: "Videos and demos to showcase value and drive engagement.",
    bullets: ["Ad Videos", "Product Demos", "Feature Demos"],
    href: "/work/product-experience",
  },
  {
    number: "05",
    title: "Digital Experience",
    description: "Websites, landing pages and prototypes that improve impact.",
    bullets: ["Product Webpages", "Prototypes", "Brand Systems", "Campaign"],
    href: "/work/digital-experience",
  },
  {
    number: "06",
    title: "GTM Strategy",
    description: "Strategic frameworks and campaigns that power product launches.",
    bullets: ["Messaging", "Positioning", "Content Strategy", "Campaign Planning"],
    href: "/work/gtm-strategy",
  },
];
