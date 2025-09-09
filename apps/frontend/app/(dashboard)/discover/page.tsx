import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getAllProjects,
  getAllProjectsWithTags,
  getAllTags,
  getFilteredProjects,
} from "@/lib/queries";
import ProjectTagsFilter from "@/components/project-tag-filters";
import { Suspense } from "react";
import ProjectSearchFilter from "@/components/project-search-filter";
import DiscoverProjectCard from "@/components/discover-project-card";
import ProjectPagination from "@/components/project-pagination";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const userSession = await auth();
  if (!userSession) redirect("/login");
  const projectTags = await getAllTags();

  const { page, query, tags } = await searchParams;

  const projectSearchQuery = query as string;
  const currentPage = Number(page) || 1;

  // Parse tags parameter - it comes as comma-separated string from URL
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Suspense fallback={<div>Loading.....</div>}>
            <ProjectSearchFilter />
          </Suspense>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Profiles
            </Button>
          </div>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectTagsFilter filterTags={projectTags!} />
      </Suspense>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Explore Projects
          </h1>
          <Suspense
            fallback={<span className="text-gray-500">Loading...</span>}
          >
            <ProjectCount
              tags={selectedTags}
              projectSearchQuery={projectSearchQuery || ""}
            />
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading</div>}>
          <FetchAndDisplayProjects
            tags={selectedTags}
            limit={limit}
            offset={offset}
            projectSearchQuery={projectSearchQuery || ""}
          />
        </Suspense>
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
  const { projects, totalPages, totalProjects } = await getFilteredProjects(
    tags,
    projectSearchQuery,
    offset,
    limit
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <DiscoverProjectCard
            key={project.id}
            projectCoverImage={project.coverImage}
            projectName={project.name}
            tagName={project.tags?.[0] || ""}
            projectDescription={project.description}
          />
        ))}
      </div>

      <ProjectPagination totalPages={totalPages} />
    </div>
  );
}
