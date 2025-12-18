import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
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
    <div className="min-h-screen bg-[#F5F5F7] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/blogs" 
          className="inline-flex items-center gap-2 text-dtales-navy font-semibold hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>

        {loading && (
          <div className="text-center text-gray-600 bg-white border border-gray-200 rounded-[2rem] py-6 px-5">
            Loading blog...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-[2rem] py-6 px-5">
            {error}
          </div>
        )}

        {!loading && !error && !blog && (
          <div className="text-center text-gray-600 bg-white border border-gray-200 rounded-[2rem] py-6 px-5">
            Blog not found.
          </div>
        )}

        {!loading && !error && blog && (
          <motion.article 
            className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight mb-6 tracking-tight">
                {blog.title}
              </h1>
              {blog.created_at && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={18} />
                  <time className="text-base">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
            </header>

            {/* Cover Image */}
            {blog.cover_image_url && (
              <div className="mb-10 overflow-hidden rounded-3xl">
                <img
                  src={blog.cover_image_url}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-black prose-strong:font-bold
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:text-gray-700 prose-li:leading-relaxed
                prose-img:rounded-2xl prose-img:shadow-md
                prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: blog.content?.html || "" }}
            />
          </motion.article>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;



