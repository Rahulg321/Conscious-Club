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

export default function ProfileCard({
  userProfile,
  currentUserId,
}: {
  userProfile: UserProfile;
  currentUserId?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleFollowToggle = () => {
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
    <Card className="w-full mx-auto overflow-hidden border hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col items-center text-center gap-3">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={userProfile.image || "/designer-headshot.png"}
            alt={userProfile.name || "User"}
          />
          <AvatarFallback>
            {(userProfile.name || "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {userProfile.name || "User"}
            </h2>
          </div>

          {(userProfile.location || "").length > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">{userProfile.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{userProfile.followersCount || 0} followers</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            <span>{userProfile.followingCount || 0} following</span>
          </div>
        </div>

        {currentUserId && currentUserId !== userProfile.id && (
          <Button
            onClick={handleFollowToggle}
            disabled={isPending}
            variant={userProfile.isFollowing ? "outline" : "default"}
            className="w-full mt-1 flex items-center justify-center gap-2"
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
          </Button>
        )}
      </div>

      {currentUserId && currentUserId !== userProfile.id && (
        <MashupDialog
          collaboratorId={userProfile.id}
          collaboratorName={userProfile.name ?? undefined}
        />
      )}

      <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-2">
          {userProfile.projects.slice(0, 3).map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-md">
              <img
                src={item.coverImage || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-20 object-cover"
              />
            </div>
          ))}

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
      </div>
    </Card>
  );
}
