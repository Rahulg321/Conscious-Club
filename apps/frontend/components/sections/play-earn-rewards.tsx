import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PlayEarnRewardsImage from "@/public/play-earn-rewards.png";

export default function PlayEarnRewards({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl overflow-hidden h-[400px] lg:h-[480px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="order-2 lg:order-1 flex items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="w-full max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Play, Earn & Flex!
              </h2>

              {/* Subheading */}
              <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-4 sm:mb-6 font-light leading-relaxed">
                Take on fun challenges - rack up Bravos!
              </p>

              {/* Game Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {/* Top Row */}
                <Button className="bg-white text-[#6366f1] px-3 py-2 rounded-2xl text-[10px] sm:text-xs font-medium hover:bg-white/90 whitespace-nowrap">
                  Selfie Style Challenge
                </Button>
                <Button className="bg-white text-[#6366f1] px-3 py-2 rounded-2xl text-[10px] sm:text-xs font-medium hover:bg-white/90 whitespace-nowrap">
                  Lucky Spinner
                </Button>

                {/* Bottom Row */}
                <Button className="bg-white text-[#6366f1] px-3 py-2 rounded-2xl text-[10px] sm:text-xs font-medium hover:bg-white/90 whitespace-nowrap">
                  Give away
                </Button>
                <Button className="bg-white text-[#6366f1] px-3 py-2 rounded-2xl text-[10px] sm:text-xs font-medium hover:bg-white/90 whitespace-nowrap">
                  More games are coming soon...
                </Button>
              </div>
            </div>
          </div>

          {/* Right Illustration Section */}
          <div className="relative h-[240px] lg:h-full">
            <Image
              src={PlayEarnRewardsImage}
              alt="Colorful animals including a panda DJ with turntables at a vibrant party"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
