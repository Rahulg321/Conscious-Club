"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LikeButton from "./like-button";
import { TAG_COLORS } from "@/lib/tag-colors";
import { Sparkles } from "lucide-react";

export default function CommunityProjectCard({
  projectId,
  projectCoverImage,
  projectName,
  projectDescription,
  tagName,
  likeCount = 0,
  isLiked = false,
  creatorName,
  collaboratorName,
}: {
  projectId: string;
  projectCoverImage: string;
  projectName: string;
  projectDescription: string;
  tagName: string;
  likeCount?: number;
  isLiked?: boolean;
  creatorName?: string;
  collaboratorName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const openProject = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString());
    params.set("project", projectId);
    router.push(`/community?${params.toString()}`);
  };

  const onLikeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isMashup = creatorName && collaboratorName;

  return (
    <div
      className="group bg-card rounded-lg border border-border overflow-hidden"
      onClick={openProject}
    >
      <div className="aspect-video bg-muted overflow-hidden relative">
        <Image
          src={projectCoverImage}
          alt={projectName}
          fill
          className="object-contain"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-card-foreground line-clamp-1 flex-1">
            {projectName}
          </h4>
          <div onClick={onLikeButtonClick}>
            <LikeButton
              projectId={projectId}
              initialLikeCount={likeCount}
              initialIsLiked={isLiked}
            />
          </div>
        </div>
        <div className="mb-2">
          {isMashup ? (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-medium">
                {creatorName} <span className="text-purple-500">×</span>{" "}
                {collaboratorName}
              </span>
            </div>
          ) : (
            <span
              className={`inline-block px-2 py-1 text-xs font-medium primary rounded-full text-white ${
                TAG_COLORS[tagName as keyof typeof TAG_COLORS] ||
                "bg-primary/10 text-primary"
              }`}
            >
              {tagName}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {projectDescription}
        </p>
      </div>
    </div>
  );
}
