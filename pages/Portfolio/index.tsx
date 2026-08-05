import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { CapabilityCards } from "./components/CapabilityCards";
import { ProcessTimeline } from "./components/ProcessTimeline";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-[#FCFCFD]">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-24 pb-16 sm:pb-20 lg:pb-24">
          <Hero />
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <Stats />
        </section>

        {/* Capability Cards Section */}
        <section className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12">
          <CapabilityCards />
        </section>

        {/* Process Timeline Section */}
        <section className="pt-10 sm:pt-12 lg:pt-16 pb-20 sm:pb-24 lg:pb-32">
          <ProcessTimeline />
        </section>
      </div>
    </main>
  );
}
