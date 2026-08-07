import { PORTFOLIO_STATS } from "../../data/stats";

export function Stats() {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 bg-white sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
      {PORTFOLIO_STATS.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center gap-3 p-5 text-center"
        >
          <Icon className="h-5 w-5 text-neutral-700" />
          <span className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            {value}
          </span>
          <span className="text-sm leading-snug text-neutral-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
