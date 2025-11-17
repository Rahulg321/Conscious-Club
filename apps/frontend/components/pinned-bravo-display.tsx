"use client";
import React from "react";

import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import BearSticker from "@/public/stickers/bear-sticker.png";
import Link from "next/link";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type PinnedBravoState = {
  name: string;
  image: string;
} | null;

const PinnedBravoDisplay = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [displayBravo, setDisplayBravo] = useState<PinnedBravoState>(null);
  const [isLoadingBravo, setIsLoadingBravo] = useState(true);

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
      } else if (isOwnProfile && user?.id) {
        // On own profile, fetch current user's pinned bravo
        setIsLoadingBravo(true);
        fetch(`/api/users/${user.id}/pinned-bravo`)
          .then((res) => res.json())
          .then((data) => {
            setDisplayBravo(data.pinnedBravo || null);
            setIsLoadingBravo(false);
          })
          .catch((error) => {
            console.error("Error fetching current user's pinned bravo:", error);
            setDisplayBravo(null);
            setIsLoadingBravo(false);
          });
      } else {
        setIsLoadingBravo(false);
      }
    } else {
      // Not on a profile page, fetch current user's pinned bravo
      if (user?.id) {
        setIsLoadingBravo(true);
        fetch(`/api/users/${user.id}/pinned-bravo`)
          .then((res) => res.json())
          .then((data) => {
            setDisplayBravo(data.pinnedBravo || null);
            setIsLoadingBravo(false);
          })
          .catch((error) => {
            console.error("Error fetching current user's pinned bravo:", error);
            setDisplayBravo(null);
            setIsLoadingBravo(false);
          });
      } else {
        setIsLoadingBravo(false);
      }
    }
  }, [pathname, user?.id]);

  return (
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
  );
};

export default PinnedBravoDisplay;
