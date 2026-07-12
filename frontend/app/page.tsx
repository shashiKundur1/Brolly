"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingHero } from "@/components/landing/hero";
import { DoodleScene } from "@/components/landing/doodle-scene";
import { FlipbookStory } from "@/components/landing/flipbook-story";
import { Receipts } from "@/components/landing/receipts";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CascadeExplainer } from "@/components/landing/cascade-explainer";
import { FailoverExplainer } from "@/components/landing/failover-explainer";
import { PointYourTools } from "@/components/landing/point-your-tools";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingFooter } from "@/components/landing/landing-footer";
import { WavyDivider } from "@/components/landing/wavy-divider";

export default function Home() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex w-full flex-col">
      <LandingHero />
      <DoodleScene />
      <WavyDivider />
      <CascadeExplainer />
      <FailoverExplainer />
      <WavyDivider />
      <HowItWorks />
      <WavyDivider />
      <PointYourTools />
      <WavyDivider />
      <FlipbookStory />
      <WavyDivider />
      <Receipts />
      <CtaBand />
      <LandingFooter />
    </div>
  );
}
