import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import { apiFetch } from "../src/lib/api";
import CoverImage from "../components/CoverImage";
import SEO from '../components/seo/SEO';
import ArticleSchema from '../components/seo/ArticleSchema';
import { buildRouteUrl } from '../src/config/site';

type PortfolioDetail = {
  id: string;
  title: string;
  company_name?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  content?: string | null;
  created_at?: string;
};

const PortfolioDetails: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    console.log("Portfolio Details API fetch:", `/api/portfolio/${id}`);
    apiFetch<PortfolioDetail>(`/api/portfolio/${id}`)
      .then((data) => {
        console.log("Portfolio Details API response:", data);
        setItem(data);
      })
      .catch((e) => {
        console.error("Portfolio Details API error:", e);
        setError(e.message || "Failed to load portfolio item");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
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
            modifiedTime={item.created_at}
          >
            <ArticleSchema
              path={`/portfolio/${id}`}
              headline={item.title}
              bodyHtml={item.content || undefined}
              image={item.cover_image_url}
              datePublished={item.created_at}
              dateModified={item.created_at}
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
        {/* Back Button */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-dtales-navy font-semibold hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Portfolio
        </Link>

        {loading && (
          <div className="text-center text-gray-600 bg-white border border-gray-200 rounded-[2rem] py-6 px-5">
            Loading project...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-[2rem] py-6 px-5">
            {error}
          </div>
        )}

        {!loading && !error && !item && (
          <div className="text-center text-gray-600 bg-white border border-gray-200 rounded-[2rem] py-6 px-5">
            Project not found.
          </div>
        )}

        {!loading && !error && item && (
          <motion.article
            className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight mb-6 tracking-tight">
                {item.title}
              </h1>
              {item.company_name && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 size={18} />
                  <span className="text-base">{item.company_name}</span>
                </div>
              )}
            </header>

            {/* Cover Image */}
            <CoverImage src={item.cover_image_url} alt={item.title} />

            {/* Description */}
            {item.description && (
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {item.description}
              </p>
            )}

            {/* Content */}
            {item.content ? (
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-black prose-strong:font-bold
                  prose-ul:text-gray-700 prose-ol:text-gray-700
                  prose-li:text-gray-700 prose-li:leading-relaxed
                  prose-img:rounded-2xl prose-img:shadow-md
                  prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl"
                  dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No content available.</p>
            )}
          </motion.article>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetails;
