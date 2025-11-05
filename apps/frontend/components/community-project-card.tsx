"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LikeButton from "./like-button";
import { TAG_COLORS } from "@/lib/tag-colors";
import { Sparkles, Heart, Building2, Flag, MessageSquare } from "lucide-react";

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
  dedicatedToPerson,
  dedicatedToBrand,
  dedicatedToCause,
  dedicationReason,
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
  dedicatedToPerson?: string | null;
  dedicatedToBrand?: string | null;
  dedicatedToCause?: string | null;
  dedicationReason?: string | null;
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

        {/* Dedication Section */}
        {(dedicatedToPerson ||
          dedicatedToBrand ||
          dedicatedToCause ||
          dedicationReason) && (
          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
            <div className="text-xs font-medium text-muted-foreground mb-1.5">
              Dedicated To
            </div>
            <div className="space-y-1">
              {dedicatedToPerson && (
                <div className="flex items-start gap-1.5 text-xs">
                  <Heart className="w-3 h-3 text-pink-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">Person: </span>
                    <span className="text-card-foreground font-medium truncate">
                      {dedicatedToPerson}
                    </span>
                  </div>
                </div>
              )}
              {dedicatedToBrand && (
                <div className="flex items-start gap-1.5 text-xs">
                  <Building2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">Brand: </span>
                    <span className="text-card-foreground font-medium truncate">
                      {dedicatedToBrand}
                    </span>
                  </div>
                </div>
              )}
              {dedicatedToCause && (
                <div className="flex items-start gap-1.5 text-xs">
                  <Flag className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">Cause: </span>
                    <span className="text-card-foreground font-medium truncate">
                      {dedicatedToCause}
                    </span>
                  </div>
                </div>
              )}
              {dedicationReason && (
                <div className="flex items-start gap-1.5 text-xs pt-0.5">
                  <MessageSquare className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">Reason: </span>
                    <span className="text-card-foreground italic line-clamp-1">
                      {dedicationReason}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
