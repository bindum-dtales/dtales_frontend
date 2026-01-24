import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { apiDelete, apiFetch } from "../src/lib/api";

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

const AdminCaseStudiesManage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setError(null);
    try {
      const data = await apiFetch<CaseStudy[]>("/api/case-studies");
      setCases(data);
    } catch (e: any) {
      setError(e.message || "Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    try {
      await apiDelete(`/api/case-studies/${id}`);
      fetchCases();
    } catch (e: any) {
      setError(e.message || "Failed to delete case study");
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Case Studies</h1>
          <button
            onClick={() => navigate("/admin/case-studies/new")}
            className="bg-[#0020BF] hover:bg-[#0b2be0] text-white px-5 py-2 rounded-xl shadow-sm"
          >
            + New Case Study
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        ) : cases.length === 0 ? (
          <p className="text-gray-600">No case studies found.</p>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="text-gray-900 font-medium">{c.title}</p>
                  <p className="text-gray-500 text-sm">{c.slug}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.published
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {c.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/case-studies/edit/${c.id}`)}
                    className="text-[#0020BF] hover:text-[#0b2be0]"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCaseStudiesManage;
