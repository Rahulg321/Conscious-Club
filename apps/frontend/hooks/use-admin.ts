"use client";

import { useSession } from "next-auth/react";

/**
 * Client-side hook to check if the current user is an admin
 * @returns { isAdmin: boolean; isLoading: boolean; user: any }
 */
export function useAdmin() {
  const { data: session, status } = useSession();

  const isAdmin = (session?.user as any)?.isAdmin === true;
  const isLoading = status === "loading";

  return {
    isAdmin,
    isLoading,
    user: session?.user,
  };
}
