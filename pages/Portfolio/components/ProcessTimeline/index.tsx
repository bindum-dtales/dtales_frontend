import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { PROCESS_STEPS } from "../../data/process";

const ACTIVE_CIRCLE =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0020BF] text-xs font-semibold text-white";
const INACTIVE_CIRCLE =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-400";

export function ProcessTimeline() {
  const lastIndex = PROCESS_STEPS.length - 1;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      {/* Left: Eyebrow + Heading */}
      <div className="lg:col-span-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0020BF]">
          How We Approach
        </p>
        <h2 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl">
          Engineered
          <br />
          for outcomes
        </h2>
      </div>

      {/* Right: Horizontal Process */}
      <div className="lg:col-span-9">
        <div className="relative">
          {/* Connector line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute left-[18px] right-[calc(20%-18px)] top-[18px] hidden h-px bg-[#EAEAEA] sm:block"
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-5 sm:gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 1.2 }}
                className="flex items-start gap-4 sm:flex-col"
              >
                <div className="relative flex items-center">
                  <motion.span
                    initial={index === 0 ? { scale: 0.85 } : undefined}
                    whileInView={index === 0 ? { scale: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className={index === 0 ? ACTIVE_CIRCLE : INACTIVE_CIRCLE}
                  >
                    {step.number}
                  </motion.span>
                  {index < lastIndex && (
                    <ChevronRight className="absolute left-[calc(100%+0.5rem)] hidden h-3.5 w-3.5 text-neutral-300 sm:block" />
                  )}
                </div>

                <div className="mt-0 sm:mt-6">
                  <h3 className="text-base font-semibold text-neutral-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[170px] text-xs leading-relaxed text-neutral-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
