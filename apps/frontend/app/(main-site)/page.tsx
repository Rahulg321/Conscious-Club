import JoinClubSection from "@/components/sections/join-club";
import React from "react";
import { Metadata } from "next";
import { FAQSection } from "@/components/sections/faq-section";
import ExplorersSections from "@/components/sections/explorers-section";
import JoinPlatform from "@/components/sections/join-platform";
import HeroSection from "@/components/sections/hero-section";
import TitleHighlight from "@/components/title-highlight";
import AheadSection from "@/components/sections/ahead-section";

export const metadata: Metadata = {
  title: "ConsciousClubb — Create, Explore, Earn Bravos",
  description:
    "Join ConsciousClubb: the gamified platform where explorers, creators, organizers, and brands connect. Join challenges, earn Bravos, and unlock rewards.",
};

const HomePage = async () => {
  return (
    <div>
      <HeroSection />
      <JoinPlatform />
      <ExplorersSections />
      <AheadSection />
      <FAQSection />
      <JoinClubSection />
      <TitleHighlight />
    </div>
  );
};

export default HomePage;
