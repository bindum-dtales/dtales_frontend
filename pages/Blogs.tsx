import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../src/lib/api";

type Blog = {
	id: string;
	title: string;
	slug: string;
	cover_image_url?: string | null;
	content?: { html?: string };
	published: boolean;
	created_at: string;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
const getExcerpt = (html?: string) => {
	const text = stripHtml(html || "");
	return text.length > 150 ? `${text.slice(0, 150)}…` : text;
};

const Blogs: React.FC = () => {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch<Blog[]>("/api/blogs/public")
			.then(setBlogs)
			.catch((e) => setError(e.message || "Failed to load blogs"))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="pt-28 pb-24 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
			<div className="max-w-6xl mx-auto px-6 space-y-10">
				<div className="text-center mb-6">
					<h1 className="text-4xl md:text-5xl font-bold text-white">
						Blogs
					</h1>
					<p className="text-gray-400 mt-3">
						Latest published insights from DTales Tech.
					</p>
				</div>

				{loading && (
					<div className="text-center text-gray-300">Loading blogs...</div>
				)}

				{error && (
					<div className="text-center text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl py-3 px-4">
						{error}
					</div>
				)}

				{!loading && !error && blogs.length === 0 && (
					<div className="text-center text-gray-300">No blogs found.</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{blogs.map((blog) => (
						<div
							key={blog.id}
							className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl flex flex-col gap-4"
						>
							{blog.cover_image_url && (
								<Link to={`/blogs/${blog.id}`}>
									<img
										src={blog.cover_image_url}
										alt={blog.title}
										className="w-full h-48 object-cover rounded-xl"
									/>
								</Link>
							)}

							<Link to={`/blogs/${blog.id}`}>
								<h2 className="text-2xl font-bold text-white leading-snug mb-2">
									{blog.title}
								</h2>
							</Link>

							<p className="text-gray-400 text-sm">
								{new Date(blog.created_at).toLocaleDateString()}
							</p>

							<p className="text-gray-300 text-base leading-relaxed">
								{getExcerpt(blog.content?.html)}
							</p>

							<div className="flex items-center justify-between pt-2">
								<span className="text-xs uppercase tracking-wide text-gray-400">
									{blog.slug}
								</span>
								<Link
									to={`/blogs/${blog.id}`}
									className="text-[#7fb0ff] hover:text-white transition-colors text-sm font-semibold"
								>
									Read More →
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Blogs;

