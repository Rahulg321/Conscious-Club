"use client";

import { PenTool, Database, Camera, MicVocal } from "lucide-react";

import React, { useRef } from "react";

import RolloutCenter from "@/public/CC_LandingPage_RolloutCentre.png";
import Image from "next/image";
// import HeroMarqueeSection from "./hero-marquee-section";
import { ShinyButton } from "@/components/ui/shiny-btn";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import CircularGallery from "@/components/ui/circular-galary";
// import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import HeroMarqueeSection from "./hero-marquee-section";
import { useRouter } from "next/navigation";

// Floating Icon Components
const FloatingPenTool = () => (
  <div className="hidden sm:flex absolute pointer-events-none top-8 left-4 sm:top-10 sm:left-5 md:top-12 md:left-12 lg:top-14 lg:left-16 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EA591F] rounded-xl items-center justify-center rotate-12 shadow-lg">
    <PenTool className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
  </div>
);

const FloatingDatabase = () => (
  <div className="hidden sm:flex absolute pointer-events-none top-6 right-4 sm:top-8 sm:right-8 md:top-10 md:right-12 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-teal-600 rounded-xl items-center justify-center -rotate-12 shadow-lg">
    <Database className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
  </div>
);
const FloatingCamera = () => (
  <div className="hidden sm:flex absolute pointer-events-none bottom-24 left-6 sm:bottom-20 sm:left-4 md:bottom-32 md:left-24 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-yellow-400 rounded-xl items-center justify-center rotate-12 shadow-lg">
    <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
  </div>
);

const FloatingMicVocal = () => (
  <div className="hidden sm:flex absolute pointer-events-none bottom-28 right-6 sm:bottom-24 sm:right-8 md:bottom-36 md:right-32 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#514ADB] rounded-2xl items-center justify-center -rotate-12 shadow-2xl">
    <MicVocal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
  </div>
);

const HeroSection = () => {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  return (
    <div ref={container}>
      <div className="relative overflow-hidden z-2">
        <FloatingPenTool />
        <FloatingDatabase />
        <FloatingCamera />
        <FloatingMicVocal />

        <div className="py-6 mx-auto px-2 pt-24 sm:px-4 md:px-6 lg:px-8 flex flex-col items-center justify-start md:min-h-[65vh] text-center">
          <h1 className="font-medium font- text-3xl inter-font sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl mb-1 md:mb-6 max-w-4xl lg:max-w-5xl xl:max-w-6xl leading-[0.8]">
            Building the{" "}
            {/* <span className="gradient-text  itc-font text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl italic">Creator economy</span> */}
            <span className="bg-gradient-to-r from-orange-400 via-purple-500  to-red-400 inline-block text-transparent bg-clip-text  itc-font text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl italic">
              Creator economy
            </span>{" "}
            of tomorrow
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-semibold mb-8 max-w-xl lg:max-w-2xl xl:max-w-3xl leading-relaxed">
            Join the platform that connects curious minds and creative talent
            through self- expression, play and rewards
          </p>

          <ShinyButton
            className="cursor-point"
            onClick={() => router.push("/register")}
          >
            Join the Clubb
          </ShinyButton>
        </div>
      </div>

      <div className="relative py-4 md:py-8 px-4 mt-2 md:mt-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <CardContainer className="inter-var">
            <CardItem translateZ="100" className="w-max">
              <Image
                src={RolloutCenter}
                alt="Rollout Center"
                className="object-cover w-auto h-[18rem] sm:h-[22rem] md:h-[26rem] lg:h-[30rem] xl:h-[36rem] 2xl:h-[42rem] 3xl:h-[48rem] max-h-[90vh] rounded-xl"
              />
            </CardItem>
          </CardContainer>
        </div>
        <div
          className="hidden md:block"
          style={{ height: "500px", position: "relative" }}
        >
          <CircularGallery
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </div>
        <div className="block md:hidden">
          <HeroMarqueeSection />
        </div>
      </div>
      {/* <LightRays /> */}
    </div>
  );
};

export default HeroSection;
