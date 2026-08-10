// Colors
export const PORTFOLIO_COLORS = {
  background: "#FCFCFD",
  accent: "#0020BF",
} as const;

// Spacing (rem, matches Tailwind's default 0.25rem step used across the module)
export const PORTFOLIO_SPACING = {
  xs: "0.375rem", // gap-1.5
  sm: "0.5rem", // gap-2
  md: "1rem", // gap-4 / px-4
  lg: "1.5rem", // gap-6 / px-6
  xl: "2rem", // gap-8 / px-8
  "2xl": "2.5rem", // gap-10 / pt-10
  "3xl": "3rem", // pt-12
  "4xl": "4rem", // pt-16 / py-16
  "5xl": "5rem", // py-20
  "6xl": "6rem", // py-24
} as const;

// Border radius
export const PORTFOLIO_RADIUS = {
  xl: "0.75rem", // rounded-xl
  "2xl": "1rem", // rounded-2xl
  full: "9999px", // rounded-full
} as const;

// Shadows (none currently used by the Portfolio module)
export const PORTFOLIO_SHADOWS = {} as const;

// Animation durations (none currently used by the Portfolio module)
export const PORTFOLIO_ANIMATION_DURATIONS = {} as const;

// Max container width
export const PORTFOLIO_MAX_CONTAINER_WIDTH = "80rem"; // max-w-7xl
