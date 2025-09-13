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
import CCFaviconLogo from "@/public/CC_Logo_Favicon.png";
import CCLogo from "@/public/cc_logo.png";
import Image from "next/image";

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

      <SidebarContent>
        <div className="text-[#666a6e] text-xs font-medium mb-4 tracking-wide">
          MENU
        </div>
        <SidebarNavLinks />
      </SidebarContent>

      <SidebarFooter className="">
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
