"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LikeButton from "./like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, MapPin } from "lucide-react";

type CreatorInfo = {
  id: string;
  name: string | null;
  image: string | null;
  location: string | null;
  role: string | null;
};

type CollaboratorInfo = {
  id: string;
  name: string | null;
  image: string | null;
  location: string | null;
  role: string | null;
};

export default function DiscoverProjectCard({
  projectId,
  projectCoverImage,
  projectName,
  projectDescription,
  likeCount = 0,
  isLiked = false,
  creatorName,
  collaboratorName,
  creatorInfo,
  collaboratorInfo,
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
  creatorInfo?: CreatorInfo;
  collaboratorInfo?: CollaboratorInfo;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const openProject = (e: React.MouseEvent) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("project", projectId);
    router.push(`/discover?${params.toString()}`);
  };

  const onLikeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onUserInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isMashup = creatorInfo && collaboratorInfo;

  return (
    <div
      className="group bg-card rounded-lg border border-border overflow-hidden relative cursor-pointer"
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

        {/* User Information Section */}
        {isMashup ? (
          // Mashup Project - Show both creator and collaborator
          <div className="mb-3 space-y-2" onClick={onUserInfoClick}>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Collaboration
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${creatorInfo.id}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0"
              >
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage
                    src={creatorInfo.image || "/designer-headshot.png"}
                    alt={creatorInfo.name || "Creator"}
                  />
                  <AvatarFallback className="text-xs">
                    {(creatorInfo.name || "C").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-foreground truncate">
                    {creatorInfo.name || "Creator"}
                  </p>
                  {creatorInfo.role && (
                    <p className="text-xs text-muted-foreground truncate">
                      {creatorInfo.role}
                    </p>
                  )}
                </div>
              </Link>
              <span className="text-purple-500 text-xs">×</span>
              <Link
                href={`/profile/${collaboratorInfo.id}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0"
              >
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage
                    src={collaboratorInfo.image || "/designer-headshot.png"}
                    alt={collaboratorInfo.name || "Collaborator"}
                  />
                  <AvatarFallback className="text-xs">
                    {(collaboratorInfo.name || "C").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-foreground truncate">
                    {collaboratorInfo.name || "Collaborator"}
                  </p>
                  {collaboratorInfo.role && (
                    <p className="text-xs text-muted-foreground truncate">
                      {collaboratorInfo.role}
                    </p>
                  )}
                </div>
              </Link>
            </div>
            {(creatorInfo.location || collaboratorInfo.location) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">
                  {creatorInfo.location || collaboratorInfo.location}
                </span>
              </div>
            )}
          </div>
        ) : creatorInfo ? (
          // Single Project - Show creator only
          <div className="mb-3" onClick={onUserInfoClick}>
            <Link
              href={`/profile/${creatorInfo.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarImage
                  src={creatorInfo.image || "/designer-headshot.png"}
                  alt={creatorInfo.name || "Creator"}
                />
                <AvatarFallback className="text-xs">
                  {(creatorInfo.name || "C").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-card-foreground truncate">
                  {creatorInfo.name || "Creator"}
                </p>
                <div className="flex items-center gap-2">
                  {creatorInfo.role && (
                    <p className="text-xs text-muted-foreground truncate">
                      {creatorInfo.role}
                    </p>
                  )}
                  {creatorInfo.location && (
                    <>
                      {creatorInfo.role && (
                        <span className="text-muted-foreground">•</span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{creatorInfo.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground line-clamp-2">
          {projectDescription}
        </p>
      </div>
    </div>
  );
}
