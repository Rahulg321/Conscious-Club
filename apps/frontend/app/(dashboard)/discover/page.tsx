import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getAllTags,
  getFilteredProjects,
  getFilteredUserProfiles,
  getFilteredMashupProjects,
} from "@/lib/queries";
import ProjectTagsFilter from "@/components/project-tag-filters";
import { Suspense } from "react";
import ProjectSearchFilter from "@/components/project-search-filter";
import DiscoverProjectCard from "@/components/discover-project-card";
import ProjectPagination from "@/components/project-pagination";
import ProjectProfileTabs from "@/components/project-profile-tabs";
import ProjectCardSkeleton from "@/components/skeletons/project-card-skeleton";
import ProfileCard from "@/components/profile-card";
import ProfileCardSkeleton from "@/components/skeletons/profile-card-skeleton";
import ProjectSheet from "@/components/project-sheet";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Discover Projects",
  description: "Discover projects on the platform",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const userSession = await auth();

  if (!userSession) redirect("/login");
  const projectTags = await getAllTags();

  const { page, query, tags, type } = await searchParams;

  const projectSearchQuery = query as string;
  const currentPage = Number(page) || 1;

  const showProfiles = type && type === "profiles" ? true : false;
  const showMashups = type && type === "mashups" ? true : false;

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
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between">
          <Suspense fallback={<div>Loading.....</div>}>
            <ProjectSearchFilter showProfiles={showProfiles} />
          </Suspense>

          <div className="flex items-center space-x-6">
            <ProjectProfileTabs />
          </div>
        </div>
      </header>

      {/* <Suspense fallback={<div>Loading...</div>}>
        <ProjectTagsFilter filterTags={projectTags!} />
      </Suspense> */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {showProfiles
              ? "Explore Profiles"
              : showMashups
                ? "Explore Mashups"
                : "Explore Creations"}
          </h1>
          <Suspense
            fallback={<span className="text-gray-500">Loading...</span>}
          >
            {showProfiles ? (
              <ProfileCount personSearchQuery={projectSearchQuery || ""} />
            ) : showMashups ? (
              <MashupCount projectSearchQuery={projectSearchQuery || ""} />
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
              currentUserId={userSession.user.id}
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

async function MashupCount({
  projectSearchQuery,
}: {
  projectSearchQuery: string;
}) {
  const { totalMashups } = await getFilteredMashupProjects(
    projectSearchQuery,
    0,
    1
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
}: {
  projectSearchQuery: string | undefined;
  limit: number;
  tags: string[] | string | undefined;
  offset: number;
  userId: string;
}) {
  const { projects, totalPages, totalProjects } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    offset,
    limit,
    userId
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <DiscoverProjectCard
            key={project.id}
            projectId={project.id}
            projectCoverImage={project.coverImage}
            projectName={project.name}
            tagName={project.tags?.[0] || ""}
            projectDescription={project.description}
            likeCount={project.likeCount}
            isLiked={project.isLiked}
          />
        ))}
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
}: {
  personSearchQuery: string | undefined;
  limit: number;
  offset: number;
  currentUserId: string;
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
      <div className="space-y-4 md:space-y-6">
        {userProfiles?.map((userProfile) => (
          <div key={userProfile.id}>
            <ProfileCard
              userProfile={userProfile}
              currentUserId={currentUserId}
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
}: {
  projectSearchQuery: string | undefined;
  limit: number;
  offset: number;
  userId: string;
}) {
  const { mashupProjects, totalPages, totalMashups } =
    await getFilteredMashupProjects(projectSearchQuery, offset, limit, userId);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mashupProjects?.map((mashup) => {
          // Determine which collaborator name to show based on current user
          const isCreator = mashup.userId === userId;
          const partnerName = isCreator
            ? mashup.collaboratorName
            : mashup.creatorName;

          return (
            <div key={mashup.id} className="relative">
              <DiscoverProjectCard
                projectId={mashup.id}
                projectCoverImage={mashup.coverImage}
                projectName={mashup.name}
                tagName="" // Mashups don't have tags in this view
                projectDescription={mashup.description}
                likeCount={mashup.likeCount}
                isLiked={mashup.isLiked}
              />
              {partnerName && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  <span>with {partnerName}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ProjectPagination totalPages={totalPages} />
    </div>
  );
}
