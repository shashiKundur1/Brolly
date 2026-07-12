import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function PointYourTools() {
  return (
    <section className="-mx-6 bg-accent/30 px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="doodle-rough relative flex items-center justify-center overflow-hidden bg-card p-4 md:order-1">
          <img
            src="/brand/color/sticker-stars.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 -left-4 size-16 md:size-20"
            width={80}
            height={80}
          />
          <img
            src="/brand/color/scene-plug-flow.svg"
            alt="Plugging your SDK's base URL into Brolly's endpoint"
            width={1024}
            height={1024}
            className="block h-auto w-full max-w-2xl"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-5 text-left md:order-2">
          <h2 className="font-display text-5xl leading-tight font-semibold text-balance md:text-6xl">
            point your tools here
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            Swap your base URL. Every OpenAI-compatible SDK call now routes
            through Brolly to 1000+ Mesh models — usage tracked, cheapest
            model that passes your benchmark chosen, failover when one dies.
          </p>
          <div className="doodle-rough w-full max-w-md bg-card px-5 py-4">
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed sm:text-sm">
              <code className="whitespace-pre-wrap break-all">
                <span className="text-muted-foreground">
                  https://api.openai.com/v1
                </span>
                {" → "}
                <span className="font-semibold text-foreground">
                  http://your-brolly/v1
                </span>
              </code>
            </pre>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
