import { useEffect, useState } from "react";
import { apiFetch } from "../src/lib/api";

export default function Portfolio() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const json = await apiFetch<any[]>("portfolio");

        if (!Array.isArray(json)) {
          throw new Error("Invalid data format");
        }

        setData(json);
      } catch (err) {
        console.error("Portfolio error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Failed to load portfolio.</p>;

  return (
    <div>
      {data.map((item: any) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  );
}
