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
    description:
      "Live spend and burn rate for every model, with plain projections like '30% of your weekly limit' before you blow past it.",
    href: "/dashboard",
    label: "Open the dashboard",
  },
  {
    icon: StairsIcon,
    title: "Pay less by default",
    description:
      "Cost-cascade routing tries the cheapest model that still passes your benchmark, not the one topping someone else's leaderboard.",
    href: "/cascade",
    label: "See the cascade",
  },
  {
    icon: ArrowsClockwiseIcon,
    title: "Survive the outage",
    description:
      "Mid-session hot-swap carries a distilled behavior card to the fallback model, so a dead provider never means a dead session.",
    href: "/failover",
    label: "See the failover demo",
  },
];

export function FeatureTrio() {
  return (
    <section className="w-full py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="doodle-border doodle-shadow flex h-full flex-col justify-between gap-6"
            >
              <CardHeader className="gap-3">
                <Icon size={40} weight="duotone" className="text-primary" />
                <CardTitle className="font-display text-2xl">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
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
