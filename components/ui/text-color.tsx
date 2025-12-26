"use client";

export function TextColor({ text }: { text: string }) {
  return (
    <div className="relative">
      <h1 className="text-center font-extrabold leading-none tracking-tight flex flex-wrap justify-center gap-2">
        <span
          data-content={text}
          className="before:animate-gradient-background-1 relative before:absolute before:inset-0 before:z-0 before:content-[attr(data-content)]"
        >
          <span className="animate-gradient-foreground-1 relative z-10">
            {text}
          </span>
        </span>
      </h1>
    </div>
  );
}
