import { ArrowRight, Building2 } from "lucide-react";
import { getProxiedImageUrl } from "../../../src/utils/imageProxy";
import type { ContentCardItem } from "../types";

type ContentCardProps = {
  item: ContentCardItem;
};

export function ContentCard({ item }: ContentCardProps) {
  const imageSrc = getProxiedImageUrl(item.cover_image_url) || item.cover_image_url;

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
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-800 backdrop-blur">
            {item.subcategory}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {item.company_name ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <Building2 className="h-3.5 w-3.5" />
            {item.company_name}
          </span>
        ) : null}

        <h3 className="text-base font-bold leading-snug text-neutral-950">
          {item.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500">
          {item.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#0020BF]">
          View Project
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </span>
      </div>
    </>
  );

  const className =
    "group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl";

  if (item.link) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>
        {cardBody}
      </a>
    );
  }

  return <div className={className}>{cardBody}</div>;
}
