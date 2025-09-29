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

export function AppSidebar({ user }: { user: User | null }) {
  return (
    <Sidebar className="border-r border-[#e2e3e6]" variant="inset">
      <SidebarHeader className="p-2 border-b border-[#e2e3e6]">
        <div className="flex items-center gap-3">
          <div className=" mx-auto">
            <Image
              src={CCLogo}
              alt="ConsciousClub Logo"
              className="size-12 mx-auto"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarNavLinks />
      </SidebarContent>

      <SidebarFooter className="">
        <div className="flex items-center gap-2 flex-col">
          <Image src={BearSticker} alt="Bear Sticker" />
          <Button variant="link" asChild>
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
