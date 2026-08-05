export const PORTFOLIO_FILTERS = [
  "All",
  "Documentation",
  "Marketing",
  "Branding",
  "Video",
] as const;

export type PortfolioFilter = (typeof PORTFOLIO_FILTERS)[number];

export const PAGE_SIZE = 6;

export const normalizeCategory = (value?: string | null) =>
  (value ?? "").trim().toLowerCase();

export const formatCategory = (value?: string | null) => {
  const cleaned = (value ?? "").trim();
  if (!cleaned) return "Project";
  return cleaned
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export const formatDate = (value?: string | null) => {
  const date = new Date(value ?? "");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
