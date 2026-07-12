"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingHero } from "@/components/landing/hero";
import { BurnSection } from "@/components/landing/burn-section";
import { CascadeExplainer } from "@/components/landing/cascade-explainer";
import { FailoverExplainer } from "@/components/landing/failover-explainer";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PointYourTools } from "@/components/landing/point-your-tools";
import { Receipts } from "@/components/landing/receipts";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingFooter } from "@/components/landing/landing-footer";
import { WavyDivider } from "@/components/landing/wavy-divider";

export default function Home() {
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="flex w-full flex-col">
      <LandingHero />
      <BurnSection />
      <CascadeExplainer />
      <FailoverExplainer />
      <WavyDivider />
      <HowItWorks />
      <PointYourTools />
      <WavyDivider />
      <Receipts />
      <CtaBand />
      <LandingFooter />
    </div>
  );
}
