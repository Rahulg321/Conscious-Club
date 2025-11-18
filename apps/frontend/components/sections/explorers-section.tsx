import React from "react";
import SplitFeatureSection from "./SplitFeatureSection";
import SplashCursor from "@/components/ui/splash-cursor";

const ExplorersSections = async () => {
  return (
    <div className="md:py-8">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
          Who is this for?
        </h2>
        <p className="text-base text-muted-foreground">
          For all those who have a zest for life
        </p>
      </div>
      <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Creators"
        image={{
          src: "CREATOR.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Flex your talent, globally" },
          { text: "Create fun collabs (a.k.a mashups) & grow your community" },
          { text: "Discover creators & trends worldwide" },
        ]}
        accentClassName="text-[rgba(234,89,31,1)]"
        iconClassName="text-[rgba(224,30,90,1)]"
        orientation="row-reverse"
      />
      <SplashCursor />
    </div>
  );
};

export default ExplorersSections;
