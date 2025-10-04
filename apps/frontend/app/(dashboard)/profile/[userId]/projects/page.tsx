import { auth } from "@/auth";
import { getAllTags, getUserProjects } from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ userId: string }>;
};

const ProjectsPage = async ({ params }: Props) => {
  const { userId } = await params;
  if (!userId) redirect("/");

  const userSession = await auth();
  if (!userSession) redirect("/login");
  if (userSession.user.id !== userId) redirect("/");

  const [projects, allTags] = await Promise.all([
    getUserProjects(userId),
    getAllTags(),
  ]);

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#171c21]">
            Projects
          </h1>
          <p className="text-[#667085]">Your uploaded work and creations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/profile/${userId}`}>Back to Profile</Link>
          </Button>
          <ProjectUploadDialog allTags={allTags || []} />
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-[#171c21] mb-2">
            No uploads yet. Add something cool so your community can discover
            you.
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
