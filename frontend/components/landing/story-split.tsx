import Link from "next/link";
import { type ReactNode } from "react";
import { ArtCrop } from "@/components/landing/art-crop";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

type StorySplitProps = {
  kicker: string;
  title: string;
  band: string;
  panelTone: string;
  art: { src: string; alt: string; box?: string };
  artCover?: boolean;
  cta?: { href: string; label: string };
  flip?: boolean;
  children: ReactNode;
};

export function StorySplit({
  kicker,
  title,
  band,
  panelTone,
  art,
  artCover = false,
  cta,
  flip = false,
  children,
}: StorySplitProps) {
  return (
    <section className={`-mx-6 px-6 py-16 md:-mx-10 md:px-10 md:py-24 ${band}`}>
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-14">
        <figure
          className={`doodle-rough relative flex min-h-80 items-center justify-center overflow-hidden md:min-h-112 ${flip ? "md:order-2" : "md:order-1"}`}
        >
          <span aria-hidden="true" className={`absolute inset-0 ${panelTone}`} />
          {artCover ? (
            <img
              src={art.src}
              alt={art.alt}
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ArtCrop
              src={art.src}
              box={art.box ?? "0 0 1024 1024"}
              alt={art.alt}
              className="relative h-full max-h-112 w-full p-6"
            />
          )}
        </figure>
        <div
          className={`flex flex-col items-start justify-center gap-5 text-left ${flip ? "md:order-1" : "md:order-2"}`}
        >
          <p className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            {kicker}
          </p>
          <h2 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl md:text-6xl">
            {title}
          </h2>
          {children}
          {cta ? (
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base"
              render={<Link href={cta.href}>{cta.label}</Link>}
            />
          ) : null}
        </div>
      </ScrollReveal>
    </section>
  );
}
