import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PORTFOLIO_CAPABILITIES } from "../../data/capabilities";
import penImage from "@/src/assets/pen.png";
import graphImage from "@/src/assets/graph.png";
import bookImage from "@/src/assets/book.png";
import cameraImage from "@/src/assets/camera.png";
import laptopImage from "@/src/assets/laptop.png";

const CARD_IMAGES: Record<string, string> = {
  "Product Marketing": penImage,
  "Sales Enablement": graphImage,
  "Technical Documentation": bookImage,
  "Product Experience": cameraImage,
  "Digital Experience": laptopImage,
};

// Bounded by whichever dimension keeps each asset's own aspect ratio compact
// (several are taller than they are wide), so a shared width/height cap can't
// be used across all five. Each ramps down for tablet/mobile so it keeps
// shrinking proportionally below the stated (desktop) maximum. Position is
// per-title too: Sales Enablement and Technical Documentation sit ~12px
// closer to the right edge than the rest; Product Experience and Digital
// Experience sit further up from the bottom so their larger footprint
// clears the arrow button instead of sitting behind it.
const CARD_IMAGE_STYLE: Record<string, string> = {
  "Product Marketing": "h-auto w-auto max-h-[67px] md:max-h-[81px] lg:max-h-[95px] bottom-[18px] right-[18px]",
  "Sales Enablement": "h-auto w-auto max-w-[84px] md:max-w-[102px] lg:max-w-[120px] bottom-[18px] right-[3px]",
  "Technical Documentation": "h-auto w-auto max-h-[88px] md:max-h-[107px] lg:max-h-[125px] bottom-[18px] right-[3px]",
  "Product Experience": "h-auto w-auto max-h-[48px] md:max-h-[58px] lg:max-h-[68px] bottom-[68px] right-[18px]",
  "Digital Experience": "h-auto w-auto max-w-[76px] md:max-w-[92px] lg:max-w-[108px] bottom-[68px] right-[18px]",
};

// These titles otherwise stay on one line at wide desktop widths; capping
// their width forces the same natural two-line wrap "Technical Documentation"
// already gets. Left untouched: a shared cap can't fit both this set and
// "Technical Documentation" (whose second word alone is wider than the full
// "GTM Strategy" phrase), so the two card titles are handled separately.
const TWO_LINE_TITLES = new Set([
  "Product Marketing",
  "Sales Enablement",
  "Digital Experience",
  "GTM Strategy",
]);

export function CapabilityCards() {
  return (
    <div>
      {/* Eyebrow */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
        Browse by Capability
      </p>

      {/* Heading */}
      <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
        What we create
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {PORTFOLIO_CAPABILITIES.map(({ number, title, description, bullets, href }) => (
          <Link
            key={number}
            to={href}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 pb-14 shadow-sm"
          >
            <span className="text-xs font-medium text-neutral-400">
              {number}
            </span>
            <h3
              className={`mt-4 text-xl font-bold tracking-tight text-neutral-950 ${
                TWO_LINE_TITLES.has(title) ? "lg:max-w-[115px]" : ""
              }`}
            >
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              {description}
            </p>
            <ul className="mt-4 space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="text-xs text-neutral-500">
                  • {bullet}
                </li>
              ))}
            </ul>

            {CARD_IMAGES[title] && (
              <img
                src={CARD_IMAGES[title]}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute object-contain ${CARD_IMAGE_STYLE[title]}`}
              />
            )}

            <span
              aria-hidden="true"
              className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700"
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
