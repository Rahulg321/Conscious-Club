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
      <div className="rounded-3xl bg-[#1a1a1a] overflow-hidden lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Text column */}
          <div className="order-2 lg:order-1 flex items-center py-8 sm:py-10 lg:py-12 px-6 sm:px-8 lg:px-10">
            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 lg:mb-6">
                Monetize
                <br />
                Your Creativity
              </h2>

              <p className="text-base sm:text-lg lg:text-lg text-[#dddfe1] mb-6 lg:mb-8 font-light leading-relaxed">
                Turn your art, videos, beats, or words into perks
              </p>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 lg:order-2 relative h-[320px] sm:h-[400px] md:h-[450px] lg:h-full w-full">
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
