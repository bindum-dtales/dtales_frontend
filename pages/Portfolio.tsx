import { useEffect, useState } from "react";
import { getPortfolio } from "../src/lib/portfolioApi";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();

        console.log("Portfolio DATA:", data);

        // Accept empty array as valid
        if (!Array.isArray(data)) {
          console.error("Invalid response format:", data);
          setPortfolio([]);
          return;
        }

        setPortfolio(data);

      } catch (err) {
        console.error("REAL ERROR:", err);
        setPortfolio([]); // fallback instead of error UI
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {portfolio.length === 0 ? (
        <p>No portfolio items available</p>
      ) : (
        portfolio.map((item: any) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
          </div>
        ))
      )}
    </div>
  );
}
