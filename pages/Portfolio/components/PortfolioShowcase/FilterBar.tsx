import { PORTFOLIO_FILTERS, type PortfolioFilter } from "./constants";

type FilterBarProps = {
  activeFilter: PortfolioFilter;
  onChange: (filter: PortfolioFilter) => void;
};

export function FilterBar({ activeFilter, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {PORTFOLIO_FILTERS.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={
              isActive
                ? "rounded-full border border-[#0020BF] bg-[#0020BF] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out"
                : "rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition-all duration-300 ease-out hover:border-neutral-300 hover:text-neutral-950"
            }
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
