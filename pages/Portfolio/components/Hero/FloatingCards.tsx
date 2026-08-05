import { motion } from "framer-motion";
import { FileText, Share2, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { WORKFLOW_CARDS } from "../../data/workflow";

const CARD_ICONS: Record<string, LucideIcon> = {
  Strategy: Target,
  Content: FileText,
  Distribution: Share2,
  Impact: TrendingUp,
};

// Impact sits at the anchor: largest, frontmost, fully readable. Each card
// above it steps up, slightly right, a touch smaller, and further back in the
// stacking order — a staircase receding away from the viewer, not a deck.
const CARD_OFFSETS: Record<string, { x: number; y: number; scale: number; zIndex: number }> = {
  Impact: { x: 0, y: 0, scale: 1, zIndex: 4 },
  Distribution: { x: 42, y: -83, scale: 0.98, zIndex: 3 },
  Content: { x: 84, y: -166, scale: 0.96, zIndex: 2 },
  Strategy: { x: 126, y: -249, scale: 0.94, zIndex: 1 },
};

// Per-card glass tint: a smooth gradient from almost-white (Strategy, back/top)
// to the deepest soft blue (Impact, front/bottom), each slightly more
// transparent than a flat white fill so the material reads as frosted glass.
const CARD_TINT: Record<string, string> = {
  Strategy:
    "linear-gradient(145deg, rgba(255,255,255,0.80) 0%, rgba(248,250,255,0.58) 48%, rgba(240,244,255,0.46) 100%)",
  Content:
    "linear-gradient(145deg, rgba(250,252,255,0.80) 0%, rgba(238,244,255,0.58) 48%, rgba(224,235,255,0.46) 100%)",
  Distribution:
    "linear-gradient(145deg, rgba(244,248,255,0.80) 0%, rgba(222,233,255,0.58) 48%, rgba(204,220,255,0.46) 100%)",
  Impact:
    "linear-gradient(145deg, rgba(236,242,255,0.80) 0%, rgba(206,221,255,0.58) 48%, rgba(182,201,250,0.46) 100%)",
};

const FLOAT_CONFIG = [
  { duration: 7.6, delay: 0, dy: 8 },
  { duration: 8.4, delay: 0.35, dy: 6 },
  { duration: 7.2, delay: 0.2, dy: 7 },
  { duration: 8.8, delay: 0.55, dy: 5 },
];

export function FloatingCards() {
  return (
    <div className="flex w-full justify-center">
      <div className="relative h-[312px] w-full max-w-[560px] [perspective:2200px] [transform:translateX(-306px)] sm:h-[356px] sm:max-w-[620px] lg:[transform:translateX(-376px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[58%] h-[250px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0020BF]/18 blur-[110px] sm:h-[300px] sm:w-[420px]"
        />

        <div className="relative h-full w-full [transform-style:preserve-3d] [transform:rotateX(7deg)_rotateY(-11deg)_rotateZ(7deg)]">
          {WORKFLOW_CARDS.map((label, index) => {
            const Icon = CARD_ICONS[label];
            const base = CARD_OFFSETS[label];
            const float = FLOAT_CONFIG[index % FLOAT_CONFIG.length];

            return (
              <motion.div
                key={label}
                className="absolute left-1/2 bottom-0 h-[125px] w-[382px] -translate-x-1/2 overflow-hidden rounded-[30px] border border-white/70 px-6 py-4 shadow-[0_34px_70px_-28px_rgba(0,32,191,0.34),0_18px_40px_-24px_rgba(15,23,42,0.18)] backdrop-blur-[28px] sm:h-[131px] sm:w-[408px]"
                style={{
                  zIndex: base.zIndex,
                  transformStyle: "preserve-3d",
                  x: base.x,
                  y: base.y,
                  scale: base.scale,
                  backgroundImage: CARD_TINT[label],
                }}
                animate={{
                  y: [base.y, base.y - float.dy, base.y],
                }}
                transition={{
                  duration: float.duration,
                  delay: float.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[30px] bg-gradient-to-b from-white/75 to-transparent"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_44%,rgba(255,255,255,0)_100%)]"
                />

                <span className="relative inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/80 bg-white/55 text-neutral-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-600">
                    {label}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
