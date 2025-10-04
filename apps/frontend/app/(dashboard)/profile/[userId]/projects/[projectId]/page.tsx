import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProjectById, getProjectByIdWithStats } from "@/lib/queries";
import { Heart, MessageCircle } from "lucide-react";

type PageProps = {
  params: Promise<{ userId: string; projectId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { userId, projectId } = await params;
  const project = await getProjectByIdWithStats(projectId);
  return {
    title: `${project?.name} - ${userId}`,
    description: `${project?.description} - ${userId}. ${project?.likesCount || 0} likes, ${project?.commentsCount || 0} comments.`,
  };
}

async function ProjectPage({ params }: PageProps) {
  const { userId, projectId } = await params;

  const project = await getProjectByIdWithStats(projectId);

  if (!project) {
    notFound();
  }

  // Guard the route to ensure the URL's userId matches the project's owner
  if (project.userId !== userId) {
    return notFound();
  }

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl aspect-video bg-[var(--color-muted)] rounded-xl overflow-hidden border border-[var(--color-border)]">
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className="rounded-xl border p-5 md:p-6"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-card-foreground)",
            }}
          >
            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              {project.name}
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {project.description}
            </p>
          </div>

          <div
            className="mt-6 rounded-xl border p-5 md:p-6"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--color-card-foreground)" }}
            >
              Project details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {project.link && (
                <div>
                  <div className="text-[var(--color-muted-foreground)]">
                    Project link
                  </div>
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline break-all"
                  >
                    {project.link}
                  </Link>
                </div>
              )}
              <div>
                <div className="text-[var(--color-muted-foreground)]">
                  Created on
                </div>
                <div>
                  {project.createdAt
                    ? new Date(
                        project.createdAt as unknown as string
                      ).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>

            {/* Likes and Comments Stats */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">
                    {project.likesCount || 0}{" "}
                    {project.likesCount === 1 ? "like" : "likes"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    {project.commentsCount || 0}{" "}
                    {project.commentsCount === 1 ? "comment" : "comments"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            className="rounded-xl border p-5 md:p-6 flex flex-col gap-3"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            {project.link && (
              <Button asChild>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit project
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/profile/${userId}`}>Back to profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
