import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../src/lib/api";

type Blog = {
  id: string;
  title: string;
  cover_image_url?: string | null;
  content?: { html?: string };
  created_at?: string;
};

const BlogDetails: React.FC = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch<Blog>(`/api/blogs/${id}`)
      .then(setBlog)
      .catch((e) => setError(e.message || "Failed to load blog"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="text-center text-gray-300 bg-white/5 border border-white/10 rounded-xl py-4 px-5">
            Loading blog...
          </div>
        )}

        {error && (
          <div className="text-center text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl py-4 px-5">
            {error}
          </div>
        )}

        {!loading && !error && !blog && (
          <div className="text-center text-gray-300">Blog not found.</div>
        )}

        {!loading && !error && blog && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
              {blog.created_at && (
                <p className="text-sm text-gray-400">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {blog.cover_image_url && (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img
                  src={blog.cover_image_url}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-invert prose-lg max-w-none text-gray-100"
              dangerouslySetInnerHTML={{ __html: blog.content?.html || "" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;



