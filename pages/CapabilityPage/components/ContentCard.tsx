import { ArrowRight, Building2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getProxiedImageUrl } from "../../../src/utils/imageProxy";
import { resolvePortfolioTarget } from "../../../src/lib/portfolioLinks";
import type { ContentCardItem } from "../types";

type ContentCardProps = {
  item: ContentCardItem;
};

const CARD_CLASS_NAME =
  "group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl";

export function ContentCard({ item }: ContentCardProps) {
  const location = useLocation();
  const imageSrc = getProxiedImageUrl(item.cover_image_url) || item.cover_image_url;

  // External links, uploaded attachments and "nothing yet" are resolved in one
  // shared place so every portfolio surface behaves the same way.
  const target = resolvePortfolioTarget(item);

  const cardBody = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        {item.cover_image_url ? (
          <img
            src={imageSrc}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 to-blue-900" />
        )}
        {item.subcategory && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-800 backdrop-blur">
            {item.subcategory}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {item.company_name ? (
          <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-neutral-600">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            {item.company_name}
          </span>
        ) : null}

        <h3 className="break-words text-base font-bold leading-snug text-neutral-950">
          {item.title}
        </h3>

        <p className="line-clamp-2 break-words text-sm leading-relaxed text-neutral-500">
          {item.description}
        </p>

        {target.kind !== "none" ? (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#0020BF]">
            {target.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </span>
        ) : (
          <span className="mt-auto inline-flex items-center pt-2 text-sm font-medium text-neutral-400">
            Project details coming soon
          </span>
        )}
      </div>
    </>
  );

  if (target.kind === "external") {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className={CARD_CLASS_NAME}>
        {cardBody}
      </a>
    );
  }

  if (target.kind === "internal") {
    return (
      <Link
        to={target.to}
        state={{ from: location.pathname }}
        className={CARD_CLASS_NAME}
      >
        {cardBody}
      </Link>
    );
  }

  return <div className={CARD_CLASS_NAME}>{cardBody}</div>;
}
