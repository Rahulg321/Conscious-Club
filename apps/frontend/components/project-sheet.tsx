"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ProjectDetails = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  logoImage: string | null;
  link: string | null;
  tags: string[];
  likeCount: number;
};

export default function ProjectSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("project") || "";

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);

  const communityPathWithParams = useMemo(() => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("project");
    const qs = params.toString();
    return qs ? `/community?${qs}` : "/community";
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
      router.push(communityPathWithParams);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {loading ? "Loading..." : project?.name || "Project"}
          </SheetTitle>
          <SheetDescription>
            {error
              ? error
              : project?.description || "Project details and description"}
          </SheetDescription>
        </SheetHeader>

        {/* Media */}
        {project?.coverImage && (
          <div className="mt-6">
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-56 object-cover rounded-md border border-border"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mt-6 space-y-3">
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

          {typeof project?.likeCount === "number" ? (
            <div className="text-sm text-muted-foreground">
              {project.likeCount} {project.likeCount === 1 ? "like" : "likes"}
            </div>
          ) : null}

          {project?.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-primary hover:underline"
            >
              Visit project ↗
            </a>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
