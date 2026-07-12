import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function PointYourTools() {
  return (
    <section className="-mx-6 bg-secondary/40 px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="mx-auto w-full max-w-lg rounded-3xl bg-card p-6 md:mx-0">
          <img
            src="/brand/color/scene-plug-flow.svg"
            alt=""
            width={1024}
            height={1024}
            className="block h-auto w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-5 text-left">
          <h2 className="font-display text-5xl leading-tight text-balance md:text-6xl">
            point your tools here
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            Swap your base URL. Every OpenAI-compatible SDK call now routes
            through Brolly to 1000+ Mesh models — usage tracked, cheapest
            model that passes your benchmark chosen, failover when one dies.
          </p>
          <div className="w-full max-w-md">
            <pre className="doodle-border doodle-shadow overflow-x-auto rounded-2xl bg-card px-5 py-4 font-mono text-xs leading-relaxed sm:text-sm">
              <code className="whitespace-pre-wrap break-all">
                <span className="text-muted-foreground">
                  https://api.openai.com/v1
                </span>
                {" → "}
                <span className="text-primary">
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
