import { db } from "@repo/db";
import {
  passwordResetToken,
  project,
  projectTags,
  projectLikes,
  tags,
  bravos,
  bravoType,
  user,
  verificationToken,
  follows,
} from "@repo/db/schema";
import { eq, and, or, ilike, inArray, desc, count, sql } from "drizzle-orm";
import { generateHashedPassword } from "./utils";
import {
  ProjectProfile,
  UserProfile,
} from "@/components/forms/onboarding/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Create a user
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user
 */
export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    console.log("An error occured trying to create user", error);
    throw new Error("Failed to create user");
  }
}

/**
 * Get a verification token by token
 * @param token - The token to get the verification token for
 * @returns The verification token
 */
export async function getVerificationTokenByToken(token: string) {
  try {
    const [foundVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));
    return foundVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by token",
      error
    );
    return null;
  }
}

/**
 * Get a user by id
 * @param id - The id of the user
 * @returns The user
 */
export async function getUserById(id: string) {
  try {
    console.log(id);

    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    console.log("An error occured trying to get user by id", error);
    return null;
  }
}

/**
 * Get a user by email
 * @param email - The email of the user
 * @returns The user
 */
export async function getUserByEmail(email: string) {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
}

/**
 * Update user email verification status
 * @param userId - The id of the user
 * @param emailVerified - The verification timestamp (null to unverify, Date to verify)
 * @returns The updated user
 */
export async function updateUserEmailVerification(
  userId: string,
  emailVerified: Date | null
) {
  try {
    const [updatedUser] = await db
      .update(user)
      .set({
        emailVerified,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user email verification", error);
    return null;
  }
}

/**
 * Get a password reset token by email
 * @param email - The email to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));
    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by email",
      error
    );
    return null;
  }
}

/**
 * Get a verification token by email
 * @param email - The email to get the verification token for
 * @returns The verification token
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [userVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));
    return userVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by email",
      error
    );
    return null;
  }
};

/**
 * Get a password reset token by token
 * @param token - The token to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByToken(token: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by token",
      error
    );
    return null;
  }
}

/**
 * Get a project by id
 * @param projectId - The id of the project
 * @returns The project
 */
export async function getProjectById(projectId: string) {
  try {
    const [foundProject] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));
    return foundProject;
  } catch (error) {
    console.log("An error occured trying to get project by id", error);
    return null;
  }
}

/**
 * Get a user's projects
 * @param userId - The id of the user
 * @returns The user's projects
 */
export async function getUserProjects(userId: string) {
  try {
    return await db.select().from(project).where(eq(project.userId, userId));
  } catch (error) {
    console.log("An error occured trying to get user projects", error);
    return null;
  }
}

/**
 * Get all tags
 * @returns
 */
export async function getAllTags() {
  try {
    return await db.select().from(tags);
  } catch (error) {
    console.log("An error occured trying to get all tags", error);
    return null;
  }
}

/**
 * Get all projects
 * @returns All projects
 */
export async function getAllProjects() {
  try {
    return await db.select().from(project);
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Get all projects with their corresponding tag names
 * @returns All projects with their tags (flat structure - one row per project-tag combination)
 */
export async function getAllProjectsWithTags() {
  try {
    return await db
      .select({
        project: project,
        tagName: tags.name,
      })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id));
  } catch (error) {
    console.log("An error occured trying to get all projects with tags", error);
    return null;
  }
}

/**
 * Get all projects with their tags grouped
 * @returns All projects with their tags grouped by project
 */
export async function getAllProjectsWithTagsGrouped() {
  try {
    const results = await db
      .select({
        project: project,
        tagName: tags.name,
      })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id));

    // Group tags by project
    const groupedResults = results.reduce(
      (acc, row) => {
        const projectId = row.project.id;

        if (!acc[projectId]) {
          acc[projectId] = {
            ...row.project,
            tags: [],
          };
        }

        if (row.tagName) {
          acc[projectId].tags.push(row.tagName);
        }

        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(groupedResults);
  } catch (error) {
    console.log(
      "An error occured trying to get all projects with tags grouped",
      error
    );
    return null;
  }
}

/**
 * Get filtered projects by tags and search query
 * @param filterTags - The tag IDs to filter by (string or array of strings)
 * @param query - The search query for project name or description
 * @param offset - The offset for pagination
 * @param limit - The limit for pagination
 * @param userId - The current user ID to check like status
 * @returns The filtered projects with pagination info
 */
export async function getFilteredProjects(
  filterTags?: string | string[],
  query?: string,
  offset?: number,
  limit?: number,
  userId?: string
) {
  try {
    // Normalize filterTags to an array of tag ID strings
    const tagIdArray: string[] =
      typeof filterTags === "string"
        ? [filterTags]
        : Array.isArray(filterTags)
          ? filterTags
          : [];

    const conditions = [];

    if (query) {
      conditions.push(
        or(
          ilike(project.name, `%${query}%`),
          ilike(project.description, `%${query}%`)
        )
      );
    }

    if (tagIdArray.length > 0) {
      const projectIdsWithTags = await db
        .selectDistinct({ projectId: projectTags.projectId })
        .from(projectTags)
        .where(inArray(projectTags.tagId, tagIdArray));

      const projectIds = projectIdsWithTags
        .map((p) => p.projectId)
        .filter((id): id is string => id !== null);

      if (projectIds.length > 0) {
        conditions.push(inArray(project.id, projectIds));
      } else {
        return { projects: [], totalPages: 0, totalProjects: 0 };
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get filtered projects with their tags and like counts
    const filteredProjects = await db
      .select({
        id: project.id,
        name: project.name,
        link: project.link,
        description: project.description,
        coverImage: project.coverImage,
        logoImage: project.logoImage,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        tagName: tags.name,
        likeCount: sql<number>`COALESCE((${sql`SELECT COUNT(*) FROM ${projectLikes} WHERE ${projectLikes.projectId} = ${project.id}`}), 0)`,
        isLiked: userId
          ? sql<boolean>`EXISTS(SELECT 1 FROM ${projectLikes} WHERE ${projectLikes.projectId} = ${project.id} AND ${projectLikes.userId} = ${userId})`
          : sql<boolean>`false`,
      })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id))
      .where(whereClause)
      .orderBy(desc(project.createdAt))
      .limit(limit ?? 10)
      .offset(offset ?? 0);

    // Get total count for pagination
    const totalResult = await db
      .select({ total: count(sql`DISTINCT ${project.id}`) })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id))
      .where(whereClause);

    const total = totalResult[0]?.total ?? 0;
    const totalPages = Math.ceil(Number(total) / (limit ?? 10));

    // Group projects with their tags
    const groupedProjects = filteredProjects.reduce(
      (acc, row) => {
        const projectId = row.id;

        if (!acc[projectId]) {
          acc[projectId] = {
            id: row.id,
            name: row.name,
            link: row.link,
            description: row.description,
            coverImage: row.coverImage,
            logoImage: row.logoImage,
            userId: row.userId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            tags: [],
            likeCount: row.likeCount,
            isLiked: row.isLiked,
          };
        }

        if (row.tagName) {
          acc[projectId].tags.push(row.tagName);
        }

        return acc;
      },
      {} as Record<string, any>
    );

    return {
      projects: Object.values(groupedProjects),
      totalPages,
      totalProjects: total,
    };
  } catch (error) {
    console.error("An error occurred trying to get filtered projects", error);
    return { projects: [], totalPages: 0, totalProjects: 0 };
  }
}

/**
 * Get filtered user profiles with pagination and search functionality
 * @param query - Search query for user name, location, discipline, or role
 * @param offset - The offset for pagination
 * @param limit - The limit for pagination
 * @param currentUserId - The ID of the current user (for checking follow status)
 * @returns The filtered user profiles with pagination info
 */
export async function getFilteredUserProfiles(
  query?: string,
  offset?: number,
  limit?: number,
  currentUserId?: string
) {
  try {
    const conditions = [];

    // Add search conditions if query is provided
    if (query) {
      conditions.push(
        or(
          ilike(user.name, `%${query}%`),
          ilike(user.location, `%${query}%`),
          ilike(user.discipline, `%${query}%`),
          ilike(user.role, `%${query}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get users with their latest 3 projects - only specific fields
    const userProfilesWithProjects = await db
      .select({
        // User fields
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        userBannerImage: user.bannerImage,
        userType: user.type,
        userLocation: user.location,
        userDiscipline: user.discipline,
        userRole: user.role,
        userCreatedAt: user.createdAt,
        // Project fields
        projectId: project.id,
        projectName: project.name,
        projectLink: project.link,
        projectDescription: project.description,
        projectCoverImage: project.coverImage,
        projectLogoImage: project.logoImage,
        projectCreatedAt: project.createdAt,
      })
      .from(user)
      .leftJoin(project, eq(user.id, project.userId))
      .where(whereClause)
      .orderBy(desc(user.createdAt), desc(project.createdAt));

    // Get total count for pagination (count distinct users)
    const totalResult = await db
      .select({ total: count(sql`DISTINCT ${user.id}`) })
      .from(user)
      .where(whereClause);

    const total = totalResult[0]?.total ?? 0;
    const totalPages = Math.ceil(Number(total) / (limit ?? 10));

    // Get follow information for all users
    const userIds = [
      ...new Set(userProfilesWithProjects.map((row) => row.userId)),
    ];

    // Get follow counts for all users
    const followCounts = await Promise.all(
      userIds.map(async (userId) => {
        const [followersCount] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(follows)
          .where(eq(follows.followingId, userId));

        const [followingCount] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(follows)
          .where(eq(follows.followerId, userId));

        return {
          userId,
          followersCount: Number(followersCount?.count || 0),
          followingCount: Number(followingCount?.count || 0),
        };
      })
    );

    // Get follow status for current user
    const followStatuses = currentUserId
      ? await Promise.all(
          userIds.map(async (userId) => {
            if (userId === currentUserId) return { userId, isFollowing: false };

            const followCheck = await db
              .select()
              .from(follows)
              .where(
                and(
                  eq(follows.followerId, currentUserId),
                  eq(follows.followingId, userId)
                )
              );

            return {
              userId,
              isFollowing: followCheck.length > 0,
            };
          })
        )
      : userIds.map((userId) => ({ userId, isFollowing: false }));

    const followCountsMap = Object.fromEntries(
      followCounts.map((fc) => [fc.userId, fc])
    );
    const followStatusesMap = Object.fromEntries(
      followStatuses.map((fs) => [fs.userId, fs])
    );

    // Group users with their projects (max 3 per user)
    const groupedUsers = userProfilesWithProjects.reduce(
      (acc, row) => {
        const userId = row.userId;

        if (!acc[userId]) {
          const followInfo = followCountsMap[userId];
          const followStatus = followStatusesMap[userId];

          acc[userId] = {
            id: row.userId,
            name: row.userName,
            email: row.userEmail,
            image: row.userImage,
            bannerImage: row.userBannerImage,
            type: row.userType,
            location: row.userLocation,
            discipline: row.userDiscipline,
            role: row.userRole,
            createdAt: row.userCreatedAt,
            projects: [],
            followersCount: followInfo?.followersCount || 0,
            followingCount: followInfo?.followingCount || 0,
            isFollowing: followStatus?.isFollowing || false,
          } as UserProfile;
        }

        // Only add project if we have less than 3 projects for this user and project exists
        if (row.projectId && acc[userId] && acc[userId]!.projects.length < 3) {
          acc[userId]!.projects.push({
            id: row.projectId,
            name: row.projectName,
            link: row.projectLink,
            description: row.projectDescription,
            coverImage: row.projectCoverImage,
            logoImage: row.projectLogoImage,
            createdAt: row.projectCreatedAt,
          } as ProjectProfile);
        }

        return acc;
      },
      {} as Record<string, UserProfile>
    );

    // Convert to array and apply pagination
    const allUsers = Object.values(groupedUsers);
    const paginatedUsers = allUsers.slice(
      offset ?? 0,
      (offset ?? 0) + (limit ?? 10)
    );

    return {
      userProfiles: paginatedUsers,
      totalPages,
      totalUsers: total,
    };
  } catch (error) {
    console.log("an error occcured trying to get user profiles", error);
    return { userProfiles: [], totalPages: 0, totalUsers: 0 };
  }
}

/**
 * Checks if the current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return (session?.user as any)?.isAdmin === true;
}

/**
 * Redirects to login if user is not authenticated
 * Redirects to unauthorized page if user is not admin
 * @param redirectTo - Optional redirect path for unauthorized users
 */
export async function requireAdmin(redirectTo: string = "/dashboard") {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!(session?.user as any)?.isAdmin) {
    redirect(redirectTo);
  }

  return session;
}

/**
 * Server-side admin check for use in components
 * @returns Promise<{ isAdmin: boolean; user: any }>
 */
export async function getAdminStatus() {
  const session = await auth();
  const isAdminUser = (session?.user as any)?.isAdmin === true;

  return {
    isAdmin: isAdminUser,
    user: session?.user,
  };
}

/**
 * Get all bravos
 * @returns All bravos
 */
export async function getAllBravos() {
  try {
    return await db
      .select({
        id: bravos.id,
        name: bravos.name,
        slug: bravos.slug,
        image: bravos.image,
        type: bravos.type,
        createdAt: bravos.createdAt,
        updatedAt: bravos.updatedAt,
      })
      .from(bravos);
  } catch (error) {
    console.log("An error occured trying to get all bravos", error);
    return null;
  }
}

/**
 * Get a bravo by slug
 * @param slug - The slug of the bravo
 * @returns The bravo
 */
export async function getBravoBySlug(slug: string) {
  try {
    const [bravo] = await db.select().from(bravos).where(eq(bravos.slug, slug));
    return bravo;
  } catch (error) {
    console.log("An error occured trying to get bravo by slug", error);
    return null;
  }
}

/**
 * Get user profile with follow information
 * @param userId - The ID of the user
 * @param currentUserId - The ID of the current user (for checking follow status)
 * @returns User profile with follow information
 */
export async function getUserProfileWithFollowInfo(
  userId: string,
  currentUserId?: string
) {
  try {
    // Get user with projects
    const userWithProjects = await db
      .select({
        // User fields
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        userBannerImage: user.bannerImage,
        userType: user.type,
        userLocation: user.location,
        userDiscipline: user.discipline,
        userRole: user.role,
        userCreatedAt: user.createdAt,
        // Project fields
        projectId: project.id,
        projectName: project.name,
        projectLink: project.link,
        projectDescription: project.description,
        projectCoverImage: project.coverImage,
        projectLogoImage: project.logoImage,
        projectCreatedAt: project.createdAt,
      })
      .from(user)
      .leftJoin(project, eq(user.id, project.userId))
      .where(eq(user.id, userId))
      .orderBy(desc(project.createdAt));

    if (userWithProjects.length === 0) {
      return null;
    }

    const firstRow = userWithProjects[0];
    if (!firstRow) {
      return null;
    }

    // Get follow counts
    const [followersCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(follows)
      .where(eq(follows.followingId, userId));

    const [followingCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      const followCheck = await db
        .select()
        .from(follows)
        .where(
          and(
            eq(follows.followerId, currentUserId),
            eq(follows.followingId, userId)
          )
        );
      isFollowing = followCheck.length > 0;
    }

    // Group projects
    const projects = userWithProjects
      .filter((row) => row.projectId)
      .slice(0, 3) // Limit to 3 projects
      .map((row) => ({
        id: row.projectId,
        name: row.projectName,
        link: row.projectLink,
        description: row.projectDescription,
        coverImage: row.projectCoverImage,
        logoImage: row.projectLogoImage,
        createdAt: row.projectCreatedAt,
      }));

    return {
      id: firstRow.userId,
      name: firstRow.userName,
      email: firstRow.userEmail,
      image: firstRow.userImage,
      bannerImage: firstRow.userBannerImage,
      type: firstRow.userType,
      location: firstRow.userLocation,
      discipline: firstRow.userDiscipline,
      role: firstRow.userRole,
      createdAt: firstRow.userCreatedAt,
      projects,
      followersCount: Number(followersCountResult?.count || 0),
      followingCount: Number(followingCountResult?.count || 0),
      isFollowing,
    };
  } catch (error) {
    console.error("Error getting user profile with follow info:", error);
    return null;
  }
}

/**
 * Get total followers and following counts for a user
 * @param userId - The ID of the user
 * @returns An object with followers and following totals
 */
export async function getUserFollowCounts(userId: string) {
  try {
    const [followersCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(follows)
      .where(eq(follows.followingId, userId));

    const [followingCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));

    return {
      followers: Number(followersCountResult?.count || 0),
      following: Number(followingCountResult?.count || 0),
    };
  } catch (error) {
    console.error("Error getting follow counts", error);
    return { followers: 0, following: 0 };
  }
}
