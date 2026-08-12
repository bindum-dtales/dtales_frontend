import { PORTFOLIO_STATS } from "../../data/stats";

export function Stats() {
  return (
    <div className="grid grid-cols-5 divide-x divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {PORTFOLIO_STATS.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex flex-col gap-2 px-5 py-10">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="text-[20px] font-bold tracking-tight text-neutral-950 sm:text-[22px]">
              {value}
            </span>
          </div>
          <span className="text-xs leading-snug text-neutral-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
