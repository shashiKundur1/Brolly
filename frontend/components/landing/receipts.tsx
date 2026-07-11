const notes = [
  {
    quote: "what once took $100 now requires $300",
    source: "overheard on r/LocalLLaMA",
    tone: "bg-accent",
    rotate: "rotate-1",
  },
  {
    quote: "one run burned 30% of my weekly limit",
    source: "overheard on HN",
    tone: "bg-secondary",
    rotate: "-rotate-2",
  },
  {
    quote: "a centralized API can be nuked globally by a single government decree",
    source: "overheard on HN",
    tone: "bg-card",
    rotate: "rotate-1",
  },
  {
    quote: "the fallback model is never the same model",
    source: "overheard on r/ClaudeAI",
    tone: "bg-secondary",
    rotate: "-rotate-2",
  },
];

export function Receipts() {
  return (
    <section className="w-full py-16">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="font-display text-3xl">The receipts</h2>
        <p className="max-w-prose text-sm text-muted-foreground text-balance">
          A scrapbook, not an invention.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
        {notes.map((note) => (
          <div
            key={note.quote}
            className={`doodle-shadow ${note.tone} ${note.rotate} flex flex-col gap-3 rounded-2xl border-2 border-foreground px-5 py-6`}
          >
            <p className="font-display text-xl text-balance">&quot;{note.quote}&quot;</p>
            <p className="text-sm font-medium text-foreground/70">{note.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
