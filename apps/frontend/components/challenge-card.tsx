"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, Trophy, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ChallengeCardProps = {
  className?: string;
  id: string;
  slug: string;
  name: string;
  bannerImage: string;
  description?: string | null;
  deadline: Date;
  participantsCount: number;
  prizePool?: number | null;
  reward?: string | null;
  isCompleted?: boolean;
};

export function ChallengeCard({
  className,
  id,
  slug,
  name,
  bannerImage,
  description,
  deadline,
  participantsCount,
  prizePool,
  reward,
  isCompleted = false,
}: ChallengeCardProps) {
  const timeRemaining = formatDistanceToNow(new Date(deadline), {
    addSuffix: true,
  });
  const isDeadlineNear =
    new Date(deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const cardContent = (
    <div
      className={cn(
        "flex flex-col h-full w-full overflow-hidden rounded-lg border bg-card shadow-sm transition-all",
        isCompleted
          ? "opacity-75 cursor-default"
          : "hover:shadow-md cursor-pointer",
        className
      )}
    >
      <div className="relative w-full aspect-video min-h-[160px] sm:min-h-[180px] md:min-h-[200px]">
        <Image
          src={bannerImage}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {isCompleted ? (
          <div className="absolute top-2 right-2 rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span className="hidden xs:inline">Completed</span>
          </div>
        ) : isDeadlineNear ? (
          <div className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            <span className="hidden xs:inline">Ending</span> {timeRemaining}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col flex-1 p-4 space-y-3">
        <h3 className="text-xl font-semibold break-words line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 break-words">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 min-w-[105px]">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {isCompleted ? "Completed" : timeRemaining}
            </span>
          </div>
          <div className="flex items-center gap-1 min-w-[105px]">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate">{participantsCount} participants</span>
          </div>
          {(prizePool && prizePool > 0) || reward ? (
            <div className="flex items-center gap-1 min-w-[60px]">
              <Trophy className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {prizePool && prizePool > 0
                  ? `$${prizePool.toLocaleString()}`
                  : reward}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (isCompleted) {
    // Make sure completed cards don't have fixed/min heights so their container can still be responsive
    return <div className={cn("h-full w-full", className)}>{cardContent}</div>;
  }

  return (
    <Link
      href={`/challenges/${slug}`}
      className={cn("block h-full w-full", className)}
    >
      {cardContent}
    </Link>
  );
}
