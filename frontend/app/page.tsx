import { LandingHero } from "@/components/landing/hero";
import { DoodleScene } from "@/components/landing/doodle-scene";
import { FeatureTrio } from "@/components/landing/feature-trio";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <LandingHero />
      <DoodleScene />
      <FeatureTrio />
      <HowItWorks />
      <LandingFooter />
    </div>
  );
}
