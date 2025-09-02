"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNavLinks } from "@/components/sidebar-nav-links";

export function AppSidebar() {
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

      <SidebarFooter className="p-4 border-t border-[#e2e3e6]">
        <div className="flex items-center gap-3 p-3 hover:bg-[#f9fafb] rounded-lg cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="/professional-woman-portrait.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#171c21]">Raunak Das</div>
            <div className="text-xs text-[#666a6e] truncate">
              majumder@athena.com
            </div>
          </div>
          <div className="w-4 h-4 text-[#666a6e]">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 12l4-4-4-4v8z" />
            </svg>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
