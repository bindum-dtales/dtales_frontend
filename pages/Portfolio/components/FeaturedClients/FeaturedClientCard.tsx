import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProxiedImageUrl } from "../../../../src/utils/imageProxy";
import type { FeaturedCaseStudy } from "../../hooks/useFeaturedCaseStudies";

type FeaturedClientCardProps = {
  caseStudy: FeaturedCaseStudy;
};

export function FeaturedClientCard({ caseStudy }: FeaturedClientCardProps) {
  return (
    <Link
      to={`/case-studies/${caseStudy.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 transition-colors duration-200 hover:border-neutral-300"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {caseStudy.cover_image_url ? (
          <img
            src={
              getProxiedImageUrl(caseStudy.cover_image_url) ||
              caseStudy.cover_image_url
            }
            alt={caseStudy.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-neutral-400">
            No image
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {caseStudy.company_name ? (
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
            {caseStudy.company_name}
          </span>
        ) : null}

        <h3 className="truncate text-sm font-semibold leading-snug text-neutral-950">
          {caseStudy.title}
        </h3>

        {/* Wrapping keeps the arrow inside the narrow sidebar column at ~1024px
            instead of pushing it past the viewport edge; at wider widths the
            label fits on one line and nothing changes. */}
        <span className="inline-flex min-w-0 flex-wrap items-center gap-1 text-xs font-semibold text-[#0020BF] transition-all duration-150 group-hover:gap-1.5">
          View Case Study
          <ArrowRight className="h-3 w-3 shrink-0" />
        </span>
      </div>
    </Link>
  );
}
