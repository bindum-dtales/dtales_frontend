import { useCallback, useEffect, useState } from "react";
import { getCaseStudies } from "@/lib/api";

export type FeaturedCaseStudy = {
  id: string;
  title: string;
  slug: string;
  company_name?: string | null;
  cover_image_url?: string | null;
  excerpt: string;
  content?: string;
  published: boolean;
  created_at: string;
};

const FEATURED_COUNT = 4;

export function useFeaturedCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<FeaturedCaseStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCaseStudies();
      const safeCaseStudies: FeaturedCaseStudy[] = Array.isArray(data) ? data : [];

      const latest = safeCaseStudies
        .filter((caseStudy) => caseStudy.published)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, FEATURED_COUNT);

      setCaseStudies(latest);
    } catch (err) {
      console.error("Featured case studies fetch failed:", err);
      setError("Failed to load case studies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { caseStudies, loading, error, retry: fetchFeatured };
}
