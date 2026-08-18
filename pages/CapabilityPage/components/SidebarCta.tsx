import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CapabilityCta } from "../types";
import { CubeArtwork } from "./CubeArtwork";

type SidebarCtaProps = {
  cta: CapabilityCta;
};

/**
 * The "have a project in mind?" block. It lives in the sidebar column on
 * desktop; on mobile the same block is rendered below the results instead, so
 * the compact category bar does not push the content off the first screen.
 */
export function SidebarCta({ cta }: SidebarCtaProps) {
  const navigate = useNavigate();

  return (
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
        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0020BF] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-[#001a99] lg:min-h-0"
      >
        {cta.buttonLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      <CubeArtwork />
    </div>
  );
}
