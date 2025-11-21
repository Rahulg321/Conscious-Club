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
    <div className="rounded-lg border border-border bg-card overflow-hidden relative">
      {/* Instagram-style Header */}
      {isMashup ? (
        // Mashup Project - Show both creator and collaborator
        <div className="px-2 py-1.5 border-b border-border" onClick={onUserInfoClick}>
          <div className="flex items-center justify-between mb-1">
            <Link
              href={`/profile/${creatorInfo.id}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity flex-1 min-w-0"
            >
              <Avatar className="w-6 h-6 flex-shrink-0 ring-1 ring-offset-1 ring-offset-background ring-border">
                <AvatarImage
                  src={creatorInfo.image || "/designer-headshot.png"}
                  alt={creatorInfo.name || "Creator"}
                />
                <AvatarFallback
                  className={`text-[10px] font-semibold ${filterMaping.find((item) => item.value === creatorInfo.role)?.border}`}
                >
                  {(creatorInfo.name || "C").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-foreground truncate leading-tight">
                  {creatorInfo.name || "Creator"}
                </div>
                {creatorInfo.role && (
                  <div
                    className={`text-[9px] ${filterMaping.find((item) => item.value === creatorInfo.role)?.text}`}
                  >
                    {creatorInfo.role}
                  </div>
                )}
              </div>
            </Link>
            <Shuffle className="w-3 h-3 text-purple-500 mx-1 flex-shrink-0" />
            <Link
              href={`/profile/${collaboratorInfo.id}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity flex-1 min-w-0"
            >
              <Avatar className="w-6 h-6 flex-shrink-0 ring-1 ring-offset-1 ring-offset-background ring-border">
                <AvatarImage
                  src={collaboratorInfo.image || "/designer-headshot.png"}
                  alt={collaboratorInfo.name || "Collaborator"}
                />
                <AvatarFallback className="text-[10px] font-semibold">
                  {(collaboratorInfo.name || "C").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-foreground truncate leading-tight">
                  {collaboratorInfo.name || "Collaborator"}
                </div>
                {collaboratorInfo.role && (
                  <div
                    className={`text-[9px] ${filterMaping.find((item) => item.value === collaboratorInfo.role)?.text}`}
                  >
                    {collaboratorInfo.role}
                  </div>
                )}
              </div>
            </Link>
          </div>
          {(creatorInfo.location || collaboratorInfo.location) && (
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              <span className="truncate">
                {creatorInfo.location || collaboratorInfo.location}
              </span>
            </div>
          )}
        </div>
      ) : creatorInfo ? (
        // Single Project - Show creator only
        <div className="px-2 py-1.5 border-b border-border" onClick={onUserInfoClick}>
          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${creatorInfo.id}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity flex-1 min-w-0"
            >
              <Avatar className="w-6 h-6 flex-shrink-0 ring-1 ring-offset-1 ring-offset-background ring-border">
                <AvatarImage
                  src={creatorInfo.image || "/designer-headshot.png"}
                  alt={creatorInfo.name || "Creator"}
                />
                <AvatarFallback className="text-[10px] font-semibold">
                  {(creatorInfo.name || "C").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-foreground truncate leading-tight">
                  {creatorInfo.name || "Creator"}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  {creatorInfo.role && (
                    <span
                      className={filterMaping.find((item) => item.value === creatorInfo.role)?.text}
                    >
                      {creatorInfo.role}
                    </span>
                  )}
                  {creatorInfo.location && (
                    <>
                      {creatorInfo.role && <span>•</span>}
                      <div className="flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate">{creatorInfo.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      ) : null}

      {/* Image Section - Full width like Instagram */}
      <div
        className="aspect-square bg-muted overflow-hidden relative cursor-pointer"
        onClick={openProject}
      >
        <Image
          src={projectCoverImage}
          alt={projectName}
          fill
          className="object-cover"
        />
      </div>

      {/* Actions Section - Instagram style */}
      <div className="px-2 pt-1.5 pb-1">
        <div className="flex items-center justify-between mb-1.5" onClick={onLikeButtonClick}>
          <LikeButton
            projectId={projectId}
            initialLikeCount={likeCount}
            initialIsLiked={isLiked}
          />
        </div>

        {/* Content Section */}
        <div className="space-y-0.5 cursor-pointer" onClick={openProject}>
          <h4 className="font-semibold text-foreground text-[11px] line-clamp-1">
            {projectName}
          </h4>
          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
            {projectDescription}
          </p>
        </div>
      </div>

      <BorderBeam duration={6} size={200} className={color} />
    </div>
  );
}
