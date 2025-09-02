import React from "react";
import MonetizeContentSection from "./monetize-content";
import CollabBrandsSection from "./collab-brands-section";
import PlayEarnRewards from "./play-earn-rewards";
import ExclusivePerks from "./exclusive-perks";
import CommunityBanner from "./community-banner";

const JoinPlatform = () => {
  return (
    <div>
      <div>
        <h3>Why Join Our Platform?</h3>
        <p>
          Because loyalty and creativity should feel like pleasure and comfort,
          not work. CC gives you a space to explore, create, and
          collaborate.{" "}
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
