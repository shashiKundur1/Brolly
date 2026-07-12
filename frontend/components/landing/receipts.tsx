import { ArtCrop } from "@/components/landing/art-crop";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const notes = [
  {
    quote: "what once took $100 now requires $300",
    source: "overheard on r/LocalLLaMA",
    tone: "cell-mint",
    tilt: "-rotate-1",
  },
  {
    quote: "one run burned 30% of my weekly limit",
    source: "overheard on HN",
    tone: "cell-butter",
    tilt: "rotate-1",
  },
  {
    quote: "the fallback model is never the same model",
    source: "overheard on r/ClaudeAI",
    tone: "cell-paper",
    tilt: "rotate-1",
  },
  {
    quote: "a centralized API can be nuked globally by a single decree",
    source: "overheard on HN",
    tone: "cell-coral",
    tilt: "-rotate-1",
  },
];

export function Receipts() {
  return (
    <section className="-mx-6 bg-card px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-14">
        <figure className="doodle-rough relative flex min-h-80 items-center justify-center overflow-hidden md:min-h-112">
          <span aria-hidden="true" className="absolute inset-0 cell-mint" />
          <ArtCrop
            src="/brand/color/scene-receipts-color.svg"
            box="76 142 878 720"
            alt="A worried doodle character sitting on coins, reading an endless model bill receipt"
            className="relative h-full max-h-112 w-full p-6"
          />
        </figure>
        <div className="flex flex-col items-start justify-center gap-4 text-left">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            the receipts
          </p>
          <h2 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl md:text-6xl">
            why this exists
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            A scrapbook, not an invention: every note below is a real
            developer, out loud, about real bills and real outages. Brolly is
            the answer to all four at once.
          </p>
          <ArtCrop
            src="/brand/color/balloon-umbrellas.svg"
            box="226 80 568 862"
            className="-mb-16 h-48 self-end md:-mb-24 md:h-64"
          />
        </div>
      </ScrollReveal>
      <ScrollReveal className="mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((note) => (
          <blockquote
            key={note.quote}
            className={`doodle-card ${note.tone} ${note.tilt} flex h-full flex-col justify-between gap-4 px-6 py-6`}
          >
            <p className="font-display text-xl leading-snug font-semibold text-balance">
              &ldquo;{note.quote}&rdquo;
            </p>
            <footer className="text-sm font-medium opacity-75">
              {note.source}
            </footer>
          </blockquote>
        ))}
      </ScrollReveal>
    </section>
  );
}
