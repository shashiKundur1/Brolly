import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: "/brand/color/how-plug-color.svg",
    panelTone: "bg-primary/20",
    title: "Point your tools here",
    description:
      "Swap your base URL. Every SDK that speaks OpenAI now speaks Brolly.",
    href: null as string | null,
  },
  {
    icon: "/brand/color/how-ladder-color.svg",
    panelTone: "bg-secondary/50",
    title: "Pay less by default",
    description:
      "Each call tries the cheapest model that passes YOUR benchmark.",
    href: "/cascade",
  },
  {
    icon: "/brand/color/how-shield-color.svg",
    panelTone: "bg-accent/50",
    title: "Survive the outage",
    description:
      "A model dies mid-session, Brolly hot-swaps with context intact.",
    href: "/failover",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-10">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="font-display text-4xl md:text-5xl">how it works</h2>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step) => {
          const content = (
            <>
              <div className={`overflow-hidden rounded-t-2xl ${step.panelTone} px-6 pt-6`}>
                <img
                  src={step.icon}
                  alt=""
                  width={1024}
                  height={1024}
                  className="mx-auto block h-28 w-28"
                />
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="font-display text-2xl font-normal">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </>
          );

          return (
            <Card key={step.title} className="overflow-hidden py-0">
              {step.href ? (
                <Link href={step.href} className="flex h-full flex-col">
                  {content}
                </Link>
              ) : (
                <div className="flex h-full flex-col">{content}</div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
