import { Target, type LucideIcon } from "lucide-react";

interface HeroGlassCardProps {
  icon?: LucideIcon;
  label?: string;
}

export function HeroGlassCard({ icon: Icon = Target, label = "Strategy" }: HeroGlassCardProps) {
  return (
    <div
      className="relative h-[150px] w-[360px] overflow-hidden rounded-[24px] border border-white/50 bg-[linear-gradient(150deg,rgba(255,255,255,0.82)_0%,rgba(245,248,255,0.62)_50%,rgba(230,238,255,0.48)_100%)] px-6 py-5 backdrop-blur-[28px] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_18px_36px_-16px_rgba(0,32,191,0.26),0_46px_90px_-32px_rgba(0,32,191,0.24),0_10px_26px_-14px_rgba(15,23,42,0.12)]"
    >
      {/* Smooth top-to-bottom glass highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] bg-gradient-to-b from-white/70 to-transparent"
      />

      {/* Inner glaze so the tint reads as material, not a flat fill */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.05)_45%,rgba(255,255,255,0)_100%)]"
      />

      <span className="relative inline-flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/80 bg-white/55 text-neutral-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-600">
          {label}
        </span>
      </span>
    </div>
  );
}
