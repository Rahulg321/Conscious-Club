"use client";

import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();

  const getPageTitle = (path: string): string => {
    const segments = path.split("/").filter(Boolean);
    // Remove the first segment if it's empty or just "/"
    if (segments.length === 0) return "Dashboard";

    // Handle main dashboard routes
    const route = segments[0]; // Get the main route after potential empty segments
    // const route = segments[1] || segments[0]; // Get the main route after potential empty segments

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
        return "Challenges";
      default:
        return "Dashboard";
    }
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="bg-white border-b border-[#e2e3e6] px-4 md:px-8 py-4 md:py-4 flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl md:text-2xl font-semibold text-[#171c21]">
        {pageTitle}
      </h1>
    </div>
  );
};

export default DashboardHeader;
