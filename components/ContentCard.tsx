import React from "react";
import { Link } from "react-router-dom";

export type ContentCardProps = {
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  date?: string | null;
  category: "Blog" | "Case Study";
  href: string;
};

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  excerpt,
  coverImageUrl,
  date,
  category,
  href,
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link to={href} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0020BF] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
      <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-[16/9] w-full bg-gray-100">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
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
              Read more ->
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
