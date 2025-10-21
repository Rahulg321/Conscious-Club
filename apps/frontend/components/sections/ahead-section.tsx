import React from "react";
import { Box, Search, Loader, Sparkles, Camera } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// import { TextAnimate } from "@/components/ui/text-animate";

const AheadSection = () => {
  return (
    <div className="block-space-mini big-container">
      <ul className="md:pt-54 grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
          title=""
          description="We're just getting started… here's what's ahead."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Loader className="h-4 w-4 text-black dark:text-neutral-400" />}
          title=""
          description="More Creator Mashup features"
        />

        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Camera className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Bravo ladder"
          description="Bravo ladder"
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
          title=""
          description="Creator- led community building activities"
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
          title=""
          description="Exciting collab opportunities"
        />
      </ul>
    </div>
  );
};

export default AheadSection;

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[6rem] list-none ${area} `}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect blur={0} borderWidth={3} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] bg-gradient-to-br from-blue-400/70 via-blue-200/50 to-white">
          <div className="relative flex flex-1 flex-col justify-between gap-2">
            <div className="w-fit rounded-lg  border-[0.5px] border-gray-600 p-2">{icon}</div>
            <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
              {description}
            </h2>
          </div>
        </div>
      </div>
    </li>
  );
};
