import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { CapabilityCta, CapabilitySubcategory } from "../types";
import { CubeArtwork } from "./CubeArtwork";

type SidebarProps = {
  subcategories: CapabilitySubcategory[];
  activeSubcategory: string;
  cta: CapabilityCta;
  onSelect: (label: string) => void;
};

export function Sidebar({ subcategories, activeSubcategory, cta, onSelect }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="flex w-full flex-col justify-between gap-10 bg-white px-4 py-8 lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)] lg:w-[280px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-neutral-200">
      <div>
        <Link
          to="/portfolio"
          className="group mb-6 inline-flex items-center gap-2 px-3 text-xs font-medium text-neutral-500 transition-colors duration-200 hover:text-[#0020BF]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          Back to Work Library
        </Link>

        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Sub Categories
        </p>

        <nav className="mt-4 flex flex-col gap-1">
          {subcategories.map(({ label, icon: Icon }) => {
            const isActive = label === activeSubcategory;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelect(label)}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-xl bg-[#EEF1FF] px-3 py-2.5 text-sm font-semibold text-[#0020BF]"
                    : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-950"
                }
              >
                <span
                  className={
                    isActive
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0020BF] text-white"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-400"
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 text-left">{label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0020BF]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3">
        <h3 className="text-base font-bold leading-snug text-neutral-950">
          {cta.heading}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {cta.description}
        </p>
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0020BF] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-[#001a99]"
        >
          {cta.buttonLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <CubeArtwork />
      </div>
    </aside>
  );
}
