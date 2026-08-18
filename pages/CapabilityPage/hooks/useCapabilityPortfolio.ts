import { useCallback, useEffect, useState } from "react";
import { getAllPortfolio } from "../../../src/lib/portfolioApi";
import type { ContentCardItem } from "../types";

export function useCapabilityPortfolio(capability: string) {
  const [items, setItems] = useState<ContentCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllPortfolio();
      setItems(
        data
          .filter((item) => item.capability === capability)
          .map((item) => ({
            ...item,
            link: item.link ?? undefined,
            content: item.content ?? null,
          }))
      );
    } catch (err) {
      console.error("Capability portfolio fetch failed:", err);
      setError("Failed to load portfolio items.");
    } finally {
      setLoading(false);
    }
  }, [capability]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, retry: fetchItems };
}
