export function CubeArtwork() {
  return (
    <div className="relative h-28 w-28" aria-hidden="true">
      <div className="absolute left-1 top-8 h-12 w-12 rotate-12 rounded-lg bg-gradient-to-br from-[#0020BF] to-[#5B7CFF] shadow-lg shadow-blue-900/20" />
      <div className="absolute left-11 top-1 h-10 w-10 -rotate-6 rounded-lg bg-gradient-to-br from-blue-200 to-blue-400 opacity-90 shadow-md" />
      <div className="absolute left-0 top-16 h-9 w-9 rotate-45 rounded-lg bg-white shadow-md ring-1 ring-neutral-200" />
      <div className="absolute left-14 top-14 h-7 w-7 rotate-12 rounded-md bg-gradient-to-br from-[#0020BF]/80 to-[#5B7CFF]/80" />
    </div>
  );
}
