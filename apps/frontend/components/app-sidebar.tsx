import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNavLinks } from "@/components/sidebar-nav-links";
import { SidebarUserNav } from "./sidebar-user-nav";
import CCLogo from "@/public/cc_logo.png";
import Image from "next/image";
import Link from "next/link";

import PinnedBravoDisplay from "./pinned-bravo-display";
import React, { Suspense } from "react";

export default async function AppSidebar() {
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
        <Suspense>
          <SidebarNavLinks />
        </Suspense>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <PinnedBravoDisplay />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <SidebarUserNav />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
