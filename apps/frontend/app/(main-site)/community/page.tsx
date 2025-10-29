import React, { Suspense } from "react";
import { getFilteredProjects, getFilteredUserProfiles } from "@/lib/queries";
import ProjectTagsFilter from "@/components/project-tag-filters";
import ProjectSearchFilter from "@/components/project-search-filter";
import ProjectPagination from "@/components/project-pagination";
import ProjectProfileTabs from "@/components/project-profile-tabs";
import ProjectCardSkeleton from "@/components/skeletons/project-card-skeleton";
import ProfileCard from "@/components/profile-card";
import ProfileCardSkeleton from "@/components/skeletons/profile-card-skeleton";
import CommunityProjectCard from "@/components/community-project-card";
import ProjectSheet from "../../../components/project-sheet";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPreviewMedia } from "@/lib/utils";

export const metadata = {
  title: "Community",
  description: "Discover projects and people from the community",
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const userSession = await auth();

  if (!userSession) redirect("/login");
  if (!userSession.user.onboardingCompleted) redirect("/onboarding");
  const { page, query, tags, type } = await searchParams;

  const projectSearchQuery = query as string;
  const currentPage = Number(page) || 1;

  const showProfiles = type && type === "profiles" ? true : false;

  const selectedTags =
    typeof tags === "string"
      ? tags.split(",").filter(Boolean)
      : Array.isArray(tags)
        ? tags
        : [];

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between">
          <Suspense fallback={<div>Loading.....</div>}>
            <ProjectSearchFilter showProfiles={showProfiles} />
          </Suspense>

          <div className="flex items-center space-x-6">
            <ProjectProfileTabs />
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectTagsFilter />
      </Suspense>

      <main className="max-w-7xl mx-auto px-6 block-space">
        <div className="flex items-center justify-between mb-8">
          <Suspense
            fallback={<span className="text-gray-500">Loading...</span>}
          >
            {showProfiles ? (
              <ProfileCount personSearchQuery={projectSearchQuery || ""} />
            ) : (
              <ProjectCount
                tags={selectedTags}
                projectSearchQuery={projectSearchQuery || ""}
              />
            )}
          </Suspense>
        </div>

        {showProfiles ? (
          <Suspense
            fallback={
              <div className="space-y-4 md:space-y-6">
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
              </div>
            }
          >
            <FetchAndDisplayUserProfiles
              personSearchQuery={projectSearchQuery || ""}
              limit={limit}
              offset={offset}
              userSession={userSession as Session}
            />
          </Suspense>
        ) : (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </div>
            }
          >
            <FetchAndDisplayProjects
              tags={selectedTags}
              limit={limit}
              offset={offset}
              projectSearchQuery={projectSearchQuery || ""}
            />
          </Suspense>
        )}
        <ProjectSheet />
      </main>
    </div>
  );
}

async function ProjectCount({
  tags,
  projectSearchQuery,
}: {
  tags: string[] | string | undefined;
  projectSearchQuery: string;
}) {
  const { totalProjects } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    0,
    1
  );

  return (
    <span className="text-gray-500">
      {totalProjects} {totalProjects === 1 ? "project" : "projects"}
    </span>
  );
}

async function ProfileCount({
  personSearchQuery,
}: {
  personSearchQuery: string;
}) {
  const { totalUsers } = await getFilteredUserProfiles(personSearchQuery, 0, 1);

  return (
    <span className="text-gray-500">
      {totalUsers} {totalUsers === 1 ? "profile" : "profiles"}
    </span>
  );
}

async function FetchAndDisplayProjects({
  projectSearchQuery,
  limit,
  tags,
  offset,
}: {
  projectSearchQuery: string | undefined;
  limit: number;
  tags: string[] | string | undefined;
  offset: number;
}) {
  const { projects, totalPages } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    offset,
    limit
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => {
          // Get first media item for preview
          const firstMedia = getPreviewMedia(project.media);
          return (
            <CommunityProjectCard
              key={project.id}
              projectId={project.id}
              projectCoverImage={
                firstMedia || project.media?.[0] || "/placeholder.svg"
              }
              projectName={project.name}
              tagName={project.tag || project.tags?.[0] || ""}
              projectDescription={project.description}
              likeCount={project.likeCount}
              isLiked={project.isLiked}
            />
          );
        })}
      </div>

      <ProjectPagination totalPages={totalPages} />
    </div>
  );
}

async function FetchAndDisplayUserProfiles({
  personSearchQuery,
  limit,
  offset,
  userSession,
}: {
  personSearchQuery: string | undefined;
  limit: number;
  offset: number;
  userSession: Session;
}) {
  const { userProfiles, totalPages } = await getFilteredUserProfiles(
    personSearchQuery,
    offset,
    limit,
    userSession.user.id
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userProfiles?.map((userProfile) => (
          <div key={userProfile.id}>
            <ProfileCard
              userProfile={userProfile}
              currentUserId={userSession.user.id}
              userSession={userSession}
            />
          </div>
        ))}
      </div>

      <ProjectPagination totalPages={totalPages} />
    </div>
  );
}
