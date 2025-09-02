import React from "react";
import MonetizeContentSection from "./monetize-content";
import CollabBrandsSection from "./collab-brands-section";
import PlayEarnRewards from "./play-earn-rewards";
import ExclusivePerks from "./exclusive-perks";
import CommunityBanner from "./community-banner";

const JoinPlatform = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center my-12">
        <h3 className="text-3xl font-bold mb-4">Why Join Our Platform?</h3>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Because loyalty and creativity should feel like pleasure and comfort,
          not work.
          <br />
          CC gives you a space to explore, create, and collaborate.
        </p>
      </div>

      <div>
        <MonetizeContentSection />
        <CollabBrandsSection />
        <PlayEarnRewards />
        <ExclusivePerks />
        <CommunityBanner />
      </div>
    </div>
  );
};

export default JoinPlatform;
