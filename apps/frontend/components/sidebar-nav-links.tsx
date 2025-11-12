"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, Trophy, Sparkles } from "lucide-react";
import { FaCompass, FaHeart } from "react-icons/fa";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeGradient: string;
  activeBg: string;
  activeText: string;
  iconColor: string;
};

export function SidebarNavLinks({ userId }: { userId: string }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const navLinks: NavLink[] = [
    {
      label: "Profile",
      href: `/profile/${userId}`,
      icon: <User className="w-5 h-5" />,
      activeGradient: "from-pink-500/10 to-rose-500/10",
      activeBg: "bg-gradient-to-br from-pink-50 to-rose-50",
      activeText: "text-pink-700",
      iconColor: "text-pink-600",
    },
    {
      label: "Discover",
      href: "/discover",
      icon: <FaCompass className="w-5 h-5" />,
      activeGradient: "from-yellow-500/10 to-orange-500/10",
      activeBg: "bg-gradient-to-br from-yellow-50 to-orange-50",
      activeText: "text-yellow-700",
      iconColor: "text-yellow-600",
    },
    {
      label: "Bravos",
      href: "/bravos",
      icon: <FaHeart className="w-5 h-5" />,
      activeGradient: "from-red-500/10 to-pink-500/10",
      activeBg: "bg-gradient-to-br from-red-50 to-pink-50",
      activeText: "text-red-700",
      iconColor: "text-red-600",
    },
    {
      label: "BravoPlay",
      href: "/challenges",
      icon: <Trophy className="w-5 h-5" />,
      activeGradient: "from-amber-500/10 to-yellow-500/10",
      activeBg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      activeText: "text-amber-700",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <SidebarMenu className="gap-1.5">
      {navLinks.map((item) => {
        const isActive = pathname.includes(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={isCollapsed ? item.label : undefined}
              className={cn(
                "relative overflow-hidden group/navitem",
                "transition-all duration-300 ease-out",
                isActive
                  ? cn(
                      item.activeBg,
                      item.activeText,
                      "shadow-sm border border-gray-200/50",
                      "font-semibold"
                    )
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 border border-transparent"
              )}
              asChild
            >
              <Link href={item.href} className="relative">
                {/* Animated gradient background on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 opacity-0 group-hover/navitem:opacity-5 transition-opacity duration-300" />
                )}

                {/* Icon with color */}
                <div
                  className={cn(
                    "relative z-10 transition-all duration-300",
                    isActive
                      ? cn(item.iconColor, "scale-110")
                      : "text-gray-500 group-hover/navitem:text-gray-700 group-hover/navitem:scale-110"
                  )}
                >
                  {item.icon}
                </div>

                {/* Label with smooth fade */}
                <span
                  className={cn(
                    "relative z-10 font-medium transition-all duration-300",
                    isCollapsed && "opacity-0 w-0",
                    !isCollapsed && "opacity-100"
                  )}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full shadow-lg shadow-purple-500/50 animate-in fade-in slide-in-from-left-2 duration-300" />
                )}

                {/* Sparkle effect on active */}
                {isActive && !isCollapsed && (
                  <Sparkles className="absolute right-3 w-3.5 h-3.5 text-yellow-500 opacity-60 animate-pulse" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
