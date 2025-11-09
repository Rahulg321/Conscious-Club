"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Users, UserPlus, UserCheck } from "lucide-react";
import { UserProfile } from "./forms/onboarding/types";
import { followUser, unfollowUser } from "@/lib/actions/follow-action";
import { useTransition } from "react";
import { toast } from "sonner";
import MashupDialog from "./dialogs/mashup-dialog";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FollowButton from "./buttons/follow-button";
import { filterMaping } from "./forms/onboarding/config";

export default function ProfileCard({
  userProfile,
  currentUserId,
  userSession,
}: {
  userProfile: UserProfile;
  currentUserId?: string;
  userSession: Session;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      toast.error("You must be logged in to follow users");
      return;
    }

    if (currentUserId === userProfile.id) {
      toast.error("You cannot follow yourself");
      return;
    }

    startTransition(async () => {
      try {
        const action = userProfile.isFollowing ? unfollowUser : followUser;
        const result = await action(userProfile.id);

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success || "Action completed successfully");
          // The component will re-render with updated data due to revalidatePath in the action
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="w-full h-full mx-auto overflow-hidden rounded-3xl transition-shadow cursor-pointer border border-gray-200">
      <div className="p-5 flex flex-col items-center text-center gap-1">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage
            src={userProfile.image || "/designer-headshot.png"}
            alt={userProfile.name || "User"}
          />
          <AvatarFallback>
            {(userProfile.name || "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center ">
          <div className="flex items-center gap-2">
            <h2
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:underline"
              onClick={() => router.push(`/profile/${userProfile.id}`)}
            >
              {userProfile.name || "User"}
            </h2>
          </div>
          <div
            className={`text-sm ${filterMaping.find((item) => item.value === userProfile.role)?.text}`}
          >
            {userProfile.role}
          </div>
          {/* {(userProfile.city || userProfile.country) && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>
                {[userProfile.city, userProfile.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )} */}
        </div>

        {/* <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{userProfile.followersCount || 0} followers</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            <span>{userProfile.followingCount || 0} following</span>
          </div>
        </div> */}

        {currentUserId && currentUserId !== userProfile.id && (
          <div className="flex items-center gap-2 w-max">
            <FollowButton
              isIcon={true}
              userId={userProfile.id}
              isFollowing={userProfile.isFollowing || false}
              className="flex items-center gap-2 bg-indigo-500 text-white hover:bg-indigo-600"
            />
            {/* <Button
              onClick={handleFollowToggle}
              disabled={isPending}
              variant={userProfile.isFollowing ? "outline" : "default"}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {userProfile.isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  {isPending ? "Unfollowing..." : "Unfollow"}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {isPending ? "Following..." : "Follow"}
                </>
              )}
            </Button> */}
            <MashupDialog
              isIcon={true}
              collaboratorId={userProfile.id}
              collaboratorName={userProfile.name ?? undefined}
              userSession={userSession}
            />
          </div>
        )}
      </div>

      {/* <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-2">
          {userProfile.projects.slice(0, 3).map((item) => {
            // Get first media item (prefer images over videos)
            const firstMedia =
              item.media && item.media.length > 0
                ? item.media[0]
                : "/placeholder.svg";
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-md bg-muted"
              >
                <img
                  src={firstMedia}
                  alt={item.name}
                  className="w-full h-20 object-contain"
                />
              </div>
            );
          })}

          {Array.from({
            length: Math.max(0, 3 - (userProfile.projects?.length || 0)),
          }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="h-20 w-full rounded-md bg-gray-100 border border-gray-200"
              aria-hidden="true"
            />
          ))}
        </div>
      </div> */}
    </div>
  );
}
