"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LikeButton from "./like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import { MapPin, Shuffle } from "lucide-react";
import { filterMaping } from "./forms/onboarding/config";

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
  tagName,
  isLiked = false,
  creatorName,
  collaboratorName,
  creatorInfo,
  collaboratorInfo,
  // dedicatedToPerson,
  // dedicatedToBrand,
  // dedicatedToCause,
  // dedicationReason,
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
  // dedicatedToPerson?: string | null;
  // dedicatedToBrand?: string | null;
  // dedicatedToCause?: string | null;
  // dedicationReason?: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const color = filterMaping.find((item) => item.value === tagName)?.color;
  // const text = filterMaping.find((item) => item.value === tagName)?.text;

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
      className="rounded-lg border border-border overflow-hidden relative cursor-pointer py-2 px-4"
      onClick={openProject}
    >
      {isMashup ? (
        // Mashup Project - Show both creator and collaborator
        <div className="mb-3 space-y-2" onClick={onUserInfoClick}>
          <div className="flex items-center gap-2 pt-4">
            <Link
              href={`/profile/${creatorInfo.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0"
            >
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarImage
                  src={creatorInfo.image || "/designer-headshot.png"}
                  alt={creatorInfo.name || "Creator"}
                />
                <AvatarFallback
                  className={`border-2 text-xs ${filterMaping.find((item) => item.value === creatorInfo.role)?.border}`}
                >
                  {(creatorInfo.name || "C").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-card-foreground truncate">
                  {creatorInfo.name || "Creator"}
                </div>
                {creatorInfo.role && (
                  <div
                    className={`text-xs ${filterMaping.find((item) => item.value === creatorInfo.role)?.text}`}
                  >
                    {creatorInfo.role}
                  </div>
                )}
              </div>
            </Link>
            <Shuffle className="w-4 h-4 text-purple-500" />
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
                <div className="text-xs font-medium text-card-foreground truncate">
                  {collaboratorInfo.name || "Collaborator"}
                </div>
                {collaboratorInfo.role && (
                  <div
                    className={`text-xs  ${filterMaping.find((item) => item.value === collaboratorInfo.role)?.text}`}
                  >
                    {collaboratorInfo.role}
                  </div>
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
        <div
          className="py-2 flex flex-row justify-between"
          onClick={onUserInfoClick}
        >
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
            <div className="text-xs font-medium text-card-foreground truncate">
              {creatorInfo.name || "Creator"}
            </div>
          </Link>
          <div className="flex items-center gap-2 text-shadow-2xs">
            {creatorInfo.role && (
              <div
                className={`text-xs ${filterMaping.find((item) => item.value === creatorInfo.role)?.text}`}
              >
                {creatorInfo.role}
              </div>
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
      ) : null}
      <div className="aspect-video bg-muted overflow-hidden relative rounded-xl ">
        <Image
          src={projectCoverImage}
          alt={projectName}
          fill
          className="object-contain bg-neutral-50"
        />
      </div>
      <div className="py-2">
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
        <div className="text-sm text-muted-foreground line-clamp-2">
          {projectDescription}
        </div>
      </div>
      <BorderBeam duration={6} size={400} className={color} />
    </div>
  );
}
