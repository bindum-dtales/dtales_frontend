import { useCallback, useEffect, useState } from "react";
import { getAllPortfolio } from "../../../src/lib/portfolioApi";
import type { PortfolioItem } from "../../../src/lib/portfolioApi";

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllPortfolio();
      setProjects(data);
    } catch (err) {
      console.error("Portfolio projects fetch failed:", err);
      setError("Failed to load portfolio projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, retry: fetchProjects };
}
