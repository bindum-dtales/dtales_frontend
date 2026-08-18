import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5">
      <Search className="h-4 w-4 shrink-0 text-neutral-400" />
      {/* text-base on small screens keeps iOS from zooming the page on focus. */}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search content..."
        aria-label="Search content"
        className="w-full min-w-0 bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:text-sm"
      />
    </div>
  );
}
