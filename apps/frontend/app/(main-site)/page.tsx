import JoinClubSection from "@/components/sections/join-club";
import React from "react";
import { Metadata } from "next";
import { FAQSection } from "@/components/sections/faq-section";
import ExplorersSections from "@/components/sections/explorers-section";
import AheadSection from "@/components/sections/ahead-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import JoinPlatform from "@/components/sections/join-platform";
import HeroSection from "@/components/sections/hero-section";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "ConsciousClub",
  description: "ConsciousClub",
};

const HomePage = async () => {
  const userSession = await auth();

  console.log(userSession);

  return (
    <div>
      <HeroSection />
      <ExplorersSections />
      <AheadSection />
      <TestimonialsSection />
      <JoinPlatform />
      <FAQSection />
      <JoinClubSection />
    </div>
  );
};

export default HomePage;
