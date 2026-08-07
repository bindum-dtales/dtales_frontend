import { FeaturedClients } from "../FeaturedClients";
import { HeroContent } from "./HeroContent";
import cardImage from "@/src/assets/card.png";

export function Hero() {
  return (
    <div className="bg-[#FCFCFD]">
      {/* Hero Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left: Hero Content */}
        <div className="flex items-center lg:col-span-5 lg:items-start">
          <HeroContent />
        </div>

        {/* Center: Hero Image */}
        <div className="flex items-center justify-center lg:col-span-4 lg:items-start">
          <img
            src={cardImage}
            alt=""
            className="h-auto w-[90%] object-contain sm:w-full sm:max-w-[520px] lg:w-full lg:max-w-none"
          />
        </div>

        {/* Right: Featured Clients */}
        <div className="lg:col-span-3 lg:border-l lg:border-neutral-200 lg:pl-8">
          <FeaturedClients />
        </div>
      </div>
    </div>
  );
}
