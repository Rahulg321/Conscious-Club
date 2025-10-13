import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend NextAuth types to include accessToken and id

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken?: string;
      isAdmin?: boolean;
      onboardingCompleted?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken?: string;
    isAdmin?: boolean;
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    isAdmin?: boolean;
    onboardingCompleted?: boolean;
  }
}
