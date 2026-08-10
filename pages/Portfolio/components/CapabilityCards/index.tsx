import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PORTFOLIO_CAPABILITIES } from "../../data/capabilities";
import tecbgImage from "@/src/assets/tecbg.jpeg";
import probgImage from "@/src/assets/probg.png";
import marbgImage from "@/src/assets/marbg.jpeg";
import salbgImage from "@/src/assets/salbg.jpeg";
import digbgImage from "@/src/assets/digbg.jpeg";

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
  // Tailwind's `hover:`/`group-hover:` variants only fire on devices whose
  // primary input actually supports hover, so touch devices never get a
  // "stuck" flip from a tap. This flag exists purely to give those devices
  // an explicit tap-to-flip affordance instead: intercept the first tap to
  // flip the card, then let the second tap follow the link normally.
  const [canHover, setCanHover] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mediaQuery.matches);
  }, []);

  const handleCardClick = (event: React.MouseEvent, number: string) => {
    if (canHover || flippedCards.has(number)) return;
    event.preventDefault();
    setFlippedCards((prev) => new Set(prev).add(number));
  };

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
        {PORTFOLIO_CAPABILITIES.map(({ number, title, description, bullets, href }) => {
          const isTechnicalDocumentation = title === "Technical Documentation";
          const isProductExperience = href === "/work/product-experience";
          const isProductMarketing = title === "Product Marketing";
          const isSalesEnablement = title === "Sales Enablement";
          const isDigitalExperience = title === "Digital Experience";
          const cardBgImage = isTechnicalDocumentation
            ? tecbgImage
            : isProductExperience
              ? probgImage
              : isProductMarketing
                ? marbgImage
                : isSalesEnablement
                  ? salbgImage
                  : isDigitalExperience
                    ? digbgImage
                    : undefined;
          return (
          <Link
            key={number}
            to={href}
            onClick={(event) => handleCardClick(event, number)}
            className="group block h-[340px] [perspective:1000px] sm:h-[360px] lg:h-[380px]"
          >
            <div
              className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${
                flippedCards.has(number) ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white bg-cover bg-center p-7 shadow-sm [backface-visibility:hidden]"
                style={cardBgImage ? { backgroundImage: `url(${cardBgImage})` } : undefined}
              >
                {cardBgImage && (
                  <div className="absolute inset-0 bg-white/55" aria-hidden="true" />
                )}
                <span className="relative text-xs font-medium text-neutral-400">
                  {number}
                </span>
                <h3
                  className={`relative mt-4 text-xl font-bold tracking-tight text-neutral-950 ${
                    TWO_LINE_TITLES.has(title) ? "lg:max-w-[115px]" : ""
                  }`}
                >
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-neutral-500">
                  {description}
                </p>

                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-[#0020BF]"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white bg-cover bg-center p-7 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={cardBgImage ? { backgroundImage: `url(${cardBgImage})` } : undefined}
              >
                {cardBgImage && (
                  <div className="absolute inset-0 bg-white/55" aria-hidden="true" />
                )}
                <span className="relative text-xs font-medium text-neutral-400">
                  {number}
                </span>
                <h3 className="relative mt-4 text-xl font-bold tracking-tight text-neutral-950">
                  {title}
                </h3>
                <ul className="relative mt-4 space-y-2.5">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="text-xs text-neutral-500">
                      • {bullet}
                    </li>
                  ))}
                </ul>

                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#0020BF] bg-[#0020BF] text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
