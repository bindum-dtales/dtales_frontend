
import React from 'react';
import { useNavigate } from 'react-router-dom';

type ServiceSection = {
    number: string;
    category: string;
    heading: string;
    description: string;
    bullets: string[];
    outcomeLabel: string;
    outcomes: Array<{ metric: string; text: string }>;
    testimonial: {
        quote: string;
        author: string;
        role: string;
    };
};

const HERO_STATS = [
    { value: '70%', label: 'Faster campaign deployment' },
    { value: '3×', label: 'Content velocity, same budget' },
    { value: '150%', label: 'Increase in AI citation within 180 days' },
    { value: '14→3', label: 'Days production cycle' }
];

const SERVICE_SECTIONS: ServiceSection[] = [
    {
        number: '01',
        category: 'STRATEGY · CAMPAIGNS · SOCIAL',
        heading: 'Full Stack Product Marketing',
        description:
            'Your entire marketing function, without the headcount. From GTM strategy to launch execution to sustained social presence, DTALES Tech owns every deliverable from brief to distribution. When you share a product brief, we take it from there.',
        bullets: [
            'GTM strategy and multi-channel campaign architecture',
            'Complete launch kit (email, blog, landing page, social) in 24 hours',
            'Monthly social content calendar, derived from your technical assets (never manufactured from scratch)',
            'Ongoing account management: LinkedIn, newsletters, and beyond',
            'Technical and business track segmentation. Never cross-contaminated.'
        ],
        outcomeLabel: 'MEASURED OUTCOMES',
        outcomes: [
            { metric: '70%', text: 'Reduction in campaign deployment timelines' },
            { metric: '4×', text: 'Distribution footprint per asset, no added headcount' },
            { metric: '30%', text: 'Faster MQL to Closed-Won progression' }
        ],
        testimonial: {
            quote:
                'We went from a 3 week launch cycle to 4 days. DTALES handled us a complete, channel-ready kit the morning after our product brief call. Our sales team had collateral before the product was even announced internally.',
            author: 'Head of Marketing',
            role: 'Series B SaaS Company'
        }
    },
    {
        number: '02',
        category: 'MARKETING COPY · DEVELOPER DOCS · API REFERENCE',
        heading: 'Full Lifecycle Technical Content',
        description:
            'We bridge the gap between content that converts and documentation that retains. From whitepapers and battle cards to SDK guides and API references, written by people who can read the code. Every code block is tested before it’s published. No exceptions.',
        bullets: [
            'Technical whitepapers, solution briefs, and competitive battle cards',
            'Getting Started guides, SDK documentation, and API reference',
            'Code validation before any writing begins. Every snippet runs.',
            'Docs-as-Code CI/CD pipeline with GitHub-based linting',
            'TTFHW benchmark: new user achieves first successful API call in under 5 minutes'
        ],
        outcomeLabel: 'MEASURED OUTCOMES',
        outcomes: [
            { metric: '50%', text: 'Reduction in Time-to-First-Hello-World' },
            { metric: '35%', text: 'Drop in developer support ticket volume' },
            { metric: '25%', text: 'Faster enterprise deal closure via self-validating technical champions' }
        ],
        testimonial: {
            quote:
                'Our support queue dropped by a third within two months of the new docs going live. Devs were onboarding themselves. That\'s never happened before.',
            author: 'VP of Engineering',
            role: 'Network Infrastructure Management Platform'
        }
    },
    {
        number: '03',
        category: 'SEO · GEO · AEO',
        heading: 'AI-Era Search Visibility',
        description:
            "If an LLM can't find you, your buyers won't consider you. We write for Perplexity, Gemini, and OpenAI Search. Not 2019-era Google keywords. Your brand gets cited, recommended, and surfaced when high-intent buyers are actively comparing solutions.",
        bullets: [
            'Entity mapping and Knowledge Graph alignment',
            'Semantic content architecture optimized for LLM retrieval',
            'Prompt-response simulation across OpenAI, Claude, and Gemini APIs',
            'Programmatic JSON-LD schema deployment (Product, TechArticle, FAQ, SoftwareApplication)',
            'Weekly Citation Share of Voice reporting. A drop triggers immediate content injection.'
        ],
        outcomeLabel: 'MEASURED OUTCOMES',
        outcomes: [
            { metric: '150%', text: 'Increase in AI citation inclusion within 180 days' },
            { metric: '40%+', text: 'Increase in qualified inbound demos' },
            { metric: '0', text: 'Traffic dependency on zero-click search. Fully resilient.' }
        ],
        testimonial: {
            quote:
                "We asked Perplexity who the best vendors were in our space. We weren't on the list. Six months later, we're cited in the top three. That shift directly correlated with a 38% jump in demo requests.",
            author: 'CEO',
            role: 'Series B SaaS Company'
        }
    },
    {
        number: '04',
        category: 'EDITORIAL STRATEGY · PRODUCTION · PUBLISHING',
        heading: 'Fully-Managed Content Operations',
        description:
            "We take complete ownership of your content supply chain: from editorial planning through production, QA, and publishing. AI handles the structural heavy-lifting. Human editors ensure nothing goes out that isn't right. You get a live dashboard, not a status email.",
        bullets: [
            '90-day editorial roadmaps aligned to your product calendar and GEO/SEO targets',
            'Bi-weekly production sprints with a live client dashboard (briefed → in production → in review → published)',
            'AI-agent outlining + human-guided drafting with proprietary interview data injected',
            'Automated brand and technical linting: fact cross-reference, style compliance, hallucination flagging',
            'Human SME sign-off before every publish. No direct-from-LLM output, ever.'
        ],
        outcomeLabel: 'MEASURED OUTCOMES',
        outcomes: [
            { metric: '14→3', text: 'Days per production cycle' },
            { metric: '4×', text: 'Content velocity without budget increase' },
            { metric: '65%+', text: 'Internal gross margin. Operational efficiency built in.' }
        ],
        testimonial: {
            quote:
                "I stopped attending content review calls. Not because I didn't care, but because I didn't need to. The dashboard told me everything, and nothing shipped without passing the bar we set at the start.",
            author: 'Marketing Manager',
            role: 'Enterprise SaaS'
        }
    }
];

const Services: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white pt-24">
            <section className="px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
                <div className="mx-auto max-w-[1200px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">What We Do</p>
                    <h1 className="mt-6 max-w-5xl text-[clamp(2.2rem,5.4vw,5rem)] font-bold leading-[1.05] tracking-tight text-black">
                        Marketing & Content. Built on Tech.
                    </h1>
                    <p className="mt-8 max-w-3xl text-base leading-[1.8] text-gray-600 md:text-lg">
                        We run your entire content and marketing operation: Strategy, Execution, and Distribution, powered by AI,
                        governed by human judgment. No coordination overhead. No dark months.
                    </p>

                    <div className="mt-16 border-t border-gray-200" />

                    <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
                        {HERO_STATS.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl font-bold leading-none text-black md:text-4xl">{stat.value}</p>
                                <p className="mt-3 max-w-[14ch] text-sm leading-relaxed text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-20 md:px-10 md:pb-24 lg:px-14 lg:pb-28">
                <div className="mx-auto max-w-[1200px]">
                    {SERVICE_SECTIONS.map((section, index) => {
                        const reverse = index % 2 === 1;

                        return (
                            <div key={section.number}>
                                {index > 0 ? <div className="mb-14 border-t border-gray-200 pt-14 md:mb-16 md:pt-16" /> : null}

                                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                                    <div className={reverse ? 'lg:order-2' : ''}>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-blue-600">{section.number}</span>
                                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                                {section.category}
                                            </span>
                                        </div>
                                        <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
                                            {section.heading}
                                        </h2>
                                        <p className="mt-6 max-w-xl text-base leading-[1.8] text-gray-600 md:text-lg">{section.description}</p>

                                        <ul className="mt-8 space-y-4">
                                            {section.bullets.map((bullet) => (
                                                <li key={bullet} className="flex items-start gap-3 text-base leading-[1.8] text-gray-700 md:text-lg">
                                                    <span className="mt-3 inline-block h-px w-4 shrink-0 bg-blue-600" aria-hidden="true" />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={`space-y-6 ${reverse ? 'lg:order-1' : ''}`}>
                                        <div className="rounded-2xl bg-gray-50 p-7 md:p-8">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{section.outcomeLabel}</p>
                                            <div className="mt-7 space-y-6">
                                                {section.outcomes.map((outcome) => (
                                                    <div key={outcome.metric} className="grid grid-cols-[92px_1fr] gap-4 md:grid-cols-[110px_1fr]">
                                                        <p className="text-2xl font-bold leading-none text-black md:text-3xl">{outcome.metric}</p>
                                                        <p className="text-sm leading-[1.7] text-gray-600 md:text-base">{outcome.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
                                            <p className="text-base italic leading-[1.9] text-gray-700 md:text-lg">“{section.testimonial.quote}”</p>
                                            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-black">
                                                {section.testimonial.author}
                                            </p>
                                            <p className="mt-2 text-sm text-gray-500">{section.testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="bg-black px-6 py-20 text-center text-white md:px-10 md:py-24 lg:px-14 lg:py-28">
                <div className="mx-auto max-w-3xl">
                    <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                        AI is the engine. Humans are the steering wheel. We're the driver.
                    </h3>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-gray-300 md:text-lg">
                        Every deliverable that leaves DTALES Tech has been reviewed, tested, and signed off by a human. We use AI to
                        move faster. Not to lower the bar.
                    </p>
                </div>
            </section>

            <section className="px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
                <div className="mx-auto max-w-[1200px] rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                        <div>
                            <h3 className="text-3xl font-bold tracking-tight text-black md:text-4xl">Not sure where to start?</h3>
                            <p className="mt-6 max-w-2xl text-base leading-[1.8] text-gray-600 md:text-lg">
                                Most clients begin with a 30-minute Content Audit call. We look at what you have, where you're invisible to
                                AI search, and what's worth fixing first. No pitch. Just a clear picture of where you stand.
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:items-stretch">
                                <button
                                    className="w-full rounded-full bg-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-gray-800"
                                    onClick={() => navigate('/contact')}
                                    aria-label="Get in Touch"
                                >
                                    Book a Call
                                </button>
                                <button
                                    className="w-full rounded-full border border-gray-300 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:bg-gray-100"
                                    onClick={() => navigate('/portfolio')}
                                    aria-label="View Work"
                                >
                                    View Our Work
                                </button>
                            </div>
                            <p className="mt-4 text-center text-xs uppercase tracking-[0.14em] text-gray-500 lg:text-right">
                                Typically responds within one business day
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-gray-200 px-6 py-10 md:px-10 lg:px-14">
                <div className="mx-auto max-w-[1200px]">
                    <div className="flex flex-col gap-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
                        <p>© 2026 DTALES Tech. All rights reserved.</p>
                        <a href="mailto:contact@dtales.tech" className="hover:text-black">
                            contact@dtales.tech
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;