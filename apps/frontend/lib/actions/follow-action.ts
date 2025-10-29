"use server";

import { db } from "@repo/db";
import { follows } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Follow a user
 * @param followingId - The ID of the user to follow
 * @returns Success/error message
 */
export async function followUser(followingId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "You must be logged in to follow users" };
    }

    const followerId = session.user.id;

    // Don't allow users to follow themselves
    if (followerId === followingId) {
      return { error: "You cannot follow yourself" };
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    if (existingFollow.length > 0) {
      return { error: "You are already following this user" };
    }

    // Create the follow relationship
    await db.insert(follows).values({
      followerId,
      followingId,
    });

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/discover");
    revalidatePath("/community");
    revalidatePath(`/profile/${followingId}`);

    return { success: "Successfully followed user" };
  } catch (error) {
    console.error("Error following user:", error);
    return { error: "Failed to follow user" };
  }
}

/**
 * Unfollow a user
 * @param followingId - The ID of the user to unfollow
 * @returns Success/error message
 */
export async function unfollowUser(followingId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "You must be logged in to unfollow users" };
    }

    const followerId = session.user.id;

    // Check if following relationship exists
    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    if (existingFollow.length === 0) {
      return { error: "You are not following this user" };
    }

    // Remove the follow relationship
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/discover");
    revalidatePath("/community");
    revalidatePath(`/profile/${followingId}`);

    return { success: "Successfully unfollowed user" };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { error: "Failed to unfollow user" };
  }
}

/**
 * Check if the current user is following a specific user
 * @param followingId - The ID of the user to check
 * @returns Boolean indicating if following
 */
export async function isFollowing(followingId: string): Promise<boolean> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return false;
    }

    const followerId = session.user.id;

    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    return existingFollow.length > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

/**
 * Get follow count for a user (how many users they follow)
 * @param userId - The ID of the user
 * @returns Number of users they follow
 */
export async function getFollowingCount(userId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: follows.followerId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    return result.length;
  } catch (error) {
    console.error("Error getting following count:", error);
    return 0;
  }
}

/**
 * Get followers count for a user (how many users follow them)
 * @param userId - The ID of the user
 * @returns Number of followers
 */
export async function getFollowersCount(userId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: follows.followingId })
      .from(follows)
      .where(eq(follows.followingId, userId));

    return result.length;
  } catch (error) {
    console.error("Error getting followers count:", error);
    return 0;
  }
}
