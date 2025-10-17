import React from "react";
import SplitFeatureSection from "./SplitFeatureSection";

const ExplorersSections = async () => {
  return (
    <div className="block-space">
      <div className="flex flex-col items-center justify-center text-center my-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
          Who is this for?
        </h2>
        <p className="text-base mt-2 text-muted-foreground">
          For all those who have a zest for life
        </p>
      </div>
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
    </div>
  );
};

export default ExplorersSections;
