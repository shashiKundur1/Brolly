const steps = [
  {
    number: "1",
    title: "Point your tools at the proxy",
    description: "Swap one base URL. Every SDK and framework you already use keeps working.",
  },
  {
    number: "2",
    title: "Every call routes through Mesh",
    description: "One key, 1000+ models. Brolly sits in front of the Mesh API gateway for every request.",
  },
  {
    number: "3",
    title: "Brolly watches, routes, and rescues",
    description: "Burn tracked live, cheapest passing model chosen, and failover ready the moment a provider drops.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-16">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="font-display text-3xl">How it works</h2>
      </div>
      <div className="relative mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <div
          className="pointer-events-none absolute top-6 left-0 hidden h-0 w-full border-t-2 border-dashed border-border md:block"
          aria-hidden="true"
        />
        {steps.map((step) => (
          <div key={step.number} className="relative flex flex-col items-center gap-3 text-center">
            <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-card font-display text-2xl doodle-border">
              {step.number}
            </span>
            <h3 className="font-display text-xl">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
