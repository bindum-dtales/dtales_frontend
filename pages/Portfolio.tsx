import { useEffect, useState } from "react";
import { getPortfolio } from "@/lib/api";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolio();

        console.log("Portfolio DATA:", data);
        const portfolioData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : null;

        if (!portfolioData) {
          console.error("Invalid response format:", data);
        }

        setPortfolio(portfolioData || []);

      } catch (err) {
        console.error("REAL ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {portfolio && portfolio.length > 0 ? (
        portfolio.map((item: any) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
          </div>
        ))
      ) : (
        <p>No portfolio items available</p>
      )}
    </div>
  );
}
