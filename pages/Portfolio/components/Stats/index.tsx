import { PORTFOLIO_STATS } from "../../data/stats";

export function Stats() {
  return (
    // Five columns only fit from lg up, where the original `divide-x` rules
    // still apply untouched. Below lg the cells wrap, so each one draws its own
    // hairline and overhangs by 1px to keep the dividers on the grid lines.
    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-neutral-200">
      {PORTFOLIO_STATS.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="-mb-px -mr-px flex flex-col gap-2 border-b border-r border-neutral-200 px-4 py-6 sm:px-5 lg:mb-0 lg:mr-0 lg:border-0 lg:py-10"
        >
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
