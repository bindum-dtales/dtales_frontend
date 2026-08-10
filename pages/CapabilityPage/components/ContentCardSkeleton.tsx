export function ContentCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="aspect-[3/2] bg-neutral-100" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-20 rounded bg-neutral-100" />
        <div className="h-4 w-3/4 rounded bg-neutral-100" />
        <div className="h-3 w-full rounded bg-neutral-100" />
        <div className="h-3 w-2/3 rounded bg-neutral-100" />
      </div>
    </div>
  );
}
