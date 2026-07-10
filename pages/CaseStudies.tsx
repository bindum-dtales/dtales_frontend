import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getCaseStudies } from "@/lib/api";
import { getCache, saveCache } from "../src/lib/cache";
import ContentCard from "../components/ContentCard";
import SEO from '../components/seo/SEO';
import CollectionPageSchema from '../components/seo/CollectionPageSchema';

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

const CASE_STUDIES_CACHE_KEY = "case_studies_cache";

const CaseStudies: React.FC = () => {
	const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const searchTerm = new URLSearchParams(location.search).get('search')?.trim().toLowerCase() || '';

	useEffect(() => {
        let isActive = true;

        const fetchCaseStudies = async (initialLoad = false) => {
            if (initialLoad) {
                setLoading(true);
			setError(null);
            }

			try {
                const data = await getCaseStudies();
                const safeCaseStudies = Array.isArray(data) ? data : [];

                console.log("Case Studies API response:", data);

                if (isActive) {
                    setCaseStudies(safeCaseStudies);
                    if (safeCaseStudies.length > 0) {
                        saveCache(CASE_STUDIES_CACHE_KEY, safeCaseStudies);
                    }
				}
            } catch (err: any) {
                console.error("Case Studies API error:", err);

                let cached = getCache<CaseStudy[]>(CASE_STUDIES_CACHE_KEY);

                console.error("Case Studies API failed, checking cache");

                if (isActive) {
                    if (Array.isArray(cached)) {
                        setCaseStudies(cached);
                    }

                    if (initialLoad && !Array.isArray(cached)) {
                        setError("Failed to load case studies. Please try again later.");
                    }
				}
            } finally {
                if (initialLoad && isActive) {
                    setLoading(false);
                }
			}
		};

        fetchCaseStudies(true);
        const intervalId = setInterval(() => {
            fetchCaseStudies(false);
        }, 30000);

        return () => {
            isActive = false;
            clearInterval(intervalId);
        };
	}, []);

	const filteredCaseStudies = searchTerm
		? caseStudies.filter((caseStudy) => {
			const haystack = `${caseStudy.title} ${caseStudy.excerpt || ''} ${caseStudy.content || ''}`.toLowerCase();
			return haystack.includes(searchTerm);
		})
		: caseStudies;

    return (
        <div className="min-h-screen bg-gray-50 px-4 pb-20 pt-24">
            <SEO
                title="Case Studies | DTALES Tech"
                description="Explore DTALES Tech case studies and documentation-led transformations for B2B technology teams."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Case Studies', url: '/case-studies' },
                ]}
            >
                <CollectionPageSchema
                    path="/case-studies"
                    name="Case Studies"
                    description="Documentation-led transformations and outcomes from DTALES Tech clients."
                    items={filteredCaseStudies.map((caseStudy) => ({
                        name: caseStudy.title,
                        url: `/case-studies/${caseStudy.id}`,
                        image: caseStudy.cover_image_url || undefined,
                        description: caseStudy.excerpt || getExcerpt(caseStudy.content),
                    }))}
                />
            </SEO>
            <div className="mx-auto max-w-5xl text-center mb-16">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Case Studies
                </motion.h1>
                <motion.p
                    className="mt-4 text-lg text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Documentation-led transformations and outcomes from DTALES Tech clients.
                </motion.p>
            </div>

            {loading && caseStudies.length === 0 && (
                <div className="mx-auto max-w-2xl text-center text-gray-600 bg-white border border-gray-200 rounded-2xl py-4 px-6">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
                    Loading case studies...
                </div>
            )}

            {!loading && error && (
                <div className="mx-auto max-w-2xl text-center text-red-600 bg-red-50 border border-red-200 rounded-2xl py-4 px-6">
                    {error}
                </div>
            )}

            {!loading && !error && filteredCaseStudies.length === 0 && (
                <div className="mx-auto max-w-2xl text-center text-gray-600 bg-white border border-gray-200 rounded-2xl py-4 px-6">
                    No case studies found.
                </div>
            )}

            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCaseStudies.map((caseStudy) => (
                    <ContentCard
                        key={caseStudy.id}
                        title={caseStudy.title}
                        excerpt={caseStudy.excerpt || getExcerpt(caseStudy.content)}
                        coverImageUrl={caseStudy.cover_image_url || undefined}
                        date={caseStudy.created_at}
                        category="Case Study"
                        href={`/case-studies/${caseStudy.id}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CaseStudies;
