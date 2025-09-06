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

export function AppSidebar({ user }: { user: User | null }) {
  return (
    <Sidebar className="border-r border-[#e2e3e6]" variant="inset">
      <SidebarHeader className="p-6 border-b border-[#e2e3e6]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#cf5b8d] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-[#cf5b8d] font-semibold text-lg">
            ConsciousClub
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
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
