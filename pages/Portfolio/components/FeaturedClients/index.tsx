import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedCaseStudies } from "../../hooks/useFeaturedCaseStudies";
import { FeaturedClientCard } from "./FeaturedClientCard";
import { FeaturedClientSkeleton } from "./FeaturedClientSkeleton";

const SKELETON_COUNT = 4;

export function FeaturedClients() {
  const { caseStudies, loading, error, retry } = useFeaturedCaseStudies();

  return (
    <div>
      {/* Eyebrow */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
        Featured Clients
      </p>

      {/* Heading */}
      <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
        Case studies that show real outcomes
      </h2>

      <div className="mt-8 border-t border-neutral-200" />

      <div className="mt-8 flex flex-col gap-4">
        {loading &&
          Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <FeaturedClientSkeleton key={index} />
          ))}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white py-12 text-center">
            <p className="text-sm text-neutral-500">
              Something went wrong loading case studies.
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

        {!loading && !error && caseStudies.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white py-12 text-center text-sm text-neutral-500">
            No Case Studies Yet
          </div>
        )}

        {!loading &&
          !error &&
          caseStudies.map((caseStudy) => (
            <FeaturedClientCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
      </div>

      <Link
        to="/case-studies"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0020BF]"
      >
        View All Case Studies
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
