"use client";

import React, { useEffect, useState } from "react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const DashboardHeader = () => {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const [followCounts, setFollowCounts] = useState<{
    followers: number;
    following: number;
  } | null>(null);

  const getPageTitle = (path: string): string => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    const route = segments[0];

    switch (route) {
      case "dashboard":
        return "Dashboard";
      case "bravos":
        return "Bravos";
      case "discover":
        return "Discover";
      case "support":
        return "Support & FAQ";
      case "profile":
        return "Profile";
      case "challenges":
        return "BravoPlay";
      case "creative":
        return "Creative";
      default:
        return "Dashboard";
    }
  };

  const pageTitle = getPageTitle(pathname);
  const isCreativePage = pathname === "/creative";

  // Fetch follow counts when on Creative page
  useEffect(() => {
    if (isCreativePage && session?.user?.id) {
      fetch(`/api/follow/counts?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setFollowCounts(data))
        .catch((err) => console.error("Error fetching follow counts:", err));
    }
  }, [isCreativePage, session?.user?.id]);

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 px-4 md:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
      {/* Desktop Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "group relative h-9 w-9 rounded-lg transition-all duration-300",
          "hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50",
          "border border-transparent hover:border-purple-200",
          "hidden md:flex items-center justify-center"
        )}
        aria-label="Toggle Sidebar"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300" />

        {open ? (
          <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-all duration-300 group-hover:scale-110" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-all duration-300 group-hover:scale-110" />
        )}
      </Button>

      {/* Mobile Sidebar Trigger */}
      <SidebarTrigger className="md:hidden h-9 w-9 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-200" />

      {/* Page Title */}
      <div className="flex-1 min-w-0">
        {pageTitle === "Bravos" ? (
          <h1 className="text-xl md:text-2xl font-semibold font-kirang-haerang text-gray-900 truncate">
            {pageTitle}
          </h1>
        ) : (
          <h1 className="text-2xl md:text-3xl font-caveat text-gray-900 truncate">
            {pageTitle}
          </h1>
        )}
        {/* Optional: Add breadcrumb or subtitle here */}
      </div>

      {/* Right section - Show followers/following on Creative page */}
      <div className="flex items-center gap-2">
        {isCreativePage && followCounts && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 flex items-center justify-center bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full">
              {followCounts.followers} followers
            </span>
            <span className="px-3 py-1 flex items-center justify-center bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full">
              {followCounts.following} following
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
