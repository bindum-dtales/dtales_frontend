import { useEffect, useState } from "react";
import heroOne from "@/src/assets/1.png";
import heroTwo from "@/src/assets/2.png";
import heroThree from "@/src/assets/3.png";
import heroFour from "@/src/assets/4.png";

type PortfolioCategory = "All" | "Web" | "Video" | "Branding";
type PortfolioItem = {
  id: number;
  title: string;
  category: Exclude<PortfolioCategory, "All">;
  image: string;
};

const heroSlides = [heroOne, heroTwo, heroThree, heroFour];

const portfolioItems: PortfolioItem[] = [
  { id: 1, title: "Project Name", category: "Web", image: heroOne },
  { id: 2, title: "Project Name", category: "Video", image: heroTwo },
  { id: 3, title: "Project Name", category: "Branding", image: heroThree },
  { id: 4, title: "Project Name", category: "Web", image: heroFour },
  { id: 5, title: "Project Name", category: "Video", image: heroOne },
  { id: 6, title: "Project Name", category: "Branding", image: heroTwo },
  { id: 7, title: "Project Name", category: "Web", image: heroThree },
  { id: 8, title: "Project Name", category: "Branding", image: heroFour },
];

export function HeroSlider() {
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  useEffect(() => {
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

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
            <div className="max-w-xl rounded-3xl border border-white/10 bg-black/25 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">Selected Work</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Portfolio
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
                A curated showcase of web, video, and branding projects presented with a clean,
                modern layout.
              </p>
            </div>
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
  const filters: PortfolioCategory[] = ["All", "Web", "Video", "Branding"];

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
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_16px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/40" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="translate-y-6 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">{item.category}</p>
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
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>("All");

  const filteredItems =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <main className="min-h-screen bg-[#f4f4f2] text-neutral-950">
      <HeroSlider />
      <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
      <PortfolioGrid items={filteredItems} />
    </main>
  );
}