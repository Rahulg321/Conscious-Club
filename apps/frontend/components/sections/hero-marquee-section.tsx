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
    <div>
      <Marquee className="[--gap:1rem]">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-64 md:w-80 aspect-[3/4] overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              quality={95}
              sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
              className="object-cover object-center"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default HeroMarqueeSection;
