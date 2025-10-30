import Image from "next/image";
import Rollout1 from "@/public/CC_ROLLOUT_1.png";
import Rollout2 from "@/public/CC_ROLLOUT_2.png";
import Rollout3 from "@/public/CC_ROLLOUT_3.png";
import Rollout4 from "@/public/CC_ROLLOUT_4.png";
import Rollout5 from "@/public/CC_ROLLOUT_5.png";

import React from "react";
import { Marquee } from "../ui/marquee";

const HeroMarqueeSection = () => {
  const images = [
    { src: Rollout1, alt: "Rollout 1" },
    { src: Rollout2, alt: "Rollout 2" },
    { src: Rollout3, alt: "Rollout 3" },
    { src: Rollout4, alt: "Rollout 4" },
    { src: Rollout5, alt: "Rollout 5" },
  ];

  return (
    <div className="w-full">
      <Marquee className="[--gap:0.5rem] sm:[--gap:0.7rem] md:[--gap:1rem] lg:[--gap:1.2rem]">
        {images.map((image, index) => (
          <div key={index} className="relative w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96 aspect-[3/4]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, (max-width: 1280px) 288px, (max-width: 1536px) 320px, 384px"
              className="object-contain"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default HeroMarqueeSection;
