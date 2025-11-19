import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getFilteredProjects,
  getFilteredUserProfiles,
  getFilteredMashupProjects,
} from "@/lib/queries";
import ProjectTagsFilter from "@/components/project-tag-filters";
// import ProjectDedicationFilters from "@/components/project-dedication-filters";
import React, { Suspense } from "react";
import ProjectSearchFilter from "@/components/project-search-filter";
import DiscoverProjectCard from "@/components/discover-project-card";
import ProjectPagination from "@/components/project-pagination";
import ProjectProfileTabs from "@/components/project-profile-tabs";
import ProjectCardSkeleton from "@/components/skeletons/project-card-skeleton";
import ProfileCard from "@/components/profile-card";
import ProfileCardSkeleton from "@/components/skeletons/profile-card-skeleton";
import ProjectSheet from "@/components/project-sheet";
// import { Sparkles } from "lucide-react";
import { Session } from "next-auth";
import { getPreviewMedia } from "@/lib/utils";

export const metadata = {
  title: "Discover Projects",
  description: "Discover projects on the platform",
};

export default function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between">
          <Suspense fallback={<div>Loading.....</div>}>
            <ProjectSearchFilterWrapper searchParams={searchParams} />
          </Suspense>

          <div className="flex items-center space-x-6">
            <ProjectProfileTabs />
          </div>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectTagsFilter />
      </Suspense>

      {/* {!showProfiles && (
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDedicationFilters />
        </Suspense>
      )} */}

      <Suspense
        fallback={
          <main className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500">Loading...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          </main>
        }
      >
        <DiscoverContent searchParams={searchParams} />
      </Suspense>
      <ProjectSheet />
    </div>
  );
}

async function ProjectSearchFilterWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = params.type;
  const showProfiles = type && type === "profiles" ? true : false;
  return <ProjectSearchFilter showProfiles={showProfiles} />;
}

async function DiscoverContent({
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
      <main className="max-w-1xl mx-auto px-2 py-2">
        {/* <div className="flex items-center justify-between mb-4">
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
            ) : 
            (
              <ProjectCount
                tags={selectedTags}
                projectSearchQuery={projectSearchQuery || ""}
                dedicationFilters={dedicationFilters}
              />
            )}
          </Suspense>
        </div> */}

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
              currentUserId={userSession.user.id}
              userSession={userSession}
            />
          </Suspense>
        ) : showMashups ? (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
  const { projects, totalPages, totalProjects } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    offset,
    limit,
    userId,
    dedicationFilters
  );

  return (
    <div className="group-has-[[data-pending]]:animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {projects?.map((project) => {
          // Get first media item for preview (prefer images)
          const firstMedia = getPreviewMedia(project.media);
          return (
            <DiscoverProjectCard
              key={project.id}
              projectId={project.id}
              projectCoverImage={
                firstMedia || project.media?.[0] || "/placeholder.svg"
              }
              projectName={project.name}
              tagName={project.tag || project.tags?.[0] || ""}
              // projectDescription={project.description || ""}
              projectDescription={""}
              likeCount={project.likeCount}
              isLiked={project.isLiked}
              creatorName={project.creatorName || undefined}
              creatorInfo={
                project.creatorId
                  ? {
                      id: project.creatorId,
                      name: project.creatorName,
                      image: project.creatorImage,
                      location: project.creatorLocation,
                      role: project.creatorRole,
                    }
                  : undefined
              }
              // dedicatedToPerson={project.dedicatedToPerson}
              // dedicatedToBrand={project.dedicatedToBrand}
              // dedicatedToCause={project.dedicatedToCause}
              // dedicationReason={project.dedicationReason}
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
  currentUserId,
  userSession,
}: {
  personSearchQuery: string | undefined;
  limit: number;
  offset: number;
  currentUserId: string;
  userSession: Session;
}) {
  const { userProfiles, totalPages, totalUsers } =
    await getFilteredUserProfiles(
      personSearchQuery,
      offset,
      limit,
      currentUserId
    );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 group-has-[[data-pending]]:animate-pulse bg-white p-4 rounded-3xl">
        {userProfiles?.map((userProfile) => (
          <div key={userProfile.id}>
            <ProfileCard
              userProfile={userProfile}
              currentUserId={currentUserId}
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
    <div>
      <div className="group-has-[[data-pending]]:animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {mashupProjects?.map((mashup) => {
          // Get first media item for preview
          const firstMedia =
            (mashup.media && mashup.media.length > 0
              ? mashup.media[0]
              : "/placeholder.svg") || "/placeholder.svg";

          return (
            <DiscoverProjectCard
              key={mashup.id}
              projectId={mashup.id}
              projectCoverImage={firstMedia}
              projectName={mashup.name}
              tagName="" // Mashups don't have tags in this view
              projectDescription={mashup.description || ""}
              likeCount={mashup.likeCount}
              isLiked={mashup.isLiked}
              creatorName={mashup.creatorName || undefined}
              collaboratorName={mashup.collaboratorName || undefined}
              creatorInfo={
                mashup.creatorId
                  ? {
                      id: mashup.creatorId,
                      name: mashup.creatorName,
                      image: mashup.creatorImage,
                      location: mashup.creatorLocation,
                      role: mashup.creatorRole,
                    }
                  : undefined
              }
              collaboratorInfo={
                mashup.collaboratorId
                  ? {
                      id: mashup.collaboratorId,
                      name: mashup.collaboratorName,
                      image: mashup.collaboratorImage,
                      location: mashup.collaboratorLocation,
                      role: mashup.collaboratorRole,
                    }
                  : undefined
              }
              // dedicatedToPerson={mashup.dedicatedToPerson}
              // dedicatedToBrand={mashup.dedicatedToBrand}
              // dedicatedToCause={mashup.dedicatedToCause}
              // dedicationReason={mashup.dedicationReason}
            />
          );
        })}
      </div>

      <ProjectPagination totalPages={totalPages} />
    </div>
  );
}
