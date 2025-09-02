import JoinClubSection from "@/components/sections/join-club";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConsciousClub",
  description: "ConsciousClub",
};

const page = () => {
  return (
    <div>
      <JoinClubSection />
    </div>
  );
};

export default page;
