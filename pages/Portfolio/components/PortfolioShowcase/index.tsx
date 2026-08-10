import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePortfolioProjects } from "../../hooks/usePortfolioProjects";
import { FilterBar } from "./FilterBar";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { PAGE_SIZE, normalizeCategory, type PortfolioFilter } from "./constants";

const SKELETON_COUNT = 6;

export function PortfolioShowcase() {
  const { projects, loading, error, retry } = usePortfolioProjects();
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;

    return projects.filter(
      (item) => normalizeCategory(item.capability) === normalizeCategory(activeFilter)
    );
  }, [activeFilter, projects]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div>
      {/* Eyebrow + Heading + Description (spacing matches Hero) */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
        Our Work
      </p>
      <h2 className="mt-4 text-5xl font-bold leading-[1.1] tracking-tight text-neutral-950 sm:text-6xl">
        Selected Projects
      </h2>
      <p className="mt-6 max-w-md text-sm leading-7 text-neutral-500 sm:text-base">
        A curated selection of documentation, product marketing and digital
        experiences we've built for technology companies.
      </p>

      {/* Filter Bar */}
      <div className="mt-10">
        <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Grid / Loading / Empty */}
      {loading && (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-500">
            Something went wrong loading projects.
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

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 rounded-3xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-base font-semibold text-neutral-950">
            No projects found
          </p>
          <p className="text-sm text-neutral-500">
            Try a different category to see more work.
          </p>
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % PAGE_SIZE) * 0.06 }}
              >
                <ProjectCard item={item} />
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition-all duration-300 ease-out hover:border-[#0020BF] hover:text-[#0020BF] hover:shadow-sm"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
