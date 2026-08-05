export function FeaturedClientSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3">
      <div className="h-16 w-16 shrink-0 rounded-xl bg-neutral-100" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-2.5 w-1/3 rounded bg-neutral-100" />
        <div className="h-4 w-3/4 rounded bg-neutral-100" />
        <div className="h-3 w-1/2 rounded bg-neutral-100" />
      </div>
    </div>
  );
}
