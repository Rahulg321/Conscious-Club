import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PlayEarnRewardsImage from "@/public/play-earn-rewards.png";

export default function PlayEarnRewards({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl overflow-hidden lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="order-2 lg:order-1 flex items-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 lg:mb-6">
                Play, Earn & Flex!
              </h2>

              <p className="text-base sm:text-lg lg:text-lg text-white/90 mb-6 lg:mb-8 font-light leading-relaxed">
                Take on fun challenges - rack up Bravos!
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative h-[320px] sm:h-[400px] md:h-[450px] lg:h-full w-full">
            <Image
              src={PlayEarnRewardsImage}
              alt="Colorful animals including a panda DJ with turntables at a vibrant party"
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
