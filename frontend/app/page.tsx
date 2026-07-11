import { LandingHero } from "@/components/landing/hero";
import { DoodleScene } from "@/components/landing/doodle-scene";
import { FlipbookStory } from "@/components/landing/flipbook-story";
import { Receipts } from "@/components/landing/receipts";
import { FeatureTrio } from "@/components/landing/feature-trio";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PointYourTools } from "@/components/landing/point-your-tools";
import { LandingFooter } from "@/components/landing/landing-footer";
import { WavyDivider } from "@/components/landing/wavy-divider";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <LandingHero />
      <WavyDivider />
      <DoodleScene />
      <WavyDivider />
      <FlipbookStory />
      <WavyDivider />
      <Receipts />
      <WavyDivider />
      <FeatureTrio />
      <WavyDivider />
      <HowItWorks />
      <WavyDivider />
      <PointYourTools />
      <WavyDivider />
      <LandingFooter />
    </div>
  );
}
