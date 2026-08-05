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
        <section className="py-16 sm:py-20 lg:py-24">
          <CapabilityCards />
        </section>

        {/* Process Timeline Section */}
        <section className="py-20 sm:py-24 lg:py-32">
          <ProcessTimeline />
        </section>
      </div>
    </main>
  );
}
