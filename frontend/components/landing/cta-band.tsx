import Link from "next/link";
import { ArtCrop } from "@/components/landing/art-crop";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="-mx-6 cell-coral overflow-hidden px-6 pt-16 md:-mx-10 md:px-10 md:pt-24">
      <ScrollReveal className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 text-center">
        <h2 className="text-4xl leading-tight font-semibold text-balance text-primary-foreground sm:text-5xl md:text-6xl">
          get covered before the next outage
        </h2>
        <p className="max-w-prose text-lg text-balance text-primary-foreground md:text-xl">
          One base URL. The cascade and the failover start working on your
          very next request.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 text-base"
            render={<Link href="/dashboard">Open the dashboard</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base"
            render={<Link href="/cascade">Tour the cascade</Link>}
          />
        </div>
      </ScrollReveal>
      <ScrollReveal className="mx-auto mt-6 w-full max-w-5xl md:mt-8">
        <ArtCrop
          src="/brand/color/hero-big-scene.svg"
          box="52 216 928 586"
          alt="A cheerful crowd of doodle characters celebrating under umbrellas while coins rain"
          className="mx-auto block w-full"
        />
      </ScrollReveal>
    </section>
  );
}
