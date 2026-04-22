import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../src/lib/api";
import { getCache, saveCache } from "../src/lib/cache";
import ContentCard from "../components/ContentCard";

type Blog = {
	id: string;
	title: string;
	slug: string;
	cover_image_url?: string | null;
	excerpt: string;
	content?: string;
	published: boolean;
	created_at: string;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
const getExcerpt = (html?: string) => {
	const text = stripHtml(html || "");
	return text.length > 150 ? `${text.slice(0, 150)}…` : text;
};

const BLOGS_CACHE_KEY = "blogs_cache";

const Blogs: React.FC = () => {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
        let isActive = true;

        const fetchBlogs = async (initialLoad = false) => {
            if (initialLoad) {
                setLoading(true);
			setError(null);
            }

			try {
                const data = await apiFetch<Blog[]>("/blogs/public");
                const safeBlogs = Array.isArray(data) ? data : [];

                console.log("Blogs API response:", data);

                if (isActive) {
                    setBlogs(safeBlogs);
                    if (safeBlogs.length > 0) {
                        saveCache(BLOGS_CACHE_KEY, safeBlogs);
                    }
				}
            } catch (err: any) {
                console.error("Blogs API error:", err);

                let cached = getCache<Blog[]>(BLOGS_CACHE_KEY);

                console.error("Blogs API failed, checking cache");

                if (isActive) {
                    setBlogs(Array.isArray(cached) ? cached : []);

                    if (initialLoad && !Array.isArray(cached)) {
                        setError("Failed to load blogs. Please try again later.");
                    }
				}
            } finally {
                if (initialLoad && isActive) {
                    setLoading(false);
                }
			}
		};

        fetchBlogs(true);
        const intervalId = setInterval(() => {
            fetchBlogs(false);
        }, 30000);

        return () => {
            isActive = false;
            clearInterval(intervalId);
        };
	}, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 pb-20 pt-24">
            <div className="mx-auto max-w-5xl text-center mb-16">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Insights from DTALES Tech
                </motion.h1>
                <motion.p
                    className="mt-4 text-lg text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Practical guidance, product thinking, and documentation strategy for B2B technology teams.
                </motion.p>
            </div>

            {loading && blogs.length === 0 && (
                <div className="mx-auto max-w-2xl text-center text-gray-600 bg-white border border-gray-200 rounded-2xl py-4 px-6">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
                    Loading blogs...
                </div>
            )}

            {!loading && error && (
                <div className="mx-auto max-w-2xl text-center text-red-600 bg-red-50 border border-red-200 rounded-2xl py-4 px-6">
                    {error}
                </div>
            )}

            {!loading && !error && blogs.length === 0 && (
                <div className="mx-auto max-w-2xl text-center text-gray-600 bg-white border border-gray-200 rounded-2xl py-4 px-6">
                    No blogs found.
                </div>
            )}

            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {blogs.map((blog) => (
                    <ContentCard
                        key={blog.id}
                        title={blog.title}
                        excerpt={blog.excerpt || getExcerpt(blog.content)}
                        coverImageUrl={blog.cover_image_url || undefined}
                        date={blog.created_at}
                        category="Blog"
                        href={`/blogs/${blog.id}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Blogs;

