import { useEffect, useMemo, useState } from "react";
import heroOne from "@/src/assets/1.png";
import heroTwo from "@/src/assets/2.png";
import heroThree from "@/src/assets/3.png";
import heroFour from "@/src/assets/4.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.dtales.tech";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("VITE_API_BASE_URL not found, using fallback API");
}

type PortfolioCategory = "All" | "Web" | "Video" | "Branding";

type PortfolioItem = {
  id: number | string;
  title: string;
  category: string;
  cover_image_url: string;
  link?: string;
};

const heroSlides = [heroOne, heroTwo, heroThree, heroFour];
const filters: PortfolioCategory[] = ["All", "Web", "Video", "Branding"];

const normalizeCategory = (value: string) => value.trim().toLowerCase();

const formatCategory = (value: string) => {
  const cleaned = value.trim();
  if (!cleaned) return "Project";
  return cleaned
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export function HeroSlider() {
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const interval = window.setInterval(() => {
      setTrackIndex((prev) => prev - 1);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trackIndex !== 0) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setTransitionEnabled(false);
      setTrackIndex(heroSlides.length);

      window.setTimeout(() => {
        setTransitionEnabled(true);
      }, 40);
    }, 700);

    return () => window.clearTimeout(resetTimer);
  }, [trackIndex]);

  const extendedSlides = [heroSlides[heroSlides.length - 1], ...heroSlides, heroSlides[0]];

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      <div className="relative h-[62vh] sm:h-[68vh] lg:h-[78vh]">
        <div
          className={`flex h-full w-full ${
            transitionEnabled ? "transition-transform duration-700 ease-in-out" : "transition-none"
          }`}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
        >
          {extendedSlides.map((src, index) => (
            <div key={`${src}-${index}`} className="relative h-full w-full flex-shrink-0">
              <img src={src} alt={`Portfolio hero ${index + 1}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_35%)]" />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div
            className={`max-w-3xl rounded-3xl border border-white/10 bg-black/25 px-6 py-8 text-center shadow-2xl shadow-black/20 backdrop-blur-md sm:px-10 sm:py-12 transition-all duration-700 ease-out ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Selected Work</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Portfolio
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              A curated showcase of web, video, and branding projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type FilterBarProps = {
  activeFilter: PortfolioCategory;
  onChange: (filter: PortfolioCategory) => void;
};

export function FilterBar({ activeFilter, onChange }: FilterBarProps) {
  return (
    <div className="flex w-full justify-center px-4 pt-8 sm:px-6 lg:px-8">
      <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white/90 p-2 shadow-sm backdrop-blur">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onChange(filter)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                isActive
                  ? "bg-neutral-950 text-white shadow-md shadow-black/15"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type PortfolioCardProps = {
  item: PortfolioItem;
};

export function PortfolioCard({ item }: PortfolioCardProps) {
  const categoryLabel = formatCategory(item.category);

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_16px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.cover_image_url}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/40" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="translate-y-6 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">{categoryLabel}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {item.title}
            </h3>
          </div>
        </div>
      </div>
    </article>
  );
}

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-neutral-200 bg-white px-6 py-10 text-center text-neutral-600 shadow-sm">
        No projects match this filter.
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-20 pt-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
      {items.map((item) => (
        <PortfolioCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function PortfolioShowcase() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/portfolio`);
        const data = await response.json();
        const safeProjects = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.items)
              ? data.items
              : [];

        if (isMounted) {
          setProjects(safeProjects);
        }
      } catch (error) {
        console.error("Failed to load portfolio projects:", error);
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter(
      (item) => normalizeCategory(item.category) === normalizeCategory(activeFilter)
    );
  }, [activeFilter, projects]);

  return (
    <main className="min-h-screen bg-[#f4f4f2] text-neutral-950">
      <HeroSlider />
      <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
      {loading ? (
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-10 text-center text-neutral-600 shadow-sm">
            Loading portfolio...
          </div>
        </div>
      ) : (
        <PortfolioGrid items={filteredItems} />
      )}
    </main>
  );
}