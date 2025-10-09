import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  // Get the session using the auth function
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Log the session
  console.log("=== MIDDLEWARE SESSION LOG ===");
  console.log("Path:", pathname);
  console.log("Session exists:", !!session);
  console.log("User ID:", session?.user?.id);
  console.log("User Email:", session?.user?.email);
  console.log("Is Admin:", (session?.user as any)?.isAdmin);
  console.log(
    "Onboarding Completed:",
    (session?.user as any)?.onboardingCompleted
  );
  console.log("==============================");

  // If user is not logged in, let Next.js auth handle it
  if (!session?.user) {
    console.log("❌ No session found, letting auth handle redirect");
    return NextResponse.next();
  }

  const onboardingCompleted = (session.user as any)?.onboardingCompleted;
  const isOnboardingPage = pathname.startsWith("/onboarding");

  // If user hasn't completed onboarding and is not on onboarding page, redirect to onboarding
  if (onboardingCompleted === false && !isOnboardingPage) {
    console.log(
      "🔄 Redirecting to onboarding - user has not completed onboarding"
    );
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // If user has completed onboarding and is on onboarding page, redirect to dashboard
  if (onboardingCompleted === true && isOnboardingPage) {
    console.log(
      "🔄 Redirecting to dashboard - user has already completed onboarding"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log("✅ Allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/blog/:path*",
    "/onboarding/:path*",
    "/",
  ],
};
