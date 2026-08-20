import React from "react";
import { Link } from "react-router-dom";
import { getProxiedImageUrl } from "../src/utils/imageProxy";

export type ContentCardProps = {
  title: string;
  companyName?: string | null;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  date?: string | null;
  category: "Blog" | "Case Study";
  /** In-app detail route, used when the record has no external link. */
  href: string;
  /**
   * External project URL. Present only for link-based records, which have no
   * document-derived content to show on the detail page, so the card opens the
   * external URL instead of `href`.
   */
  link?: string | null;
};

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  companyName,
  excerpt,
  coverImageUrl,
  date,
  category,
  href,
  link,
}) => {
  const externalHref = link?.trim() || null;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const cardClassName =
    "group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0020BF] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const cardBody = (
    <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-lg">
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        {coverImageUrl ? (
          <img
            src={getProxiedImageUrl(coverImageUrl) || coverImageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-400">
            No cover image
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0020BF] shadow-sm">
          {category}
        </span>
      </div>

      <div className="flex h-full flex-col gap-3 px-5 py-4">
        <h3
          className="text-lg font-semibold leading-snug text-gray-900"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>

        {companyName ? (
          <p className="text-sm text-gray-500">{companyName}</p>
        ) : null}

        {excerpt ? (
          <p
            className="text-sm leading-relaxed text-gray-600"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        ) : (
          <p className="text-sm text-gray-500">No summary available.</p>
        )}

        <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
          {formattedDate ? <span>{formattedDate}</span> : <span>—</span>}
          <span className="inline-flex items-center gap-1 font-semibold text-[#0020BF] transition-all duration-150 group-hover:gap-2">
            {externalHref ? "View Project" : "Read more"} &rarr;
          </span>
        </div>
      </div>
    </div>
  );

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {cardBody}
      </a>
    );
  }

  return (
    <Link to={href} className={cardClassName}>
      {cardBody}
    </Link>
  );
};

export default ContentCard;
