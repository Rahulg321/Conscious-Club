import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const JoinClubSection = () => {
  return (
    <div className="py-8 px-6">
      <div className="relative overflow-hidden bg-gradient-to-r cta min-h-[50vh] sm:min-h-[55vh] rounded-2xl from-[#8f00ff] via-[#a401dd] to-[#171717] flex items-center justify-center p-6 sm:p-8 lg:p-10">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          src="/rectangle.png"
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl lg:max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Brands, join the Club
          </h1>

          <p className="text-white/90 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Run creative, gamified campaigns,
            <br />
            connect with diverse UGC and grow community
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-xl mx-auto w-full">
            <Input
              type="email"
              placeholder="Enter your company email"
              className="flex-1 h-12 sm:h-14 text-sm sm:text-base px-4 sm:px-5 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/40 backdrop-blur-sm min-w-0 w-full"
            />
            <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-xl shadow-sm">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClubSection;
