import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const notes = [
  {
    quote: "what once took $100 now requires $300",
    source: "overheard on r/LocalLLaMA",
    tone: "bg-secondary/40",
  },
  {
    quote: "one run burned 30% of my weekly limit",
    source: "overheard on HN",
    tone: "bg-accent/40",
  },
  {
    quote: "a centralized API can be nuked globally by a single government decree",
    source: "overheard on HN",
    tone: "bg-primary/15",
  },
  {
    quote: "the fallback model is never the same model",
    source: "overheard on r/ClaudeAI",
    tone: "bg-secondary/40",
  },
];

export function Receipts() {
  return (
    <section className="w-full bg-secondary/20 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div className="doodle-rough relative flex items-center justify-center overflow-hidden bg-card p-4">
          <img
            src="/brand/color/sticker-stars.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -right-4 size-16 md:size-20"
            width={80}
            height={80}
          />
          <img
            src="/brand/color/scene-receipts-color.svg"
            alt="A pile of receipts and invoices from unpredictable model bills"
            width={1024}
            height={1024}
            className="block h-auto w-full max-w-2xl"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-4 text-left">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            the receipts
          </p>
          <h2 className="font-display text-5xl leading-tight font-semibold text-balance md:text-6xl">
            why this exists
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            This is a scrapbook, not an invention. Every line below is
            something a real developer said out loud about real model bills
            and real outages. Brolly is the answer to all four at once.
          </p>
        </div>
      </div>
      <ScrollReveal className="mx-auto mt-10 grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2">
        {notes.map((note) => (
          <Card key={note.quote} size="sm" className={`h-full ${note.tone}`}>
            <CardContent className="flex h-full flex-col justify-between gap-3">
              <p className="font-display text-xl font-semibold text-balance">
                &quot;{note.quote}&quot;
              </p>
              <p className="text-sm font-medium text-foreground/70">{note.source}</p>
            </CardContent>
          </Card>
        ))}
      </ScrollReveal>
    </section>
  );
}
