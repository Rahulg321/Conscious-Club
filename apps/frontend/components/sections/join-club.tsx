import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import AstroGradient from "@/public/backgrounds/astro-gradient.png";

const JoinClubSection = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden cta min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] rounded-2xl sm:rounded-3xl flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16">
        <Image
          src={AstroGradient}
          alt=""
          fill
          className="absolute inset-0 object-cover"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
            Brands, join the Club
          </h1>

          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-2xl lg:max-w-3xl mx-auto">
            Run creative, gamified campaigns,
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            connect with diverse creators and grow community
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-lg lg:max-w-xl mx-auto w-full">
            <Input
              type="email"
              placeholder="Enter your company email"
              className="flex-1  bg-black/30 border border-white/30  text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white/60 backdrop-blur-md hover:bg-black/40 hover:border-white/40 transition-all duration-200 shadow-lg"
            />
            <Button className="w-full sm:w-auto h-12 sm:h-14 lg:h-16 px-6 sm:px-8 lg:px-10 text-sm sm:text-base lg:text-lg font-semibold bg-white text-black hover:bg-white/90 active:bg-white/80 transition-all duration-200 rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl active:scale-95 min-w-[140px] sm:min-w-[160px]">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClubSection;
