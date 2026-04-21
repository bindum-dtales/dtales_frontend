import { useEffect, useState } from "react";

const API_URL = "https://dtales.tech/api/portfolio";

export default function Portfolio() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("Failed response");
        }

        const json = await res.json();

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
