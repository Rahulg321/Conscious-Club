import React, { Suspense } from "react";
import {
  getFilteredProjects,
  getFilteredUserProfiles,
  getFilteredMashupProjects,
} from "@/lib/queries";
import ProjectTagsFilter from "@/components/project-tag-filters";
import ProjectDedicationFilters from "@/components/project-dedication-filters";
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
  const {
    page,
    query,
    tags,
    type,
    dedicatedToPerson,
    dedicatedToBrand,
    dedicatedToCause,
    dedicationReason,
  } = await searchParams;

  const projectSearchQuery = query as string;
  const currentPage = Number(page) || 1;

  const showProfiles = type && type === "profiles" ? true : false;
  const showMashups = type && type === "mashups" ? true : false;

  // Extract dedication filter parameters
  const dedicationFilters = {
    dedicatedToPerson: dedicatedToPerson as string | undefined,
    dedicatedToBrand: dedicatedToBrand as string | undefined,
    dedicatedToCause: dedicatedToCause as string | undefined,
    dedicationReason: dedicationReason as string | undefined,
  };

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

      {!showProfiles && (
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDedicationFilters />
        </Suspense>
      )}

      <main className="max-w-7xl mx-auto px-6 block-space">
        <div className="flex items-center justify-between mb-8">
          <Suspense
            fallback={<span className="text-gray-500">Loading...</span>}
          >
            {showProfiles ? (
              <ProfileCount personSearchQuery={projectSearchQuery || ""} />
            ) : showMashups ? (
              <MashupCount
                projectSearchQuery={projectSearchQuery || ""}
                dedicationFilters={dedicationFilters}
              />
            ) : (
              <ProjectCount
                tags={selectedTags}
                projectSearchQuery={projectSearchQuery || ""}
                dedicationFilters={dedicationFilters}
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
        ) : showMashups ? (
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
            <FetchAndDisplayMashupProjects
              limit={limit}
              offset={offset}
              projectSearchQuery={projectSearchQuery || ""}
              userId={userSession.user.id}
              dedicationFilters={dedicationFilters}
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
              userId={userSession.user.id}
              dedicationFilters={dedicationFilters}
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
  dedicationFilters,
}: {
  tags: string[] | string | undefined;
  projectSearchQuery: string;
  dedicationFilters: {
    dedicatedToPerson?: string;
    dedicatedToBrand?: string;
    dedicatedToCause?: string;
    dedicationReason?: string;
  };
}) {
  const { totalProjects } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    0,
    1,
    undefined,
    dedicationFilters
  );

  return (
    <span className="text-gray-500">
      {totalProjects} {totalProjects === 1 ? "creation" : "creations"}
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

async function MashupCount({
  projectSearchQuery,
  dedicationFilters,
}: {
  projectSearchQuery: string;
  dedicationFilters: {
    dedicatedToPerson?: string;
    dedicatedToBrand?: string;
    dedicatedToCause?: string;
    dedicationReason?: string;
  };
}) {
  const { totalMashups } = await getFilteredMashupProjects(
    projectSearchQuery,
    0,
    1,
    undefined,
    dedicationFilters
  );

  return (
    <span className="text-gray-500">
      {totalMashups} {totalMashups === 1 ? "mashup" : "mashups"}
    </span>
  );
}

async function FetchAndDisplayProjects({
  projectSearchQuery,
  limit,
  tags,
  offset,
  userId,
  dedicationFilters,
}: {
  projectSearchQuery: string | undefined;
  limit: number;
  tags: string[] | string | undefined;
  offset: number;
  userId: string;
  dedicationFilters: {
    dedicatedToPerson?: string;
    dedicatedToBrand?: string;
    dedicatedToCause?: string;
    dedicationReason?: string;
  };
}) {
  const { projects, totalPages } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    offset,
    limit,
    userId,
    dedicationFilters
  );

  return (
    <div className="group-has-[[data-pending]]:animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => {
          return (
            <CommunityProjectCard
              key={project.id}
              projectId={project.id}
              projectCoverImage={
                project.coverImage || project.media?.[0] || "/placeholder.svg"
              }
              projectName={project.name}
              tagName={project.tag || project.tags?.[0] || ""}
              projectDescription={project.description}
              likeCount={project.likeCount}
              isLiked={project.isLiked}
              dedicatedToPerson={project.dedicatedToPerson}
              dedicatedToBrand={project.dedicatedToBrand}
              dedicatedToCause={project.dedicatedToCause}
              dedicationReason={project.dedicationReason}
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
    <div className="group-has-[[data-pending]]:animate-pulse">
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

async function FetchAndDisplayMashupProjects({
  projectSearchQuery,
  limit,
  offset,
  userId,
  dedicationFilters,
}: {
  projectSearchQuery: string | undefined;
  limit: number;
  offset: number;
  userId: string;
  dedicationFilters: {
    dedicatedToPerson?: string;
    dedicatedToBrand?: string;
    dedicatedToCause?: string;
    dedicationReason?: string;
  };
}) {
  const { mashupProjects, totalPages, totalMashups } =
    await getFilteredMashupProjects(
      projectSearchQuery,
      offset,
      limit,
      userId,
      dedicationFilters
    );

  return (
    <div className="group-has-[[data-pending]]:animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mashupProjects?.map((mashup) => {
          // Show both creator and collaborator names
          const creatorName = mashup.creatorName || "Unknown";
          const collaboratorName = mashup.collaboratorName || "Unknown";

          // Get first media item for preview
          const firstMedia =
            getPreviewMedia(mashup.media) || "/placeholder.svg";

          return (
            <CommunityProjectCard
              key={mashup.id}
              projectId={mashup.id}
              projectCoverImage={firstMedia}
              projectName={mashup.name}
              tagName="" // Mashups don't have tags in this view
              projectDescription={mashup.description}
              likeCount={mashup.likeCount}
              isLiked={mashup.isLiked}
              creatorName={creatorName}
              collaboratorName={collaboratorName}
              dedicatedToPerson={mashup.dedicatedToPerson}
              dedicatedToBrand={mashup.dedicatedToBrand}
              dedicatedToCause={mashup.dedicatedToCause}
              dedicationReason={mashup.dedicationReason}
            />
          );
        })}
      </div>

      <ProjectPagination totalPages={totalPages} />
    </div>
  );
}
