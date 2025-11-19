"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarNavLinks } from "@/components/sidebar-nav-links";
import { User } from "next-auth";
import { SidebarUserNav } from "./sidebar-user-nav";
import CCLogo from "@/public/cc_logo.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import BearSticker from "@/public/stickers/bear-sticker.png";
import Link from "next/link";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  user: User | null;
  pinnedBravo: {
    name: string;
    image: string;
  } | null;
};

type PinnedBravoState = {
  name: string;
  image: string;
} | null;

export function AppSidebar({ user, pinnedBravo }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [displayBravo, setDisplayBravo] =
    useState<PinnedBravoState>(pinnedBravo);
  const [isLoadingBravo, setIsLoadingBravo] = useState(false);

  useEffect(() => {
    // Check if we're on a profile page
    const profileMatch = pathname?.match(/^\/profile\/([^/]+)/);

    if (profileMatch) {
      const profileUserId = profileMatch[1];
      const isOwnProfile = user?.id === profileUserId;

      // If viewing someone else's profile, fetch their pinned bravo
      if (!isOwnProfile && profileUserId) {
        setIsLoadingBravo(true);
        fetch(`/api/users/${profileUserId}/pinned-bravo`)
          .then((res) => res.json())
          .then((data) => {
            setDisplayBravo(data.pinnedBravo || null);
            setIsLoadingBravo(false);
          })
          .catch((error) => {
            console.error("Error fetching profile user's pinned bravo:", error);
            setDisplayBravo(null);
            setIsLoadingBravo(false);
          });
      } else {
        // On own profile or not on profile page, use current user's pinned bravo
        setDisplayBravo(pinnedBravo);
        setIsLoadingBravo(false);
      }
    } else {
      // Not on a profile page, use current user's pinned bravo
      setDisplayBravo(pinnedBravo);
      setIsLoadingBravo(false);
    }
  }, [pathname, user?.id, pinnedBravo]);

  return (
    <Sidebar className="border-r border-gray-200/80 bg-gradient-to-b from-white to-gray-50/30 transition-all duration-300">
      <SidebarHeader className="border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-center"
        )}>
          <Link className="cursor-pointer" href="/">
            <div className="relative">
              <Image
                src={CCLogo}
                alt="ConsciousClub Logo"
                className={cn(
                  "transition-all duration-300",
                  isCollapsed ? "size-9" : "size-11"
                )}
              />
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(
        "transition-all duration-300",
        isCollapsed ? "px-1 py-3" : "px-2 py-3"
      )}>
        <SidebarNavLinks  />
      </SidebarContent>

      <SidebarFooter className={cn(
        "mt-auto border-t border-gray-200/60 bg-white/30 backdrop-blur-sm transition-all duration-300",
        isCollapsed && "items-center"
      )}>
        {/* Bravo Section - Always visible */}
        <div className={cn(
          "flex items-center flex-col transition-all duration-300",
          isCollapsed ? "gap-2" : "gap-3"
        )}>
          {isLoadingBravo ? (
            <div className={cn(
              "relative aspect-square flex items-center justify-center bg-gray-50 rounded-xl transition-all duration-300",
              isCollapsed ? "w-12 h-12" : "w-full max-w-[140px]"
            )}>
              <Loader2 className={cn(
                "animate-spin text-gray-400 transition-all duration-300",
                isCollapsed ? "w-5 h-5" : "w-8 h-8"
              )} />
            </div>
          ) : displayBravo ? (
            <Link
              href="/bravos"
              className={cn(
                "relative aspect-square group/bravo transition-all duration-300",
                isCollapsed ? "w-12 h-12" : "w-full max-w-[140px]"
              )}
              title={isCollapsed ? "Collect Bravos" : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-xl blur-md group-hover/bravo:blur-lg transition-all duration-300" />
              <Image
                src={displayBravo.image}
                alt="Pinned Bravo"
                fill
                className="object-contain relative z-10 group-hover/bravo:scale-105 transition-transform duration-300 rounded-lg"
              />
            </Link>
          ) : (
            <Link
              href="/bravos"
              className={cn(
                "relative transition-all duration-300",
                isCollapsed ? "w-12 h-12" : "py-12 px-4"
              )}
              title={isCollapsed ? "Collect Bravos" : undefined}
            >
              <div className={cn(
                "transition-all duration-300",
                isCollapsed ? "relative" : "absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              )}>
                {isCollapsed ? (
                  <Image
                    src={BearSticker}
                    alt="Collect Bravos"
                    width={48}
                    height={48}
                    className="object-cover rounded-xl hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <CardContainer className="inter-var">
                    <CardItem translateZ="100" className="w-max">
                      <Image
                        src={BearSticker}
                        alt="Rollout Center"
                        className="object-cover w-auto rounded-xl"
                      />
                    </CardItem>
                  </CardContainer>
                )}
              </div>
            </Link>
          )}

          {/* Button - only show when expanded */}
          {!isCollapsed && (
            <Button
              variant="link"
              asChild
              className="shrink-0 text-sm font-medium hover:text-purple-600 transition-colors group/link animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <Link href="/bravos" className="flex items-center gap-1.5">
                Collect Bravos
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>

        {user && <SidebarUserNav  />}
      </SidebarFooter>
    </Sidebar>
  );
}
