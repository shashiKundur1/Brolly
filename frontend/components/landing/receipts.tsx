import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

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
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div className="mx-auto w-full max-w-sm rounded-3xl bg-accent/30 p-6 md:mx-0">
          <img
            src="/brand/color/scene-receipts-color.svg"
            alt=""
            width={1024}
            height={1024}
            className="block h-auto w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-4 text-left">
          <p className="font-display text-2xl text-primary">the receipts</p>
          <h2 className="font-display text-5xl leading-tight text-balance md:text-6xl">
            why this exists
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            This is a scrapbook, not an invention. Every line below is
            something a real developer said out loud about real model bills
            and real outages. Brolly is the answer to all four at once.
          </p>
        </div>
      </div>
      <ScrollReveal className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {notes.map((note) => (
          <Card key={note.quote} plain size="sm">
            <CardContent className="flex flex-col gap-2">
              <p className="font-display text-xl text-balance">&quot;{note.quote}&quot;</p>
              <p className="text-sm font-medium text-foreground/70">{note.source}</p>
            </CardContent>
          </Card>
        ))}
      </ScrollReveal>
    </section>
  );
}
