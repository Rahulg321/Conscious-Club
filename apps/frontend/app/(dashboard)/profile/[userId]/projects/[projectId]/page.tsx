import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProjectByIdWithStats } from "@/lib/queries";
import {
  Heart,
  MessageCircle,
  Award,
  Edit,
  ExternalLink,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { isVideo } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { auth } from "@/auth";
import DeleteProjectAlert from "@/components/buttons/delete-project-alert";

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

function ProjectPage({ params }: PageProps) {
  return (
    <div className="min-h-svh bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-svh">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <ProjectContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectContent({ params }: PageProps) {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const { userId, projectId } = await params;

  if (userSession.user.id !== userId) {
    redirect("/");
  }

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
    <>
      {/* Header with navigation */}
      <div className="sticky top-0 z-10 border-b bg-background border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/profile/${userId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Profile
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold truncate text-foreground">
                {project.name}
              </h1>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/profile/${userId}/projects/${projectId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Link>
              </Button>
              <DeleteProjectAlert projectId={projectId} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Media Carousel */}
        <div className="mb-8">
          {project.media && project.media.length > 0 ? (
            <div className="relative">
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  {project.media.map((mediaUrl, index) => {
                    const isMediaVideo = isVideo(mediaUrl);
                    return (
                      <CarouselItem key={index}>
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-background flex items-center justify-center">
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
                              className="object-contain p-4"
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
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            </div>
          ) : (
            <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden border border-border bg-muted text-muted-foreground flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">No media available</p>
                <p className="text-sm mt-1 text-muted-foreground">
                  Upload some images or videos to showcase your project
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Project info card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-card-foreground">
                  {project.name}
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Project details card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-card-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  Project Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.link && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        Project Link
                      </label>
                      <div className="flex items-center gap-2">
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline break-all flex items-center gap-1 text-primary"
                        >
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                          {project.link}
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                      Created On
                    </label>
                    <div className="font-medium text-card-foreground">
                      {project.createdAt
                        ? new Date(
                            project.createdAt as unknown as string
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Stats section */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-destructive" />
                      <span className="font-semibold text-card-foreground">
                        {project.likesCount || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {project.likesCount === 1 ? "like" : "likes"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-card-foreground">
                        {project.commentsCount || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {project.commentsCount === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedications Section */}
            {hasDedications && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-muted">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-card-foreground">
                      Dedications
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {project.dedicatedToPerson && (
                      <div className="rounded-lg p-4 bg-muted">
                        <span className="font-semibold text-card-foreground">
                          Dedicated to:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {project.dedicatedToPerson}
                        </span>
                      </div>
                    )}

                    {project.dedicatedToBrand && (
                      <div className="rounded-lg p-4 bg-muted">
                        <span className="font-semibold text-card-foreground">
                          Brand:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {project.dedicatedToBrand}
                        </span>
                      </div>
                    )}

                    {project.dedicatedToCause && (
                      <div className="rounded-lg p-4 bg-muted">
                        <span className="font-semibold text-card-foreground">
                          Cause:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {project.dedicatedToCause}
                        </span>
                      </div>
                    )}

                    {project.dedicationReason && (
                      <div className="rounded-lg p-4 border-t border-border bg-muted">
                        <span className="font-semibold block mb-2 text-card-foreground">
                          Why this dedication:
                        </span>
                        <p className="leading-relaxed text-muted-foreground">
                          {project.dedicationReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action buttons card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Actions
                </h3>
                <div className="space-y-3">
                  {project.link && (
                    <Button asChild className="w-full justify-center">
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Project
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-center"
                  >
                    <Link
                      href={`/profile/${userId}/projects/${projectId}/edit`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Project
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-center"
                  >
                    <Link href={`/profile/${userId}`}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick stats card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Likes</span>
                    <span className="font-semibold text-card-foreground">
                      {project.likesCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span className="font-semibold text-card-foreground">
                      {project.commentsCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Media</span>
                    <span className="font-semibold text-card-foreground">
                      {project.media?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
