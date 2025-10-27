import JoinClubSection from "@/components/sections/join-club";
import React from "react";
import { Metadata } from "next";
import { FAQSection } from "@/components/sections/faq-section";
import ExplorersSections from "@/components/sections/explorers-section";
import JoinPlatform from "@/components/sections/join-platform";
import HeroSection from "@/components/sections/hero-section";
// import SplashCursor from "@/components/ui/splash-cursor";
import AheadSection from "@/components/sections/ahead-section";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SlideshowSection from "@/components/sections/slideshow-section";
{
  /* <TitleHighlight /> */
}
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

      {/* <div className="mt-0 lg:mt-[200px] xl:mt-[300px] 2xl:mt-[400px]">
      </div> */}
      <AheadSection />
      <FAQSection />
      <SlideshowSection />
      {/* <JoinClubSection /> */}
    </div>
  );
};

export default HomePage;
