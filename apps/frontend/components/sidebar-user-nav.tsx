"use client";

import { ChevronUp, LoaderIcon } from "lucide-react";
import Image from "next/image";
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
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SidebarUserNav() {
  const router = useRouter();

  const { status, data: userSession } = useSession();
  const user = userSession?.user;

  // Loading state - session is being streamed
  if (status === "loading") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 justify-between cursor-not-allowed">
            <div className="flex flex-row gap-2 items-center">
              <div className="size-6 bg-zinc-500/30 rounded-full animate-pulse" />
              <span className="bg-zinc-500/30 text-transparent rounded-md animate-pulse w-24">
                Loading...
              </span>
            </div>
            <div className="animate-spin text-zinc-500">
              <LoaderIcon className="size-4" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Unauthenticated state - no session
  if (status === "unauthenticated" || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                data-testid="user-nav-button"
                className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
              >
                <div className="size-6 bg-zinc-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs text-zinc-500">?</span>
                </div>
                <span data-testid="user-email" className="truncate">
                  Not signed in
                </span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              data-testid="user-nav-menu"
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem asChild data-testid="user-nav-item-auth">
                <button
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Login to your account
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Authenticated state - session is present
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-testid="user-nav-button"
              className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
            >
              <Image
                src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                alt={user.email ?? "User Avatar"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span data-testid="user-email" className="truncate">
                {user.email ?? user.name ?? "User"}
              </span>

              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                if (user.id) {
                  router.push(`/profile/${user.id}`);
                }
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  signOut({
                    redirectTo: "/",
                  });
                }}
              >
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
