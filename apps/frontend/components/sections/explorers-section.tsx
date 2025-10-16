import React from "react";
import SplitFeatureSection from "./SplitFeatureSection";

const ExplorersSections = async () => {
  return (
    <div className="block-space">
      <div className="flex flex-col items-center justify-center text-center my-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
          Who is this for?
        </h2>
        <p className="text-base mt-4 text-muted-foreground">
          For all those who have a zest for life
        </p>
      </div>
      {/* 
      <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Explorers"
        image={{
          src: "/explorers.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Join fun and engaging challenges" },
          { text: "Collect bravos & build your community" },
          { text: "Discover new creators, trends & communities worldwide" },
        ]}
        accentClassName="text-[rgba(81,74,219,1)]"
        iconClassName="text-purple-600"
        orientation="row"
      /> */}

      <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Creators"
        image={{
          src: "creators.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Flex your talent, globally" },
          { text: "Create fun collabs that earn you bravos" },
          { text: "Grow your community & unlock perks" },
        ]}
        accentClassName="text-[rgba(234,89,31,1)]"
        iconClassName="text-[rgba(224,30,90,1)]"
        orientation="row-reverse"
      />

      {/* <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Organizers"
        image={{
          src: "organizers.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Onboard & manage multiple creators under one hub" },
          { text: "Run large-scale community campaigns" },
          { text: "Connect & grow a vibrant creative community" },
        ]}
        accentClassName="text-purple-600"
        iconClassName="text-[rgba(255,153,0,1)]"
        orientation="row"
      /> */}
    </div>
  );
};

export default ExplorersSections;
