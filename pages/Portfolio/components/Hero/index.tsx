import { FeaturedClients } from "../FeaturedClients";
import { HeroContent } from "./HeroContent";
import { Stats } from "../Stats";
import cardImage from "@/src/assets/card.png";

export function Hero() {
  return (
    <div className="bg-[#FCFCFD]">
      {/* Hero Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
        {/* Left: Hero Content + Illustration + Stats */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-9 lg:gap-12">
            {/* Hero Content */}
            <div className="flex items-center lg:col-span-5 lg:items-start">
              <HeroContent />
            </div>

            {/* Hero Image */}
            <div className="flex items-center justify-center lg:col-span-4 lg:items-start">
              <img
                src={cardImage}
                alt=""
                className="h-auto w-[90%] object-contain sm:w-full sm:max-w-[520px] lg:w-full lg:max-w-none"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-10 w-full">
            <Stats />
          </div>
        </div>

        {/* Right: Featured Clients */}
        <div className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-8">
          <FeaturedClients />
        </div>
      </div>
    </div>
  );
}
