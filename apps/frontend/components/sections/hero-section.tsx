"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Database, Camera, MicVocal } from "lucide-react";
import Link from "next/link";

import { useRef } from "react";

import RolloutCenter from "@/public/CC_LandingPage_RolloutCentre.png";
import Image from "next/image";
import HeroMarqueeSection from "./hero-marquee-section";

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

  return (
    <div ref={container}>
      <div className="relative overflow-hidden">
        <FloatingPenTool />
        <FloatingDatabase />
        <FloatingCamera />
        <FloatingMicVocal />

        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-8 border-2 border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
            <span
              className="text-white px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background:
                  "linear-gradient(90deg, #FCB35C -0.08%, #DF60C3 51.36%, #825BF3 99.92%)",
                boxShadow:
                  "inset 0px 4px 6px 2px #FFFFFF9E, inset 0px -2px 6px 2px #00000026, 0px 2px 4.7px 0px #00000047",
              }}
            >
              2000+
            </span>
            <span className="text-gray-700 font-medium text-sm">
              People have onboarded
            </span>
            <div className="flex -space-x-2">
              <Avatar className="size-6 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback className="text-xs">U1</AvatarFallback>
              </Avatar>
              <Avatar className="size-6 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback className="text-xs">U2</AvatarFallback>
              </Avatar>
              <Avatar className="size-6 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback className="text-xs">U3</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-6 max-w-4xl leading-tight">
            Building the Creator economy of{" "}
            <span className="italic itc-font gradient-text">tomorrow.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-semibold mb-8 max-w-xl leading-relaxed">
            Join the platform that connects curious minds, creative talent and
            brands through play and rewards.
          </p>

          <Button
            className="bg-black hover:bg-gray-800 text-white px-6 py-4 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            asChild
          >
            <Link href="/login">Join the Clubb</Link>
          </Button>
        </div>
      </div>
      {/* 
      <div className="relative py-8">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Image
            src={RolloutCenter}
            alt="Rollout Center"
            className="w-full h-full object-cover max-w-xs"
          />
        </div>

        <HeroMarqueeSection />
      </div> */}
    </div>
  );
};

export default HeroSection;
