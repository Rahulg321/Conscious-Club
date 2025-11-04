import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@repo/db";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

import {
  getUserByEmail,
  getUserById,
  updateUserEmailVerification,
} from "./lib/queries";

const ADMIN_EMAILS = [
  "admin@consciousclub.com",
  "rahul@consciousclub.com",
  "rg5353070@gmail.com",
  "rahulguptax14@gmail.com",
  "rahul@darkalphacapital.com",
  "info@ravisi.ms",
  "manavi@ravisi.ms",
];

const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/",
  },
  providers: [
    Google,
    Credentials({
      authorize: async (credentials) => {
        console.log("inside authorize", credentials);

        const { email, password } = credentials;
        console.log("email pwd", email, password);

        const user = (await getUserByEmail(email as string))?.[0];

        if (!user || !user.password) {
          console.log("User not found or password is null");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!passwordsMatch) {
          console.log("Invalid password, they do not match");
          return null;
        }

        // Don't create access token here - let JWT callback handle it
        return {
          ...user,
          type: "credentials",
          isAdmin: isAdminEmail(user.email as string),
        };
      },
    }),
  ],

  callbacks: {
    signIn: async ({ user, account }) => {
      try {
        if (account?.provider !== "credentials") {
          console.log("inside oauth signin");
          // For OAuth providers, allow sign-in and let the adapter handle user creation
          // The DrizzleAdapter will automatically create the user if they don't exist
          // Email verification will be handled in the linkAccount event
          return true;
        }

        // For credentials provider, check if user exists and is verified
        // The user object from authorize contains the database user data
        if (user.email) {
          const existingUser = await getUserByEmail(user.email as string);
          const dbUser = existingUser?.[0];
          if (!dbUser?.emailVerified) {
            console.log("User email not verified");
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Optional: redirect logged-in users away from auth pages
        // return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },

    jwt: async ({ token, user }) => {
      // Always set token.id from user.id if user is present (on sign-in)
      if (user) {
        token.id = user.id;
        token.type = (user as any).type || "oauth";

        // Set isAdmin flag based on user email
        if (user.email) {
          token.isAdmin = isAdminEmail(user.email);
        }
      }

      // Fetch fresh name, image, and onboarding status from database
      if (token.id) {
        try {
          const dbUser = await getUserById(token.id as string);
          if (dbUser) {
            token.name = dbUser.name;
            token.image = dbUser.image;
            token.onboardingCompleted = dbUser.onboardingCompleted ?? false;
            // Ensure isAdmin is set correctly even on token refresh
            if (dbUser.email) {
              token.isAdmin = isAdminEmail(dbUser.email);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Ensure onboardingCompleted has a default value on error
          if (token.onboardingCompleted === undefined) {
            token.onboardingCompleted = false;
          }
        }
      }

      // Create access token only once when user signs in
      if (user && !token.accessToken) {
        const accessToken = sign(
          {
            id: token.id,
            type: token.type,
            email: user.email,
            isAdmin: token.isAdmin,
          },
          process.env.AUTH_SECRET as string
        );
        token.accessToken = accessToken;
        // console.log(
        //   "Created access token for user:",
        //   user.email,
        //   "isAdmin:",
        //   token.isAdmin,
        //   "onboardingCompleted:",
        //   token.onboardingCompleted
        // );
      }

      return token;
    },

    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).type = token.type;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).onboardingCompleted =
          token.onboardingCompleted ?? false;

        // Debug log to verify onboarding status is being set
        // console.log(
        //   "Session callback - User:",
        //   session.user.email,
        //   "onboardingCompleted:",
        //   token.onboardingCompleted
        // );
      }
      return session;
    },
  },

  events: {
    linkAccount: async ({ user, account }) => {
      // Automatically verify email for OAuth users since the provider has already verified it
      if (account?.provider !== "credentials" && user.id) {
        try {
          await updateUserEmailVerification(user.id as string, new Date());
          console.log("OAuth user email automatically verified:", user.email);
        } catch (error) {
          console.error("Error verifying OAuth user email:", error);
        }
      }
    },
  },
} satisfies NextAuthConfig;
