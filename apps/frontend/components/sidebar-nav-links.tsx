"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";
import { FaCompass, FaHeart } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

type NavLink = {
  label: string;
  href: string;
  leading?: React.ReactNode;
  activeColor: string;
};

export function SidebarNavLinks() {
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    {
      label: "Profile",
      href: "/profile",
      leading: <User className="w-4 h-4" />,
      activeColor:
        "!bg-[#FEDADA] !text-pink-700 data-[active=true]:!bg-[#FEDADA] data-[active=true]:!text-pink-700",
    },
    {
      label: "Discover",
      href: "/discover",
      leading: <FaCompass className="size-4" />,
      activeColor:
        "!bg-[#FFECCC] !text-yellow-700 data-[active=true]:!bg-[#FFECCC] data-[active=true]:!text-yellow-700",
    },
    {
      label: "Support and FAQ",
      href: "/support",
      leading: <FaHeadphones className="size-4" />,
      activeColor:
        "!bg-[#D7E9FF] !text-blue-700 data-[active=true]:!bg-[#D7E9FF] data-[active=true]:!text-blue-700",
    },
    {
      label: "Bravos",
      href: "/bravos",
      leading: <FaHeart className="size-4" />,
      activeColor:
        "!bg-[#FEDADA] !text-pink-700 data-[active=true]:!bg-[#FEDADA] data-[active=true]:!text-pink-700",
    },
  ];

  return (
    <SidebarMenu>
      {navLinks.map((item) => {
        const isActive = pathname.includes(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive}
              className={
                isActive
                  ? item.activeColor
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
