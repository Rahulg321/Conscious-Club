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
      <div className="rounded-3xl bg-[#1a1a1a] overflow-hidden h-[450px] sm:h-[500px] lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Text column */}
          <div className="order-2 lg:order-1 flex items-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-10">
            <div className="w-full max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 sm:mb-5 lg:mb-6">
                Monetize
                <br />
                Your Creativity
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-[#dddfe1] mb-5 sm:mb-7 lg:mb-8 font-light leading-relaxed">
                Turn your art, videos, beats, or words into perks
              </p>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg lg:text-xl text-white font-medium">
                  Join as
                </h3>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  <Button className="bg-[#cdff98] text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-[#cdff98]/90">
                    Visual Arts & Design
                  </Button>
                  <Button className="bg-[#aa9bff] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-[#aa9bff]/90">
                    Video & Motion Media
                  </Button>
                  <Button className="bg-[#ffc471] text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-[#ffc471]/90">
                    Writing & Storytelling
                  </Button>
                  <Button className="bg-[#ff8787] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-[#ff8787]/90">
                    Performance & Audio
                  </Button>
                  <Button className="bg-[#8bb0ff] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-[#8bb0ff]/90">
                    Tech & Digital Creation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 lg:order-2 relative h-[260px] sm:h-[300px] lg:h-full aspect-[4/3] lg:aspect-auto">
            <Image
              src={YoungManCharacterWithPhone}
              alt="3D character with colorful hair holding a phone"
              priority
              fill
              className="object-cover object-center lg:rounded-r-3xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
