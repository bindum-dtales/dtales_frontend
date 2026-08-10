import { Hero } from "./components/Hero";
import { CapabilityCards } from "./components/CapabilityCards";
import { ProcessTimeline } from "./components/ProcessTimeline";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-[#FCFCFD]">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-10 sm:pt-14 lg:pt-16">
          <Hero />
        </section>

        {/* Capability Cards Section */}
        <section className="pt-2 pb-8 sm:pt-4 sm:pb-10 lg:pt-5 lg:pb-12">
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
