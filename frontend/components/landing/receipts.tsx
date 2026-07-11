import { Card, CardContent } from "@/components/ui/card";

const notes = [
  {
    quote: "what once took $100 now requires $300",
    source: "overheard on r/LocalLLaMA",
  },
  {
    quote: "one run burned 30% of my weekly limit",
    source: "overheard on HN",
  },
  {
    quote: "a centralized API can be nuked globally by a single government decree",
    source: "overheard on HN",
  },
  {
    quote: "the fallback model is never the same model",
    source: "overheard on r/ClaudeAI",
  },
];

export function Receipts() {
  return (
    <section className="w-full py-10">
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <h2 className="font-display text-3xl">The receipts</h2>
        <p className="max-w-prose text-sm text-muted-foreground text-balance">
          A scrapbook, not an invention.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {notes.map((note) => (
          <Card key={note.quote} plain size="sm">
            <CardContent className="flex flex-col gap-2">
              <p className="font-display text-xl text-balance">&quot;{note.quote}&quot;</p>
              <p className="text-sm font-medium text-foreground/70">{note.source}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
