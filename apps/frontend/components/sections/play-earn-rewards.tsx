import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PlayEarnRewardsImage from "@/public/play-earn-rewards.png";

export default function PlayEarnRewards({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl overflow-hidden h-[450px] sm:h-[500px] lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="order-2 lg:order-1 flex items-center px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
            <div className="w-full max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 sm:mb-5 lg:mb-6">
                Play, Earn & Flex!
              </h2>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-5 sm:mb-7 lg:mb-8 font-light leading-relaxed">
                Take on fun challenges - rack up Bravos!
              </p>

              {/* Game Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {/* Top Row */}
                <Button className="bg-white text-[#6366f1] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  Selfie Style Challenge
                </Button>
                <Button className="bg-white text-[#6366f1] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  Lucky Spinner
                </Button>

                {/* Bottom Row */}
                <Button className="bg-white text-[#6366f1] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  Give away
                </Button>
                <Button className="bg-white text-[#6366f1] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  More games are coming soon...
                </Button>
              </div>
            </div>
          </div>

          {/* Right Illustration Section */}
          <div className="order-1 lg:order-2 relative h-[260px] sm:h-[300px] lg:h-full aspect-[4/3] lg:aspect-auto">
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
