import React from "react";
import SplitFeatureSection from "./SplitFeatureSection";

const ExplorersSections = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center my-12">
        <h2 className=" font-bold mb-2">Who is this for?</h2>
        <p className="text-lg text-muted-foreground">
          For all those who have a zest for life
        </p>
      </div>

      <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Explorers"
        image={{
          src: "/explorers.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Join fun and engaging challenges" },
          { text: "Win rewards while learning new things" },
          { text: "Discover exciting ideas and trends" },
        ]}
        accentClassName="text-[rgba(81,74,219,1)]"
        iconClassName="text-purple-600"
        orientation="row"
      />

      <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Creators"
        image={{
          src: "creators.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Showcase your talent to a wide audience" },
          { text: "Participate in campaigns and challenges" },
          { text: "Earn money, gigs and build your portfolio" },
        ]}
        accentClassName="text-[rgba(234,89,31,1)]"
        iconClassName="text-[rgba(224,30,90,1)]"
        orientation="row-reverse"
      />

      <SplitFeatureSection
        eyebrow="Who is this for?"
        title="Organizers"
        image={{
          src: "organizers.png",
          alt: "Explorers app interface with person using phone",
        }}
        features={[
          { text: "Create and run large-scale challenges easily" },
          { text: "Attract participants and boost engagement" },
          { text: "Connect with a vibrant creative community" },
        ]}
        accentClassName="text-purple-600"
        iconClassName="text-[rgba(255,153,0,1)]"
        orientation="row"
      />
    </div>
  );
};

export default ExplorersSections;
