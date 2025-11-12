"use client";

import { ChevronUp, LoaderIcon, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { status } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <SidebarMenuButton className="data-[state=open]:bg-gradient-to-br data-[state=open]:from-purple-50 data-[state=open]:to-pink-50 bg-white shadow-sm border border-gray-200/50 hover:border-gray-300 h-12 justify-between group/loading">
                <div className="flex flex-row gap-3 items-center flex-1">
                  <div className="size-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse ring-2 ring-gray-100" />
                  {!isCollapsed && (
                    <span className="bg-gradient-to-r from-gray-200 to-gray-300 text-transparent rounded-md animate-pulse flex-1">
                      Loading...
                    </span>
                  )}
                </div>
                <div className="animate-spin text-gray-400">
                  <LoaderIcon className="w-4 h-4" />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                data-testid="user-nav-button"
                tooltip={isCollapsed ? user.name || user.email : undefined}
                className={cn(
                  "data-[state=open]:bg-gradient-to-br data-[state=open]:from-purple-50 data-[state=open]:to-pink-50",
                  "bg-white hover:bg-gray-50",
                  "shadow-sm border border-gray-200/50 hover:border-purple-200 hover:shadow-md",
                  "h-12 transition-all duration-300 group/user",
                  "relative overflow-hidden"
                )}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 opacity-0 group-hover/user:opacity-5 transition-opacity duration-300" />

                {/* Avatar with ring */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-sm opacity-0 group-hover/user:opacity-30 transition-opacity duration-300" />
                  <Image
                    src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                    alt={user.email ?? "User Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-white group-hover/user:ring-purple-200 transition-all duration-300 relative z-10"
                  />
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-20 shadow-sm" />
                </div>

                {/* User info */}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || "User"}
                    </div>
                    <div
                      data-testid="user-email"
                      className="text-xs text-gray-500 truncate"
                    >
                      {user?.email}
                    </div>
                  </div>
                )}

                {/* Chevron icon */}
                {!isCollapsed && (
                  <ChevronUp className="ml-auto w-4 h-4 text-gray-400 group-hover/user:text-purple-600 transition-colors duration-300 group-data-[state=open]:rotate-180 transition-transform" />
                )}
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            align="end"
            className="w-56 p-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl"
          >
            {/* User info header in dropdown */}
            <div className="px-3 py-3 mb-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Image
                  src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                  alt={user.email ?? "User Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group/item"
              onSelect={() => {
                router.push(`/profile/${user.id}`);
              }}
            >
              <UserIcon className="w-4 h-4 mr-3 text-gray-500 group-hover/item:text-purple-600 transition-colors" />
              <span className="font-medium">View Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-gray-100" />

            <DropdownMenuItem
              asChild
              data-testid="user-nav-item-auth"
              className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-red-50 transition-all duration-200 group/logout"
            >
              <button
                type="button"
                className="w-full flex items-center"
                onClick={() => {
                  if (status === "loading") {
                    toast.error(
                      "Checking authentication status, please try again"
                    );
                    return;
                  }

                  signOut({
                    redirectTo: "/",
                  });
                }}
              >
                <LogOut className="w-4 h-4 mr-3 text-gray-500 group-hover/logout:text-red-600 transition-colors" />
                <span className="font-medium group-hover/logout:text-red-600 transition-colors">
                  {user.email ? "Logout" : "Login to your account"}
                </span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
