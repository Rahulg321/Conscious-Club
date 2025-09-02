import React from "react";
import SplitFeatureSection from "./SplitFeatureSection";

const ExplorersSections = () => {
  return (
    <div>
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
        accentClassName="text-purple-600"
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
        accentClassName="text-purple-600"
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
        orientation="row"
      />
    </div>
  );
};

export default ExplorersSections;
