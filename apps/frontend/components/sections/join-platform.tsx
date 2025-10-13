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
import BenefitCard1 from "@/public/benefit-cards/CC_BenefitCards1.png";
import BenefitCard2 from "@/public/benefit-cards/CC_BenefitCards2.png";
import BenefitCard3 from "@/public/benefit-cards/CC_BenefitCards3.png";
import BenefitCard4 from "@/public/benefit-cards/CC_BenefitCards4.png";
import BenefitCard5 from "@/public/benefit-cards/CC_BenefitCards5.png";
import Image from "next/image";

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
    <div className="mt-16">
      <div className="box-section" ref={container}>
        <div>
          <div className="flex flex-col items-center justify-center text-center my-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Why Join Our Platform?
            </h2>
            <p className="text-base text-muted-foreground max-w-xl">
              Because we’re the global playground for creativity, fun and
              Bravos.
            </p>
          </div>
          <div className="boxes space-y-12">
            <div className="box box1">
              <div>
                <Image src={BenefitCard1} alt="Benefit Card 1" />
              </div>
            </div>
            <div className="box box2">
              <div>
                <Image src={BenefitCard2} alt="Benefit Card 2" />
              </div>
            </div>
            <div className="box box3">
              <div>
                <Image src={BenefitCard3} alt="Benefit Card 3" />
              </div>
            </div>
            <div className="box box4">
              <div>
                <Image src={BenefitCard4} alt="Benefit Card 4" />
              </div>
            </div>
            <div className="box box5">
              <div>
                <Image src={BenefitCard5} alt="Benefit Card 5" />
              </div>
            </div>
          </div>
          <div className="spacer "></div>
          <div className="spacer "></div>
        </div>
      </div>
    </div>
  );
};

export default JoinPlatform;
