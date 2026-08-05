import { ArrowRight, Play } from "lucide-react";
import {
  HERO_EYEBROW,
  HERO_HEADING,
  HERO_DESCRIPTION,
  HERO_PRIMARY_CTA,
  HERO_SECONDARY_CTA,
} from "../../data/hero";

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
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#0020BF] px-6 py-3 text-sm font-semibold text-white"
        >
          {HERO_PRIMARY_CTA}
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300">
            <Play className="h-3.5 w-3.5" />
          </span>
          {HERO_SECONDARY_CTA}
        </button>
      </div>
    </div>
  );
}
