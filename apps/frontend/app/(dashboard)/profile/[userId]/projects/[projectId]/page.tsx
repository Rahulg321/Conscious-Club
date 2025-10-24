import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProjectById, getProjectByIdWithStats } from "@/lib/queries";
import {
  Heart,
  MessageCircle,
  Award,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  ArrowLeft,
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

  console.log(project);

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
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      {/* Header with navigation */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{
          background: "var(--color-background)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/profile/${userId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Profile
                </Link>
              </Button>
              <div
                className="h-6 w-px"
                style={{ background: "var(--color-border)" }}
              />
              <h1
                className="text-xl font-semibold truncate"
                style={{ color: "var(--color-foreground)" }}
              >
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
                        <div
                          className="relative w-full aspect-video rounded-xl overflow-hidden border flex items-center justify-center"
                          style={{
                            background: "var(--color-muted)",
                            borderColor: "var(--color-border)",
                          }}
                        >
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
            <div
              className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden border flex items-center justify-center"
              style={{
                background: "var(--color-muted)",
                borderColor: "var(--color-border)",
                color: "var(--color-muted-foreground)",
              }}
            >
              <div className="text-center">
                <p className="text-lg font-medium">No media available</p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
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
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="p-6 md:p-8">
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                  style={{ color: "var(--color-card-foreground)" }}
                >
                  {project.name}
                </h1>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  {project.description}
                </p>
              </div>
            </div>

            {/* Project details card */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="p-6 md:p-8">
                <h2
                  className="text-xl font-semibold mb-6 flex items-center gap-2"
                  style={{ color: "var(--color-card-foreground)" }}
                >
                  <Calendar
                    className="h-5 w-5"
                    style={{ color: "var(--color-primary)" }}
                  />
                  Project Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.link && (
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        Project Link
                      </label>
                      <div className="flex items-center gap-2">
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline break-all flex items-center gap-1"
                          style={{ color: "var(--color-primary)" }}
                        >
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                          {project.link}
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      Created On
                    </label>
                    <div
                      className="font-medium"
                      style={{ color: "var(--color-card-foreground)" }}
                    >
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
                <div
                  className="mt-8 pt-6 border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Heart
                        className="h-5 w-5"
                        style={{ color: "var(--color-destructive)" }}
                      />
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-card-foreground)" }}
                      >
                        {project.likesCount || 0}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {project.likesCount === 1 ? "like" : "likes"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle
                        className="h-5 w-5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-card-foreground)" }}
                      >
                        {project.commentsCount || 0}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {project.commentsCount === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedications Section */}
            {hasDedications && (
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  background: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: "var(--color-muted)" }}
                    >
                      <Award
                        className="h-6 w-6"
                        style={{ color: "var(--color-primary)" }}
                      />
                    </div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--color-card-foreground)" }}
                    >
                      Dedications
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {project.dedicatedToPerson && (
                      <div
                        className="rounded-lg p-4"
                        style={{ background: "var(--color-muted)" }}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: "var(--color-card-foreground)" }}
                        >
                          Dedicated to:{" "}
                        </span>
                        <span
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
                          {project.dedicatedToPerson}
                        </span>
                      </div>
                    )}

                    {project.dedicatedToBrand && (
                      <div
                        className="rounded-lg p-4"
                        style={{ background: "var(--color-muted)" }}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: "var(--color-card-foreground)" }}
                        >
                          Brand:{" "}
                        </span>
                        <span
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
                          {project.dedicatedToBrand}
                        </span>
                      </div>
                    )}

                    {project.dedicatedToCause && (
                      <div
                        className="rounded-lg p-4"
                        style={{ background: "var(--color-muted)" }}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: "var(--color-card-foreground)" }}
                        >
                          Cause:{" "}
                        </span>
                        <span
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
                          {project.dedicatedToCause}
                        </span>
                      </div>
                    )}

                    {project.dedicationReason && (
                      <div
                        className="rounded-lg p-4 border-t"
                        style={{
                          background: "var(--color-muted)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <span
                          className="font-semibold block mb-2"
                          style={{ color: "var(--color-card-foreground)" }}
                        >
                          Why this dedication:
                        </span>
                        <p
                          className="leading-relaxed"
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
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
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="p-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-card-foreground)" }}
                >
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
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="p-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-card-foreground)" }}
                >
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--color-muted-foreground)" }}>
                      Likes
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-card-foreground)" }}
                    >
                      {project.likesCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--color-muted-foreground)" }}>
                      Comments
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-card-foreground)" }}
                    >
                      {project.commentsCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--color-muted-foreground)" }}>
                      Media
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-card-foreground)" }}
                    >
                      {project.media?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
