import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowsClockwiseIcon,
  CaretRightIcon,
  GaugeIcon,
  StairsIcon,
} from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    icon: GaugeIcon,
    title: "See your burn",
    description: "Live spend, plain projections, before you blow past the limit.",
    stat: "burn rate, live",
    href: "/dashboard",
    label: "Open the dashboard",
  },
  {
    icon: StairsIcon,
    title: "Pay less by default",
    description: "The cheapest model that still passes your benchmark.",
    stat: "cheapest passing model wins",
    href: "/cascade",
    label: "See the cascade",
  },
  {
    icon: ArrowsClockwiseIcon,
    title: "Survive the outage",
    description: "Hot-swap carries context to the fallback model mid-run.",
    stat: "sessions survive funerals",
    href: "/failover",
    label: "See the failover demo",
  },
];

export function FeatureTrio() {
  return (
    <section className="w-full py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="doodle-border doodle-shadow flex h-full flex-col justify-between gap-4"
            >
              <CardHeader className="gap-2">
                <Icon size={40} weight="duotone" className="text-primary" />
                <CardTitle className="font-display text-xl">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
                <p className="font-mono text-xs font-semibold text-foreground/60 uppercase">
                  {feature.stat}
                </p>
              </CardHeader>
              <CardContent>
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {feature.label}
                  <CaretRightIcon size={16} />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
