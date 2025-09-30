import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the current session
  const session = await auth();

  // If user is not logged in, let the auth system handle it
  if (!session?.user?.id) {
    return NextResponse.next();
  }

  // Check if user is trying to access onboarding
  if (pathname.startsWith("/onboarding")) {
    const onboardingCompleted = (session.user as any)?.onboardingCompleted;

    // If user has completed onboarding, redirect to dashboard
    if (onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Check if user is trying to access dashboard without completing onboarding
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    const onboardingCompleted = (session.user as any)?.onboardingCompleted;

    // If user hasn't completed onboarding, redirect to onboarding
    if (!onboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*", "/dashboard/:path*", "/profile/:path*"],
};
