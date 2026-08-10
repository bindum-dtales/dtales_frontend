import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { ContentCard } from "./components/ContentCard";
import { ContentCardSkeleton } from "./components/ContentCardSkeleton";
import { Pagination } from "./components/Pagination";
import { useCapabilityPortfolio } from "./hooks/useCapabilityPortfolio";
import { useCapabilityBlogs } from "./hooks/useCapabilityBlogs";
import { PAGE_SIZE } from "./constants";
import type { CapabilityCta, CapabilitySubcategory, ContentCardItem } from "./types";

export type CapabilityPageTemplateProps = {
  capability: string;
  subcategories: CapabilitySubcategory[];
  activeSubcategory: string;
  cta: CapabilityCta;
};

const SKELETON_COUNT = 8;
const BLOGS_SUBCATEGORY = "Blogs";
const PRODUCT_MARKETING_CAPABILITY = "Product Marketing";

export function CapabilityPageTemplate({
  capability,
  subcategories,
  activeSubcategory,
  cta,
}: CapabilityPageTemplateProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState(activeSubcategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isBlogsSubcategory =
    capability === PRODUCT_MARKETING_CAPABILITY && selectedSubcategory === BLOGS_SUBCATEGORY;

  const portfolio = useCapabilityPortfolio(capability);
  const blogs = useCapabilityBlogs(isBlogsSubcategory);
  const { items, loading, error, retry } = isBlogsSubcategory ? blogs : portfolio;

  const subcategoryItems: ContentCardItem[] = useMemo(() => {
    if (isBlogsSubcategory) return items;
    return items.filter((item) => item.subcategory === selectedSubcategory);
  }, [items, selectedSubcategory, isBlogsSubcategory]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return subcategoryItems;

    return subcategoryItems.filter((item) =>
      [item.title, item.description, item.company_name]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [subcategoryItems, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubcategory, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="bg-[#FCFCFD]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar
          subcategories={subcategories}
          activeSubcategory={selectedSubcategory}
          cta={cta}
          onSelect={setSelectedSubcategory}
        />

        <div className="min-w-0 flex-1 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <main className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:px-8 lg:px-12">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            {loading && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <ContentCardSkeleton key={index} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white py-16 text-center">
                <p className="text-sm text-neutral-500">
                  Something went wrong loading this content.
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="text-sm font-semibold text-[#0020BF]"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white py-16 text-center">
                <p className="text-base font-semibold text-neutral-950">
                  No content found
                </p>
                <p className="text-sm text-neutral-500">
                  Try a different subcategory or search term.
                </p>
              </div>
            )}

            {!loading && !error && filteredItems.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {pageItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ContentCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
