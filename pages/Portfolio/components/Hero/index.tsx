import { FeaturedClients } from "../FeaturedClients";
import { HeroContent } from "./HeroContent";
import { FloatingCards } from "./FloatingCards";

export function Hero() {
  return (
    <div className="bg-[#FCFCFD]">
      {/* Hero Grid */}
      <div className="grid grid-cols-1 gap-8 pt-6 sm:pt-8 lg:grid-cols-12 lg:gap-12 lg:pt-10">
        {/* Left: Hero Content */}
        <div className="flex items-center lg:col-span-6">
          <HeroContent />
        </div>

        {/* Center: Floating Cards */}
        <div className="flex items-center lg:col-span-3">
          <FloatingCards />
        </div>

        {/* Right: Featured Clients */}
        <div className="lg:col-span-3 lg:border-l lg:border-neutral-200 lg:pl-8">
          <FeaturedClients />
        </div>
      </div>
    </div>
  );
}
