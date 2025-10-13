import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProjectById, getProjectByIdWithStats } from "@/lib/queries";
import { Heart, MessageCircle, Award } from "lucide-react";
import { isVideo } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { auth } from "@/auth";
import { ja } from "date-fns/locale";

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
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  if (userSession.user.id !== (await params).userId) {
    redirect("/");
  }

  const { userId, projectId } = await params;

  const project = await getProjectByIdWithStats(projectId);

  if (!project) {
    notFound();
  }

  if (project.userId !== userId) {
    return notFound();
  }

  // Check if there are any dedications
  const hasDedications =
    project.dedicatedToPerson ||
    project.dedicatedToBrand ||
    project.dedicatedToCause;

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Media Carousel */}
      <div className="flex justify-center mb-6">
        {project.media && project.media.length > 0 ? (
          <Carousel className="w-full max-w-3xl">
            <CarouselContent>
              {project.media.map((mediaUrl, index) => {
                const isMediaVideo = isVideo(mediaUrl);
                return (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-video bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/60 rounded-xl overflow-hidden border border-[var(--color-border)] flex items-center justify-center">
                      {isMediaVideo ? (
                        <video
                          src={mediaUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Image
                          src={mediaUrl}
                          alt={`${project.name} - ${index + 1}`}
                          fill
                          className="object-contain p-2"
                          priority={index === 0}
                        />
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {project.media.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="relative w-full max-w-3xl aspect-video bg-[var(--color-muted)] rounded-xl overflow-hidden border border-[var(--color-border)] flex items-center justify-center text-muted-foreground">
            No media available
          </div>
        )}
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

          {/* Dedications Section */}
          {hasDedications && (
            <div
              className="mt-6 rounded-xl border p-5 md:p-6"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-[var(--color-primary)]" />
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-card-foreground)" }}
                >
                  Dedications
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                {project.dedicatedToPerson && (
                  <div>
                    <span className="font-medium text-[var(--color-card-foreground)]">
                      Dedicated to:{" "}
                    </span>
                    <span className="text-[var(--color-muted-foreground)]">
                      {project.dedicatedToPerson}
                    </span>
                  </div>
                )}

                {project.dedicatedToBrand && (
                  <div>
                    <span className="font-medium text-[var(--color-card-foreground)]">
                      Brand:{" "}
                    </span>
                    <span className="text-[var(--color-muted-foreground)]">
                      {project.dedicatedToBrand}
                    </span>
                  </div>
                )}

                {project.dedicatedToCause && (
                  <div>
                    <span className="font-medium text-[var(--color-card-foreground)]">
                      Cause:{" "}
                    </span>
                    <span className="text-[var(--color-muted-foreground)]">
                      {project.dedicatedToCause}
                    </span>
                  </div>
                )}

                {project.dedicationReason && (
                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <span className="font-medium text-[var(--color-card-foreground)] block mb-1">
                      Why this dedication:
                    </span>
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                      {project.dedicationReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
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
