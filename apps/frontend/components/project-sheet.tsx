"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LikeButton from "./like-button";
import FollowButton from "./buttons/follow-button";
import ProjectCommentForm from "./forms/project-comment-form";
import ProjectCommentsList from "./project-comments-list";
import { filterMaping } from "./forms/onboarding/config";
import { cn, isVideo } from "@/lib/utils";
import {
  // Award,
  MapPin,
  // Users,
  // UserCheck,
  // Sparkles,
  Shuffle,
  Gem,
} from "lucide-react";

type UserInfo = {
  id: string;
  name: string | null;
  image: string | null;
  location: string | null;
  role: string | null;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
};

type ProjectDetails = {
  id: string;
  name: string;
  description: string | null;
  media: string[] | null;
  logoImage: string | null;
  link: string | null;
  dedicatedToPerson: string | null;
  dedicatedToBrand: string | null;
  dedicatedToCause: string | null;
  dedicationReason: string | null;
  tags: string[];
  likeCount: number;
  isLiked: boolean;
  isMashup: boolean;
  creator: UserInfo;
  collaborator: UserInfo | null;
};

export default function ProjectSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("project") || "";
  const pathname = usePathname();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [creatorFollowStatus, setCreatorFollowStatus] =
    useState<boolean>(false);
  const [collaboratorFollowStatus, setCollaboratorFollowStatus] =
    useState<boolean>(false);

  const currentPathWithParams = useMemo(() => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("project");
    const qs = params.toString();

    // Determine the current path based on the URL
    const currentPath = pathname;
    if (currentPath.startsWith("/discover")) {
      return qs ? `/discover?${qs}` : "/discover";
    } else {
      return qs ? `/community?${qs}` : "/community";
    }
  }, [searchParams]);

  useEffect(() => {
    const hasProject = Boolean(projectId);
    setOpen(hasProject);
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = (await res.json()) as { project: ProjectDetails };
        if (!cancelled) {
          startTransition(() => {
            setProject(data.project);
            setLikeCount(data.project.likeCount);
            setIsLiked(data.project.isLiked);
            setCreatorFollowStatus(data.project.creator?.isFollowing || false);
            setCollaboratorFollowStatus(
              data.project.collaborator?.isFollowing || false
            );
            setLoading(false);
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          startTransition(() => {
            setError(e?.message || "Failed to load project");
            setLoading(false);
          });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleOpenChange = (nextOpen: boolean) => {
    startTransition(() => {
      setOpen(nextOpen);
      if (!nextOpen) {
        router.push(currentPathWithParams);
      }
    });
  };

  const handleLikeToggle = (projectId: string, newIsLiked: boolean) => {
    setIsLiked(newIsLiked);
    // Update the like count optimistically
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
  };

  const handleCommentAdded = () => {
    // Refresh comments when a new comment is added
    if ((window as any).refreshComments) {
      (window as any).refreshComments();
    }
  };

  // Check if there are any dedications
  const hasDedications =
    project?.dedicatedToPerson ||
    project?.dedicatedToBrand ||
    project?.dedicatedToCause;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl !p-0 gap-0  flex flex-col"
      >
        <div className="py-2 border-b">
          <SheetHeader>
            <SheetTitle />
            {/* {loading || isPending ? (
                <Skeleton className="h-7 w-48" />
              ) : (
                project?.name || "Project"
              )} */}
            <div className="mt-2 px-2">
              {/* Creator/Collaborator Section */}
              {loading || isPending ? (
                <div className="rounded-lg  space-y-2">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </div>
              ) : (
                project && (
                  <div className="space-y-4">
                    {project.isMashup && project.collaborator ? (
                      // Mashup Project - Show both creator and collaborator
                      <div className="rounded-lg  space-y-4">
                        {/* Creator */}
                        <div className="flex flex-col md:flex-row gap-1 items-center md:items-start justify-between">
                          <div className="flex flex-col justify-start  items-start gap-2 w-full">
                            <div className="flex items-start gap-3 w-full">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={
                                    project.creator.image ||
                                    "/designer-headshot.png"
                                  }
                                  alt={project.creator.name || "Creator"}
                                />
                                <AvatarFallback>
                                  {(project.creator.name || "C")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <Link
                                      href={`/profile/${project.creator.id}`}
                                      className="block"
                                    >
                                      <h4 className="font-semibold text-sm hover:underline truncate">
                                        {project.creator.name || "Creator"}
                                      </h4>
                                    </Link>
                                    {project.creator.role && (
                                      <div
                                        className={cn(
                                          "text-xs  truncate",
                                          `${filterMaping.find((f) => f.value === project.creator.role)?.text}`
                                        )}
                                      >
                                        {project.creator.role}
                                      </div>
                                    )}
                                    {project.creator.location && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">
                                          {project.creator.location}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex md:mt-2 items-center gap-2 px-4">
                            <Shuffle className="h-8 w-8 text-purple-500" />
                          </div>
                          {/* Collaborator */}
                          <div className="flex justify-end items-start gap-3 w-full">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={
                                  project.collaborator.image ||
                                  "/designer-headshot.png"
                                }
                                alt={
                                  project.collaborator.name || "Collaborator"
                                }
                              />
                              <AvatarFallback>
                                {(project.collaborator.name || "C")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/profile/${project.collaborator.id}`}
                                    className="block"
                                  >
                                    <h4 className="font-medium text-sm hover:underline truncate">
                                      {project.collaborator.name ||
                                        "Collaborator"}
                                    </h4>
                                  </Link>
                                  {project.collaborator.role && (
                                    <div
                                      className={cn(
                                        "text-xs truncate",
                                        `${filterMaping.find((f) => f.value === project?.collaborator?.role)?.text}`
                                      )}
                                    >
                                      {project.collaborator.role}
                                    </div>
                                  )}
                                  {project.collaborator.location && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3" />
                                      <span className="truncate">
                                        {project.collaborator.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Single Project - Show creator only
                      <div className="rounded-lg pr-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={
                                project.creator.image ||
                                "/designer-headshot.png"
                              }
                              alt={project.creator.name || "Creator"}
                            />
                            <AvatarFallback>
                              {(project.creator.name || "C")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/profile/${project.creator.id}`}
                                  className="block"
                                >
                                  <h4 className="font-medium text-sm hover:underline truncate">
                                    {project.creator.name || "Creator"}
                                  </h4>
                                </Link>
                                {project.creator.role && (
                                  <div
                                    className={cn(
                                      "text-xs truncate",
                                      `${filterMaping.find((f) => f.value === project.creator.role)?.text}`
                                    )}
                                  >
                                    {project.creator.role}
                                  </div>
                                )}
                                {project.creator.location && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">
                                      {project.creator.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {currentUserId &&
                                currentUserId !== project.creator.id && (
                                  <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                                    <FollowButton
                                      userId={project.creator.id}
                                      isFollowing={creatorFollowStatus}
                                      className="text-xs h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
                                      onFollowChange={(isFollowing) =>
                                        setCreatorFollowStatus(isFollowing)
                                      }
                                    />
                                    {/* <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() =>
                                      router.push(
                                        `/profile/${project.creator.id}`
                                      )
                                    }
                                  >
                                    View Profile
                                  </Button> */}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Media Carousel */}
          <div className="mt-6 mb-6">
            {loading || isPending ? (
              <Skeleton className="w-full aspect-video rounded-lg" />
            ) : project?.media && project.media.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {project.media.map((mediaUrl, index) => {
                    const isMediaVideo = isVideo(mediaUrl);
                    return (
                      <CarouselItem key={index}>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                          {isMediaVideo ? (
                            <video
                              src={mediaUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Image
                              src={mediaUrl}
                              alt={`${project.name} - media ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-contain"
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
              <div className="w-full aspect-video rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center text-muted-foreground">
                No media available
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Tags and Like Section */}
            {loading || isPending ? (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            ) : project?.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            {loading || isPending ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              project && (
                <div className="flex justify-between items-center gap-2">
                  <div className="w-full">
                    <div>
                      {loading || isPending ? (
                        <Skeleton className="h-7 w-48" />
                      ) : (
                        project?.name || "Project"
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground w-3/4">
                      {error ? (
                        <span className="text-destructive">{error}</span>
                      ) : loading || isPending ? (
                        <Skeleton className="h-4 w-full mt-2" />
                      ) : (
                        project?.description ||
                        "Project details and description"
                      )}
                    </div>
                  </div>

                  <LikeButton
                    projectId={project.id}
                    initialLikeCount={likeCount}
                    initialIsLiked={isLiked}
                    onLikeToggle={handleLikeToggle}
                  />
                </div>
              )
            )}

            {/* Description section */}
            {/* {loading || isPending ? (
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              project?.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    About this project
                  </h3>
                  <p className="text-sm leading-6 text-card-foreground/90 whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              )
            )} */}

            {/* Dedications Section */}
            {loading || isPending ? (
              <div className="rounded-lg border border-border bg-card p-4">
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ) : (
              hasDedications && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Gem className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold italic">
                      Dedications
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    {project.dedicatedToPerson && (
                      <div>
                        <span className="font-medium">Dedicated to: </span>
                        <span className="text-muted-foreground">
                          {project.dedicatedToPerson}
                        </span>
                      </div>
                    )}

                    {project.dedicatedToBrand && (
                      <div>
                        <span className="font-medium">Brand: </span>
                        <span className="text-muted-foreground">
                          {project.dedicatedToBrand}
                        </span>
                      </div>
                    )}

                    {project.dedicatedToCause && (
                      <div>
                        <span className="font-medium">Cause: </span>
                        <span className="text-muted-foreground">
                          {project.dedicatedToCause}
                        </span>
                      </div>
                    )}

                    {project.dedicationReason && (
                      <div className="pt-2 border-t border-border">
                        <span className="font-medium block mb-1">Story:</span>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.dedicationReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Comments Section */}
            {loading || isPending ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            ) : (
              projectId && (
                <div className="space-y-6">
                  <ProjectCommentsList
                    key={`comments-${projectId}`}
                    projectId={projectId}
                    onCommentAdded={handleCommentAdded}
                  />
                  <ProjectCommentForm
                    key={`form-${projectId}`}
                    projectId={projectId}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
