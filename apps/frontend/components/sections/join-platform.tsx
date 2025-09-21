"use client";

import React from "react";
import MonetizeContentSection from "./monetize-content";
import CollabBrandsSection from "./collab-brands-section";
import PlayEarnRewards from "./play-earn-rewards";
import ExclusivePerks from "./exclusive-perks";
import CommunityBanner from "./community-banner";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger); // register the hook to avoid React version discrepancies

const JoinPlatform = () => {
  const container = useRef(null);

  useGSAP(
    () => {
      let cards: HTMLElement[] = gsap.utils.toArray(".box");
      let stackHeight = window.innerHeight * 0.01;
      console.log(gsap.utils.checkPrefix("filter"));
      cards.forEach((card, i) => {
        gsap.fromTo(
          card.querySelector("div"),
          {
            transformOrigin: "center top",
          },
          {
            scrollTrigger: {
              trigger: card,
              scrub: true,
              start: "top " + stackHeight,
              end: "+=" + window.innerHeight * 2,
              invalidateOnRefresh: true,
              id: `card-${i}`,
            },
          }
        );
        // pin separately because we want the pinning to last the whole length of the page, but the animation should only be part of it.
        //responsible for pinning each instance of the card

        ScrollTrigger.create({
          trigger: card,
          pin: true,
          start: "top " + stackHeight,
          endTrigger: ".following-content",
          end: "top " + (stackHeight + 100),
          pinSpacing: false,
        });
      });
    },
    {
      scope: container,
    }
  );

  return (
    <div className="">
      <div className="box-section" ref={container}>
        <div>
          <div className="flex flex-col items-center justify-center text-center my-12">
            <h2 className="font-bold mb-4">Why Join Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Because loyalty and creativity should feel like pleasure and
              comfort, not work.
              <br />
              CC gives you a space to explore, create, and collaborate.
            </p>
          </div>
          <div className="boxes space-y-12">
            <MonetizeContentSection className="box1 box " />
            <CollabBrandsSection className="box2 box " />
            <PlayEarnRewards className="box3 box " />
            <ExclusivePerks className="box4 box " />
            <CommunityBanner className="box5 box " />
          </div>
          <div className="following-content"></div>
          <div className="spacer"></div>
          <div className="spacer"></div>
        </div>
      </div>
    </div>
  );
};

export default JoinPlatform;
