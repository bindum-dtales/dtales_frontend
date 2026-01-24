import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers, ArrowRight } from "lucide-react";
import { apiFetch } from "../src/lib/api";

type CaseStudy = {
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

const CaseStudies: React.FC = () => {
	const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch<CaseStudy[]>("/api/case-studies/public")
			.then(setCaseStudies)
			.catch((e) => setError(e.message || "Failed to load case studies"))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="pt-28 pb-24 min-h-screen bg-white px-6">
			<div className="max-w-4xl mx-auto text-center mb-20">
				<motion.h1
					className="text-6xl md:text-7xl font-bold text-dtales-navy mb-6 tracking-tight"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					Case Studies
				</motion.h1>
				<motion.p
					className="text-xl text-gray-500"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					Real results from our documentation and content-first approach.
				</motion.p>
			</div>

			{loading && (
				<div className="text-center text-gray-500">Loading case studies...</div>
			)}

			{error && (
				<div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-xl py-3 px-4 max-w-2xl mx-auto">
					{error}
				</div>
			)}

			{!loading && !error && caseStudies.length === 0 && (
				<div className="text-center text-gray-500">No case studies found.</div>
			)}

		<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
			{caseStudies.map((caseStudy) => (
				<motion.div
						key={caseStudy.id}
						className="bg-[#F5F5F7] p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-200 flex flex-col gap-4"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
							<Layers size={26} />
						</div>

					{caseStudy.cover_image_url && (
						<Link to={`/case-studies/${caseStudy.id}`}>
							<img
								src={caseStudy.cover_image_url}
								alt={caseStudy.title}
								className="w-full h-auto object-contain rounded-2xl bg-gray-50"
							/>
						</Link>
					)}						<Link to={`/case-studies/${caseStudy.id}`}>
							<h2 className="text-2xl font-bold text-black leading-snug">
								{caseStudy.title}
							</h2>
						</Link>

						<p className="text-gray-500 text-sm">
							{new Date(caseStudy.created_at).toLocaleDateString()}
						</p>

						<p className="text-gray-600 text-lg leading-relaxed">
						{caseStudy.excerpt || getExcerpt(caseStudy.content)}
					</p>

					<div className="flex items-center justify-between mt-auto pt-2">
						<span className="text-sm text-blue-800 font-semibold">
							{caseStudy.slug}
						</span>
						<Link
							to={`/case-studies/${caseStudy.id}`}
							className="text-dtales-navy font-semibold hover:underline flex items-center gap-2"
						>
							Read More <ArrowRight size={18} />
						</Link>
					</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default CaseStudies;
