import { LandingHero } from "@/components/landing/hero";
import { DoodleScene } from "@/components/landing/doodle-scene";
import { FlipbookStory } from "@/components/landing/flipbook-story";
import { Receipts } from "@/components/landing/receipts";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PointYourTools } from "@/components/landing/point-your-tools";
import { LandingFooter } from "@/components/landing/landing-footer";
import { WavyDivider } from "@/components/landing/wavy-divider";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <LandingHero />
      <DoodleScene />
      <HowItWorks />
      <WavyDivider />
      <PointYourTools />
      <WavyDivider />
      <FlipbookStory />
      <WavyDivider />
      <Receipts />
      <WavyDivider />
      <LandingFooter />
    </div>
  );
}
