import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const JoinClubSection = () => {
  return (
    <div className="py-12 px-6">
      <div className="bg-gradient-to-r min-h-[70vh] rounded-2xl from-[#8f00ff] via-[#a401dd] to-[#171717] flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="">Brands, join the Club</h1>

          <p className="">
            Run creative, gamified campaigns,
            <br />
            connect with diverse UGC and grow community
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your company email"
              className="flex-1  bg-black/30 border border-white/20 rounded-xl text-white placeholder-[#d9d9d9] focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm min-w-0 w-full sm:w-auto"
            />
            <Button className="bg-white text-black hover:bg-white/90 transition-colors">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClubSection;
