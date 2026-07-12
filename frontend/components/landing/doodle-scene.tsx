import { InlineDoodleSvg } from "@/components/landing/inline-doodle-svg";

export function DoodleScene() {
  return (
    <section className="-mx-6 bg-accent/40 px-6 py-14 md:-mx-10 md:px-10 md:py-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
        <div className="mx-auto w-full max-w-md md:mx-0">
          <InlineDoodleSvg
            src="/brand/bento/hero-umbrella-hills.svg"
            className="block h-auto w-full text-foreground [&_svg]:h-auto [&_svg]:w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-4 text-left">
          <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">
            the future of paying for AI
          </h2>
          <p className="max-w-prose text-base text-muted-foreground text-balance md:text-lg">
            Need reliable model access without the surprise invoice or the
            3am outage? Welcome home. Brolly sits in front of the Mesh API
            gateway, watching every call, routing to the cheapest model that
            still passes your benchmark, and hot-swapping the moment one
            provider drops.
          </p>
        </div>
      </div>
    </section>
  );
}
