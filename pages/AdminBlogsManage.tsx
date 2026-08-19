import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "../src/lib/api";
import SEO from '../components/seo/SEO';

type Blog = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

const AdminBlogsManage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // True once a GET has actually succeeded. "No blogs found." is gated on this
  // so it can only ever mean "the server really returned an empty list", never
  // "the request failed and we blanked the table".
  const [loadedOnce, setLoadedOnce] = useState(false);

  const fetchBlogs = async () => {
    setError(null);
    try {
      console.log("Admin: Fetching blogs...");
      const data = await apiFetch<Blog[]>("/api/blogs");
      console.log("Admin: Blogs API response:", data);
      if (!Array.isArray(data)) {
        // A non-array body is an anomaly, not an empty collection. Coercing it
        // to [] here would render as "No blogs found." and hide the fault.
        throw new Error("Unexpected response shape from /api/blogs");
      }
      setBlogs(data);
      setLoadedOnce(true);
    } catch (e: any) {
      console.error("Admin: Failed to load blogs:", e);
      setError(e.message || "Failed to load blogs");
      // Deliberately leaves `blogs` untouched so a failed refresh keeps
      // showing the last known good list instead of emptying the page.
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      console.log("Admin: Deleting blog:", id);
      await apiFetch<unknown>(`/api/blogs/${id}`, { method: "DELETE" });
      console.log("Admin: Blog deleted successfully");
      // Server-confirmed refresh rather than an optimistic local splice: the
      // list is only ever what the API reports.
      await fetchBlogs();
    } catch (e: any) {
      console.error("Admin: Failed to delete blog:", e);
      setError(e.message || "Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <SEO title="Manage Blogs | DTALES Tech" description="Manage DTALES Tech blog posts." noindex />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
          <button
            onClick={() => navigate("/admin/blogs/new")}
            className="bg-[#0020BF] hover:bg-[#0b2be0] text-white px-5 py-2 rounded-xl shadow-sm"
          >
            + New Blog
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <>
            {/* The error banner now sits above the list instead of replacing
                it, so a failed refresh reports the failure without wiping the
                blogs that are still on screen. */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {error}
              </div>
            )}
            {blogs.length === 0 && loadedOnce && !error ? (
              <p className="text-gray-600">No blogs found.</p>
            ) : blogs.length > 0 ? (
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="text-gray-900 font-medium">{blog.title}</p>
                      <p className="text-gray-500 text-sm">{blog.slug}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          blog.published
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/blogs/edit/${blog.id}`)
                        }
                        className="text-[#0020BF] hover:text-[#0b2be0]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBlogsManage;
