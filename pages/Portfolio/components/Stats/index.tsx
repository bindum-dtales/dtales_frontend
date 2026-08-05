import { PORTFOLIO_STATS } from "../../data/stats";

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {PORTFOLIO_STATS.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="flex flex-col items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-5"
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
