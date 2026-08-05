import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PORTFOLIO_CAPABILITIES } from "../../data/capabilities";

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
            className="relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-7 pb-14 shadow-sm"
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
