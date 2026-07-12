import { ArtCrop } from "@/components/landing/art-crop";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function PointYourTools() {
  return (
    <section className="-mx-6 bg-accent/30 px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-14">
        <figure className="doodle-rough relative flex min-h-80 items-center justify-center overflow-hidden md:order-1 md:min-h-112">
          <span aria-hidden="true" className="absolute inset-0 cell-mint" />
          <ArtCrop
            src="/brand/color/scene-plug-flow.svg"
            box="10 290 1004 442"
            alt="A laptop plugging into the Brolly umbrella hub, which fans out to three model robots"
            className="relative h-full max-h-112 w-full p-6"
          />
        </figure>
        <div className="flex flex-col items-start justify-center gap-5 text-left md:order-2">
          <h2 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl md:text-6xl">
            point your tools here
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            Swap one base URL and every OpenAI-compatible SDK call routes
            through Brolly to 1000+ Mesh models — usage tracked, cascade on,
            failover armed.
          </p>
          <div className="doodle-rough w-full max-w-md bg-card px-5 py-4">
            <p className="font-mono text-xs leading-relaxed break-all sm:text-sm">
              <span className="text-muted-foreground line-through">
                https://api.openai.com/v1
              </span>
              <br />
              <span className="font-semibold text-foreground">
                http://your-brolly:4000/v1
              </span>
            </p>
          </div>
          <div className="flex w-full max-w-md items-end justify-between gap-3">
            <p className="pb-4 text-lg font-bold text-foreground">
              …and that&apos;s the whole integration.
            </p>
            <ArtCrop
              src="/brand/color/person-relaxing.svg"
              box="116 104 820 842"
              alt="A relaxed doodle bear sipping a drink under an umbrella, work done"
              className="h-40 shrink-0 md:h-52"
            />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
