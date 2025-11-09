"use client";

import React from "react";
import { useRef, useEffect } from "react";
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

  // Add resize handler to recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(
    () => {
      let cards: HTMLElement[] = gsap.utils.toArray(".box");

      // Responsive calculations based on screen size
      const isSmallScreen = window.innerWidth < 768; // md breakpoint
      const isMediumScreen =
        window.innerWidth >= 768 && window.innerWidth < 1024; // lg breakpoint

      // Adjust stack height based on screen size
      let stackHeight: number;
      if (isSmallScreen) {
        stackHeight = 20; // Fixed pixel value for small screens
      } else if (isMediumScreen) {
        stackHeight = window.innerHeight * 0.02;
      } else {
        stackHeight = window.innerHeight * 0.01; // Original for large screens
      }

      // Adjust animation distance based on screen size
      let animationDistance: number;
      if (isSmallScreen) {
        animationDistance = window.innerHeight * 1.5; // Shorter animation for small screens
      } else if (isMediumScreen) {
        animationDistance = window.innerHeight * 1.8;
      } else {
        animationDistance = window.innerHeight * 2; // Original for large screens
      }

      // Adjust spacing based on screen size
      let spacing: number;
      if (isSmallScreen) {
        spacing = 40; // Smaller spacing for small screens
      } else if (isMediumScreen) {
        spacing = 50;
      } else {
        spacing = 60; // Original spacing for large screens
      }

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
              end: "+=" + animationDistance,
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
          end: "top " + (stackHeight + spacing),
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold md:mb-3">
              Why Join Our Platform?
            </h2>
            <div className="text-base text-muted-foreground max-w-xl">
              Because we’re the global playground for creativity, fun and
              Bravos.
            </div>
          </div>
          <div className="boxes space-y-2">
            <div className="box box1">
              <div className="flex justify-center">
                <Image src={BenefitCard1} alt="Benefit Card 1" />
              </div>
            </div>
            <div className="box box2">
              <div className="flex justify-center">
                <Image src={BenefitCard2} alt="Benefit Card 2" />
              </div>
            </div>
            <div className="box box3">
              <div className="flex justify-center">
                <Image src={BenefitCard3} alt="Benefit Card 3" />
              </div>
            </div>
            <div className="box box4">
              <div className="flex justify-center">
                <Image src={BenefitCard4} alt="Benefit Card 4" />
              </div>
            </div>
            <div className="box box5">
              <div className="flex justify-center">
                <Image src={BenefitCard5} alt="Benefit Card 5" />
              </div>
            </div>
          </div>
          <div className="spacer following-content "></div>
        </div>
      </div>
    </div>
  );
};

export default JoinPlatform;
