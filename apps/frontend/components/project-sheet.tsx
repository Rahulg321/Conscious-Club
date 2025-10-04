"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LikeButton from "./like-button";
import ProjectCommentForm from "./forms/project-comment-form";
import ProjectCommentsList from "./project-comments-list";

type ProjectDetails = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  logoImage: string | null;
  link: string | null;
  tags: string[];
  likeCount: number;
  isLiked: boolean;
};

export default function ProjectSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("project") || "";

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const currentPathWithParams = useMemo(() => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("project");
    const qs = params.toString();

    // Determine the current path based on the URL
    const currentPath = window.location.pathname;
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
          setProject(data.project);
          setLikeCount(data.project.likeCount);
          setIsLiked(data.project.isLiked);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      router.push(currentPathWithParams);
    }
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

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <div className="px-6 pt-6 pb-4 border-b">
          <SheetHeader>
            <SheetTitle className="text-xl">
              {loading ? "Loading..." : project?.name || "Project"}
            </SheetTitle>
            <SheetDescription className="line-clamp-2">
              {error
                ? error
                : project?.description || "Project details and description"}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Media */}
            <div className="md:col-span-7">
              {project?.coverImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                  <Image
                    src={project.coverImage}
                    alt={project.name || "Project cover"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video rounded-lg border border-dashed border-border bg-muted/40" />
              )}
            </div>

            {/* Meta / Details */}
            <div className="md:col-span-5">
              <div className="space-y-4">
                {project?.tags?.length ? (
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

                {project && (
                  <div className="flex items-center gap-2">
                    <LikeButton
                      projectId={project.id}
                      initialLikeCount={likeCount}
                      initialIsLiked={isLiked}
                      onLikeToggle={handleLikeToggle}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Long description section */}
          {project?.description ? (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                About this project
              </h3>
              <p className="text-sm leading-6 text-card-foreground/90 whitespace-pre-line">
                {project.description}
              </p>
            </div>
          ) : null}

          {projectId && (
            <div className="mt-8 space-y-6">
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
