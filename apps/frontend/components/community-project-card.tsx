"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LikeButton from "./like-button";
import { TAG_COLORS } from "@/lib/tag-colors";

export default function CommunityProjectCard({
  projectId,
  projectCoverImage,
  projectName,
  projectDescription,
  tagName,
  likeCount = 0,
  isLiked = false,
}: {
  projectId: string;
  projectCoverImage: string;
  projectName: string;
  projectDescription: string;
  tagName: string;
  likeCount?: number;
  isLiked?: boolean;
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

  return (
    <div
      className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow duration-200 "
      onClick={openProject}
    >
      <div className="aspect-video bg-muted overflow-hidden relative">
        <Image
          src={projectCoverImage}
          alt={projectName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-card-foreground line-clamp-1 flex-1">
            <button
              className="text-left hover:underline cursor-pointer"
              onClick={openProject}
            >
              {projectName}
            </button>
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
          <span
            className={`inline-block px-2 py-1 text-xs font-medium primary rounded-full text-white ${
              TAG_COLORS[tagName as keyof typeof TAG_COLORS] ||
              "bg-primary/10 text-primary"
            }`}
          >
            {tagName}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {projectDescription}
        </p>
      </div>
    </div>
  );
}
