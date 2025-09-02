"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  leading?: React.ReactNode;
};

const navLinks: NavLink[] = [
  {
    label: "Profile",
    href: "/profile",
    leading: <User className="w-4 h-4" />,
  },
  {
    label: "Discover",
    href: "/discover",
    leading: (
      <div className="w-4 h-4 bg-[#ffeccc] rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-[#e7aa63] rounded-full"></div>
      </div>
    ),
  },
  {
    label: "Support and FAQ",
    href: "/support",
    leading: (
      <div className="w-4 h-4 bg-[#d7e9ff] rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-[#4d83c9] rounded-full"></div>
      </div>
    ),
  },
];

export function SidebarNavLinks() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navLinks.map((item) => {
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive}
              className={
                isActive
                  ? "bg-[#f9fafb] text-[#171c21]"
                  : "text-[#666a6e] hover:bg-[#f9fafb]"
              }
              asChild
            >
              <Link href={item.href}>
                {item.leading}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
