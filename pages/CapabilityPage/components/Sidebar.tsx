import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { CapabilityCta, CapabilitySubcategory } from "../types";
import { SidebarCta } from "./SidebarCta";

type SidebarProps = {
  subcategories: CapabilitySubcategory[];
  activeSubcategory: string;
  cta: CapabilityCta;
  onSelect: (label: string) => void;
};

function BackLink({ className }: { className: string }) {
  return (
    <Link to="/portfolio" className={className}>
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
      Back to Work Library
    </Link>
  );
}

export function Sidebar({ subcategories, activeSubcategory, cta, onSelect }: SidebarProps) {
  return (
    <>
      {/*
        Mobile / tablet: the vertical sidebar would fill the entire first screen,
        so the subcategories collapse into a compact, horizontally scrollable
        chip row. The CTA block moves below the results instead — see
        CapabilityPageTemplate.
      */}
      <div className="border-b border-neutral-200 bg-white lg:hidden">
        <div className="px-4 pb-3 pt-6">
          <BackLink className="group inline-flex min-h-[44px] items-center gap-2 px-3 text-xs font-medium text-neutral-500 transition-colors duration-200 hover:text-[#0020BF]" />
        </div>

        <nav aria-label="Sub categories" className="no-scrollbar overflow-x-auto pb-4">
          <div className="flex w-max gap-2 px-4">
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
                      ? "flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-[#EEF1FF] px-4 py-2.5 text-sm font-semibold text-[#0020BF]"
                      : "flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-950"
                  }
                >
                  <Icon
                    className={
                      isActive
                        ? "h-4 w-4 shrink-0 text-[#0020BF]"
                        : "h-4 w-4 shrink-0 text-neutral-400"
                    }
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Desktop: unchanged sidebar column. */}
      <aside className="hidden w-full flex-col justify-between gap-10 bg-white px-4 py-8 lg:sticky lg:top-28 lg:flex lg:h-[calc(100vh-7rem)] lg:w-[280px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-neutral-200">
        <div>
          <BackLink className="group mb-6 inline-flex items-center gap-2 px-3 text-xs font-medium text-neutral-500 transition-colors duration-200 hover:text-[#0020BF]" />

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

        <SidebarCta cta={cta} />
      </aside>
    </>
  );
}
