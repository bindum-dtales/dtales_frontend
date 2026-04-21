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

        if (!data || data.length === 0) {
          setPortfolio([]);
          return;
        }

        setPortfolio(data);
      } catch (err) {
        console.error("Portfolio error:", err);
        setPortfolio([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {portfolio.map((item: any) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  );
}
