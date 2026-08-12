import { FeaturedClients } from "../FeaturedClients";
import { HeroContent } from "./HeroContent";
import { Stats } from "../Stats";
import portBg from "@/src/assets/portbg.jpeg";

export function Hero() {
  return (
    <div className="bg-[#FCFCFD]">
      {/* Hero Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[calc(66.6667%+144px)_calc(33.3333%-144px)] lg:gap-8">
        {/* Left: Hero Content + Illustration + Stats */}
        <div>
          <div
            role="img"
            aria-label=""
            style={{ backgroundImage: `url(${portBg})` }}
            className="relative overflow-hidden rounded-3xl bg-cover bg-[position:right_center] [transform:translateX(-16px)]"
          >
            {/* Soft readability wash — fades out toward the artwork on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-white/0" />

            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-9 lg:gap-12">
              {/* Hero Content */}
              <div className="flex items-center lg:col-span-5 lg:items-start">
                <HeroContent />
              </div>

              {/* Illustration space — artwork shows through the shared panel background */}
              <div className="flex items-center justify-center lg:col-span-4 lg:items-start">
                <div className="aspect-[400/339] h-auto w-[90%] sm:w-full sm:max-w-[520px] lg:w-full lg:max-w-none" />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-10 w-full [transform:translateX(-16px)]">
            <Stats />
          </div>
        </div>

        {/* Right: Featured Clients */}
        <div className="lg:border-l lg:border-neutral-200 lg:pl-8">
          <FeaturedClients />
        </div>
      </div>
    </div>
  );
}
