import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../src/config/api";
import { fetchWithRetry } from "../src/lib/fetchWithRetry";
import { getCache, saveCache } from "../src/lib/cache";
import ContentCard from "../components/ContentCard";

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

	useEffect(() => {
        let isActive = true;

        const fetchCaseStudies = async (initialLoad = false) => {
            if (initialLoad) {
                setLoading(true);
            }

            if (!API_BASE_URL) {
                const cached = getCache<CaseStudy[]>(CASE_STUDIES_CACHE_KEY);
                if (isActive) {
                    setCaseStudies(Array.isArray(cached) ? cached : []);
                    setLoading(false);
                }
                return;
            }

			try {
                const data = await fetchWithRetry<CaseStudy[]>(`${API_BASE_URL}/api/case-studies/public`);
                const safeCaseStudies = Array.isArray(data) ? data : [];

                if (isActive) {
                    setCaseStudies(safeCaseStudies);
                    saveCache(CASE_STUDIES_CACHE_KEY, safeCaseStudies);
				}
            } catch {
                const cached = getCache<CaseStudy[]>(CASE_STUDIES_CACHE_KEY);
                if (isActive) {
                    setCaseStudies(Array.isArray(cached) ? cached : []);
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

    return (
        <div className="min-h-screen bg-gray-50 px-4 pb-20 pt-24">
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

            {!loading && caseStudies.length === 0 && (
                <div className="mx-auto max-w-2xl text-center text-gray-600 bg-white border border-gray-200 rounded-2xl py-4 px-6">
                    No case studies found.
                </div>
            )}

            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {caseStudies.map((caseStudy) => (
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
