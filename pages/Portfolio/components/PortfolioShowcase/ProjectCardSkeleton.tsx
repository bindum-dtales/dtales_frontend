export function ProjectCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-2 shadow-sm">
      <div className="aspect-[16/10] rounded-2xl bg-neutral-100" />
      <div className="flex flex-col gap-3 p-6">
        <div className="h-4 w-2/3 rounded bg-neutral-100" />
        <div className="mt-6 flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-neutral-100" />
          <div className="h-3 w-24 rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
