import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { CoinsDoodle, GaugeDoodle, StormDoodle } from "@/components/brand/icons";

const features = [
  {
    icon: GaugeDoodle,
    title: "See your burn",
    description: "Live spend, plain projections, before you blow past the limit.",
    href: "/dashboard",
    label: "Open the dashboard",
  },
  {
    icon: CoinsDoodle,
    title: "Pay less by default",
    description: "The cheapest model that still passes your benchmark.",
    href: "/cascade",
    label: "See the cascade",
  },
  {
    icon: StormDoodle,
    title: "Survive the outage",
    description: "Hot-swap carries context to the fallback model mid-run.",
    href: "/failover",
    label: "See the failover demo",
  },
];

export function FeatureTrio() {
  return (
    <section className="w-full py-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} size="sm" className="flex h-full flex-col justify-between">
              <CardHeader className="gap-2">
                <Icon className="size-8 text-primary" />
                <CardTitle className="font-display text-xl font-normal">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm">
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
