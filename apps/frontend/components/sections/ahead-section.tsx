"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AheadSection = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let cards: HTMLElement[] = gsap.utils.toArray(".sticky-statement");
      let stackHeight = window.innerHeight * 0.01;
      console.log(gsap.utils.checkPrefix("filter"));
      cards.forEach((card, i) => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            end: "bottom center",
            // markers: true,
            toggleActions: "play none reverse none",
            scrub: 1,
          },
        });

        tl.to(card, { opacity: 0, yPercent: -10 });

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
    <div ref={container}>
      <div className="min-h-screen block-space">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <div className="space-y-4 mb-20">
            <h1 className="text-5xl md:text-6xl font-normal text-[#131316] leading-tight">
              We're just getting started.
            </h1>
            <span
              className="text-4xl md:text-5xl itc-font italic leading-tight"
              style={{
                background:
                  "linear-gradient(90deg, #5E3AFF 5.29%, #FB225D 47.12%, #FF9900 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              Here's what's ahead.
            </span>
          </div>

          {/* Content sections */}
          <div className="space-y-32">
            <div className="sticky-statement text-3xl md:text-4xl text-[#131316] py-8">
              <span className="font-normal">Onboarding </span>
              <span className="italic font-light itc-font">
                Explorers, Creators, Organisers
              </span>
            </div>

            <div className="sticky-statement text-3xl md:text-4xl text-[#131316] py-8">
              <span className="font-normal">Building a </span>
              <span className="italic font-light itc-font">
                Community & Gamification
              </span>
            </div>

            <div className="sticky-statement text-3xl md:text-4xl text-[#131316] py-8">
              <span className="italic font-light itc-font">
                Brand Campaigns{" "}
              </span>
              <span className="font-normal italic">roll-out</span>
            </div>

            <div className="sticky-statement text-3xl md:text-4xl itc-font text-[#131316] italic py-8">
              Platform based Challenges
            </div>

            <div className="sticky-statement text-3xl md:text-4xl font-extralight itc-font text-[#131316] italic py-8">
              And more...
            </div>
          </div>

          <div className="following-content"></div>
        </div>
      </div>
    </div>
  );
};

export default AheadSection;
