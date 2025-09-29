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

                {typeof project?.likeCount === "number" ? (
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <span aria-hidden>❤️</span>
                    <span>
                      {project.likeCount}{" "}
                      {project.likeCount === 1 ? "like" : "likes"}
                    </span>
                  </div>
                ) : null}

                {/* {project?.link ? (
                  <div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      Visit project
                      <span className="ml-1" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </div>
                ) : null} */}
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
