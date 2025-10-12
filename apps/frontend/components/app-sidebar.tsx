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
import { ArrowRight } from "lucide-react";
import BearSticker from "@/public/stickers/bear-sticker.png";
import Link from "next/link";

type AppSidebarProps = {
  user: User | null;
  pinnedBravo: {
    name: string;
    image: string;
  } | null;
};

export function AppSidebar({ user, pinnedBravo }: AppSidebarProps) {
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
          {pinnedBravo ? (
            <div className="relative w-full max-w-[180px] aspect-square">
              <Image
                src={pinnedBravo.image}
                alt="Pinned Bravo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full max-w-[140px] aspect-square">
              <Image
                src={BearSticker}
                alt="Bear Sticker"
                fill
                className="object-contain"
              />
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
