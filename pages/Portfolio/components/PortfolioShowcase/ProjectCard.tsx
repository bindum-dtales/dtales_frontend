import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
import { getProxiedImageUrl } from "../../../../src/utils/imageProxy";
import type { PortfolioItem } from "../../../../src/lib/portfolioApi";
import { resolvePortfolioTarget } from "../../../../src/lib/portfolioLinks";
import { formatCategory, formatDate } from "./constants";

type ProjectCardProps = {
  item: PortfolioItem;
};

export function ProjectCard({ item }: ProjectCardProps) {
  const location = useLocation();
  const categoryLabel = formatCategory(item.capability);
  const date = formatDate(item.created_at);
  const imageSrc = getProxiedImageUrl(item.cover_image_url) || item.cover_image_url;

  // External links, uploaded attachments and "nothing yet" are resolved in one
  // shared place so every portfolio surface behaves the same way.
  const target = resolvePortfolioTarget(item);

  const cardBody = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        {item.cover_image_url ? (
          <img
            src={imageSrc}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-xs font-medium text-neutral-400">
            No image
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0020BF] backdrop-blur">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {item.company_name ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            <Building2 className="h-3.5 w-3.5" />
            {item.company_name}
          </span>
        ) : null}

        <h3 className="mt-2 text-lg font-bold tracking-tight text-neutral-950">
          {item.title}
        </h3>

        {item.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
            {item.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-6">
          {date ? (
            <span className="text-xs text-neutral-400">{date}</span>
          ) : (
            <span />
          )}
          {target.kind !== "none" ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0020BF]">
              {target.label}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </span>
          ) : (
            <span className="text-sm font-medium text-neutral-400">
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-2 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl";

  if (target.kind === "external") {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {cardBody}
      </a>
    );
  }

  if (target.kind === "internal") {
    return (
      <Link
        to={target.to}
        state={{ from: location.pathname }}
        className={className}
      >
        {cardBody}
      </Link>
    );
  }

  return <div className={className}>{cardBody}</div>;
}
