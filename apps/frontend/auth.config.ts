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

export const authConfig = {
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
        return { ...user, type: "credentials" };
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

    jwt({ token, user, account }) {
      // Always set token.id from user.id if user is present (on sign-in)
      if (user) {
        token.id = user.id;
        token.type = (user as any).type || "oauth";
      }

      // Create access token only once when user signs in
      if (user && !token.accessToken) {
        const accessToken = sign(
          {
            id: token.id,
            type: token.type,
            email: user.email,
          },
          process.env.AUTH_SECRET as string,
          { expiresIn: "7d" } // Add expiration for security
        );
        token.accessToken = accessToken;
        console.log("Created access token for user:", user.email);
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.accessToken) {
          (session.user as any).accessToken = token.accessToken;
        }
        if (token.type) {
          (session.user as any).type = token.type;
        }
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
