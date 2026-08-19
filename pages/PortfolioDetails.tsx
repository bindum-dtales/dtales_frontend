import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import { apiFetch } from "../src/lib/api";
import type { PortfolioItem } from "../src/lib/portfolioApi";
import { sanitizeHtml } from "../src/utils/sanitizeHtml";
import CoverImage from "../components/CoverImage";
import ProtectedViewer from "../components/ProtectedViewer";
import SEO from '../components/seo/SEO';
import ArticleSchema from '../components/seo/ArticleSchema';
import { buildRouteUrl } from '../src/config/site';

type PortfolioDetailsLocationState = {
  /** Route the visitor came from, so "Back" returns to the right library page. */
  from?: string;
};

const DEFAULT_BACK_PATH = "/portfolio";

const PortfolioDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as PortfolioDetailsLocationState | null;
  const backPath = state?.from || DEFAULT_BACK_PATH;

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    // The public portfolio API exposes the collection only, so the entry is
    // resolved from that same list rather than a dedicated detail endpoint.
    apiFetch<PortfolioItem[]>("/api/portfolio")
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : [];
        setItem(items.find((entry) => String(entry.id) === String(id)) ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Portfolio details fetch failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load portfolio item");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const safeContent = useMemo(() => sanitizeHtml(item?.content), [item?.content]);
  const tags = [item?.capability, item?.subcategory].filter(
    (value): value is string => Boolean(value && value.trim())
  );

  const backLink = (
    <Link
      to={backPath}
      className="group inline-flex min-h-[44px] items-center gap-2 font-semibold text-dtales-navy transition-colors hover:text-[#0020BF] sm:min-h-0"
    >
      <ArrowLeft
        size={20}
        className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
      />
      Back to Work Library
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {item ? (
          <SEO
            title={`${item.title} | DTALES Tech`}
            description={item.description || (item.content ? item.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155) : 'View this DTALES Tech portfolio project.')}
            image={item.cover_image_url || undefined}
            ogType="article"
            breadcrumbs={[
              { name: 'Home', url: buildRouteUrl('/') },
              { name: 'Portfolio', url: buildRouteUrl('/portfolio') },
              { name: item.title, url: buildRouteUrl(`/portfolio/${id}`) },
            ]}
            publishedTime={item.created_at}
            modifiedTime={item.updated_at || item.created_at}
          >
            <ArticleSchema
              path={`/portfolio/${id}`}
              headline={item.title}
              bodyHtml={item.content || undefined}
              image={item.cover_image_url}
              datePublished={item.created_at}
              dateModified={item.updated_at || item.created_at}
              schemaType="Article"
            />
          </SEO>
        ) : (
          <SEO
            title="Portfolio Details | DTALES Tech"
            description="View DTALES Tech portfolio project details."
            breadcrumbs={[
              { name: 'Home', url: buildRouteUrl('/') },
              { name: 'Portfolio', url: buildRouteUrl('/portfolio') },
            ]}
          />
        )}

        <div className="mb-6 sm:mb-8">{backLink}</div>

        {loading && (
          <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 sm:p-12">
            <div className="h-8 w-2/3 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-4 h-4 w-1/3 animate-pulse rounded-full bg-neutral-100" />
            <div className="mt-10 h-72 animate-pulse rounded-3xl bg-neutral-100" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-4 w-9/12 animate-pulse rounded-full bg-neutral-100" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[2.5rem] border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-base font-semibold text-red-700">
              We couldn&apos;t load this project.
            </p>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !item && (
          <div className="rounded-[2.5rem] border border-neutral-200 bg-white px-6 py-14 text-center">
            <p className="text-base font-semibold text-neutral-950">Project not found</p>
            <p className="mt-2 text-sm text-neutral-500">
              This project may have been moved or unpublished.
            </p>
            <div className="mt-6 flex justify-center">{backLink}</div>
          </div>
        )}

        {!loading && !error && item && (
          <ProtectedViewer>
            <motion.article
              className="rounded-3xl bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-10 lg:p-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <header className="mb-8">
                {(tags.length > 0 || item.featured) && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#0020BF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0020BF]"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.featured && (
                      <span className="rounded-full bg-neutral-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-700">
                        Featured
                      </span>
                    )}
                  </div>
                )}

                <h1 className="break-words text-[28px] font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
                  {item.title}
                </h1>

                {item.company_name && (
                  <div className="mt-5 flex items-start gap-2 text-gray-500">
                    <Building2 size={18} className="mt-0.5 shrink-0" />
                    <span className="break-words text-base">{item.company_name}</span>
                  </div>
                )}
              </header>

              {/* Cover Image */}
              <CoverImage src={item.cover_image_url} alt={item.title} />

              {/* Description */}
              {item.description && (
                <p className="mb-8 break-words text-base leading-relaxed text-gray-700 sm:text-lg">
                  {item.description}
                </p>
              )}

              {/* Converted document content */}
              {safeContent ? (
                <div
                  className="document-content"
                  dangerouslySetInnerHTML={{ __html: safeContent }}
                />
              ) : item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0020BF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#000F55]"
                >
                  Open project
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-neutral-700">
                    Project content is being prepared.
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    The details above are everything published for this project
                    so far. Please check back soon, or browse the rest of our work.
                  </p>
                  <div className="mt-6 flex justify-center">{backLink}</div>
                </div>
              )}
            </motion.article>
          </ProtectedViewer>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetails;
