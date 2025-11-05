"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
    <Sidebar className="">
      <SidebarHeader className="p-2 border-b border-[#e2e3e6]">
        <div className="flex items-center gap-3">
          <div className=" mx-auto">
            <Link className="cursor-pointer" href="/">
              <Image
                src={CCLogo}
                alt="ConsciousClub Logo"
                className="size-12 mx-auto cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarNavLinks userId={user?.id ?? ""} />
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <div className="flex items-center gap-2 flex-col">
          {isLoadingBravo ? (
            <div className="relative w-full max-w-[180px] aspect-square flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : displayBravo ? (
            <div className="relative w-full max-w-[180px] aspect-square">
              <Image
                src={displayBravo.image}
                alt="Pinned Bravo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="relative py-16 px-4  md:mt-0">
              <div className="absolute  transform -translate-x-1/2 -translate-y-1/2 z-20 ">
                <CardContainer className="inter-var">
                  <CardItem translateZ="100" className="w-max">
                    <Image
                      src={BearSticker}
                      alt="Rollout Center"
                      className="object-cover w-auto  rounded-xl"
                    />
                  </CardItem>
                </CardContainer>
              </div>
            </div>
          )}
          <Button variant="link" asChild className="shrink-0">
            <Link href="/bravos">
              Collect Bravos <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* <BravoDialog /> */}
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
