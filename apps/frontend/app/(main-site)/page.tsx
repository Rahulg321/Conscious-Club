import React from "react";
import { Metadata } from "next";
import { FAQSection } from "@/components/sections/faq-section";
import ExplorersSections from "@/components/sections/explorers-section";
import JoinPlatform from "@/components/sections/join-platform";
import HeroSection from "@/components/sections/hero-section";
// import SplashCursor from "@/components/ui/splash-cursor";
import AheadSection from "@/components/sections/ahead-section";
import SlideshowSection from "@/components/sections/slideshow-section";
import ComingSoonSection from "@/components/sections/coming-soon-section";

export const metadata: Metadata = {
  title: "ConsciousClubb — Create, Explore, Earn Bravos",
  description:
    "Join ConsciousClubb: the gamified platform where explorers, creators, organizers, and brands connect. Join challenges, earn Bravos, and unlock rewards.",
};

const HomePage = async () => {
  return (
    <div>
      <HeroSection />
      <ExplorersSections />
      <JoinPlatform />

      <AheadSection />
      <FAQSection />
      <SlideshowSection />
      <ComingSoonSection />
    </div>
  );
};

export default HomePage;
