"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { isVideo } from "@/lib/utils";

type ChallengeEntryCardProps = {
  id: string;
  caption: string;
  media: string[];
  createdAt: Date;
  userName: string | null;
  userImage: string | null;
};

export function ChallengeEntryCard({
  id,
  caption,
  media,
  createdAt,
  userName,
  userImage,
}: ChallengeEntryCardProps) {
  const mediaUrl = media[0]; // Only one media file
  const isVideoFile = mediaUrl ? isVideo(mediaUrl) : false;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-video relative bg-muted overflow-hidden">
        {mediaUrl ? (
          isVideoFile ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No media
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userImage || undefined}
              alt={userName || "User"}
            />
            <AvatarFallback>
              {(userName || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{userName || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{caption}</p>
      </div>
    </Card>
  );
}
