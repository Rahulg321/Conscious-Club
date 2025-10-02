// "use client";

// import React from "react";
import Image from "next/image";
import Rollout1 from "@/public/CC_LandingPage_Rollout1.png";
import Rollout2 from "@/public/CC_LandingPage_Rollout2.png";
import Rollout3 from "@/public/CC_LandingPage_Rollout3.png";
import Rollout4 from "@/public/CC_LandingPage_Rollout4.png";

// // Marquee Image Component
// const MarqueeImage = ({ src, alt }: { src: any; alt: string }) => (
//   <Image
//     className="marquee-image"
//     src={src}
//     alt={alt}
//     width={256}
//     height={256}
//     style={{ margin: 0, padding: 0 }}
//   />
// );

// const HeroMarqueeSection = () => {
//   return (
//     <section className="enable-animation">
//       <div className="marquee">
//         <ul className="marquee__content">
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout2} alt="Rollout 2" />
//           </li>
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout3} alt="Rollout 3" />
//           </li>

//           <li className="marquee__item">
//             <MarqueeImage src={Rollout1} alt="Rollout 1" />
//           </li>
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout4} alt="Rollout 4" />
//           </li>
//         </ul>

//         <ul aria-hidden="true" className="marquee__content">
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout2} alt="Rollout 2" />
//           </li>
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout3} alt="Rollout 3" />
//           </li>
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout1} alt="Rollout 1" />
//           </li>
//           <li className="marquee__item">
//             <MarqueeImage src={Rollout4} alt="Rollout 4" />
//           </li>
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default HeroMarqueeSection;

import React from "react";
import { Marquee } from "../ui/marquee";

const HeroMarqueeSection = () => {
  return (
    <div>
      <Marquee>
        <Image src={Rollout1} alt="Rollout 1" width={256} height={256} />
        <Image src={Rollout2} alt="Rollout 2" width={256} height={256} />
        <Image src={Rollout3} alt="Rollout 3" width={256} height={256} />
        <Image src={Rollout4} alt="Rollout 4" width={256} height={256} />
      </Marquee>
    </div>
  );
};

export default HeroMarqueeSection;
