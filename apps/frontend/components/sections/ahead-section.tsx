import React from "react";
import { TextAnimate } from "@/components/ui/text-animate";

const AheadSection = () => {
  return (
    <div className="block-space big-container">
      <div className="flex justify-center items-center min-h-[85vh] px-4 py-12 md:py-16">
        <TextAnimate animation="blurIn" as="h3" className="text-center">
          We're just getting started… here's what's ahead.
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center min-h-[85vh] px-4 py-12 md:py-16">
        <TextAnimate animation="blurIn" as="h3" className="text-center">
          Bravo ladder (e.g., 5 Bravos = unlock a feature, 10 Bravos = profile
          highlight, 50 Bravos = surprise gift!)…
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center min-h-[85vh] px-4 py-12 md:py-16">
        <TextAnimate animation="blurIn" as="h3" className="text-center">
          More Creator Mashup features
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center min-h-[85vh] px-4 py-12 md:py-16">
        <TextAnimate animation="blurIn" as="h3" className="text-center">
          Creator- led community building activities
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center min-h-[85vh] px-4 py-12 md:py-16">
        <TextAnimate animation="blurIn" as="h3" className="text-center">
          Exciting collab opportunities
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center min-h-[85vh] px-4 py-12 md:py-16">
        <TextAnimate animation="blurIn" as="h3" className="text-center">
          & lots more…
        </TextAnimate>
      </div>
    </div>
  );
};

export default AheadSection;
