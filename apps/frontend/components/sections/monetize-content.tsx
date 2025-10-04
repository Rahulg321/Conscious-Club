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
      <div className="rounded-3xl bg-[#1a1a1a] overflow-hidden h-[500px] lg:h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Text column */}
          <div className="order-2 lg:order-1 flex items-center py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12">
            <div className="w-full max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Monetize
                <br />
                Your Content
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-[#dddfe1] mb-6 sm:mb-8 font-light leading-relaxed">
                Turn your creativity into cool rewards
              </p>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg lg:text-xl text-white font-medium">
                  Join as
                </h3>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button className="bg-[#cdff98] text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    Visual Arts & Design
                  </Button>
                  <Button className="bg-[#aa9bff] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    Video & Motion Media
                  </Button>
                  <Button className="bg-[#ffc471] text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    Writing & Storytelling
                  </Button>
                  <Button className="bg-[#ff8787] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    Performance & Audio
                  </Button>
                  <Button className="bg-[#8bb0ff] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    Tech & Digital Creation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 lg:order-2 relative h-[300px] lg:h-full">
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
