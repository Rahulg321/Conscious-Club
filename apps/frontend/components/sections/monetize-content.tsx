import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import YoungManCharacterWithPhone from "@/public/young-man-character-with-phone.jpg";

export default function MonetizeContentSection({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={cn("", className)}>
      <div className="rounded-3xl bg-[#1a1a1a] overflow-hidden h-[400px] lg:h-[480px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Text column */}
          <div className="order-2 lg:order-1 flex items-center py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Monetize
                <br />
                Your Content
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-[#dddfe1] mb-4 sm:mb-6 font-light leading-relaxed">
                Turn your creativity into cool rewards
              </p>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-sm sm:text-base lg:text-lg text-white font-medium">
                  Join as
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Button className="bg-[#cdff98] text-black px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                    Visual Arts & Design
                  </Button>
                  <Button className="bg-[#aa9bff] text-white px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                    Video & Motion Media
                  </Button>
                  <Button className="bg-[#ffc471] text-black px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                    Writing & Storytelling
                  </Button>
                  <Button className="bg-[#ff8787] text-white px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                    Performance & Audio
                  </Button>
                  <Button className="bg-[#8bb0ff] text-white px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                    Tech & Digital Creation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 lg:order-2 relative h-[240px] lg:h-full">
            <Image
              src={YoungManCharacterWithPhone}
              alt="3D character with colorful hair holding a phone"
              priority
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
