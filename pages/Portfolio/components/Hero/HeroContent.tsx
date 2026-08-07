import { ArrowRight } from "lucide-react";
import {
  HERO_EYEBROW,
  HERO_HEADING,
  HERO_DESCRIPTION,
  HERO_PRIMARY_CTA,
  HERO_PRIMARY_CTA_URL,
} from "../../data/hero";
import { Stats } from "../Stats";

export function HeroContent() {
  return (
    <div className="max-w-xl [transform:translateX(-48px)]">
      {/* Eyebrow */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
        {HERO_EYEBROW}
      </p>

      {/* Heading */}
      <h1 className="mt-4 text-5xl font-bold leading-[1.1] tracking-tight text-neutral-950 sm:text-6xl">
        {HERO_HEADING.line1}
        <br />
        <span className="text-[#0020BF]">{HERO_HEADING.highlight}</span>{" "}
        {HERO_HEADING.suffix}
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-md text-sm leading-7 text-neutral-500 sm:text-base">
        {HERO_DESCRIPTION}
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <a
          href={HERO_PRIMARY_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#0020BF] px-6 py-3 text-sm font-semibold text-white"
        >
          {HERO_PRIMARY_CTA}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <Stats />
      </div>
    </div>
  );
}
