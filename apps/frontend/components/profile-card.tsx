"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Trophy,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { UserProfile } from "./forms/onboarding/types";
import { followUser, unfollowUser } from "@/lib/actions/follow-action";
import { useTransition } from "react";
import { toast } from "sonner";

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
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={userProfile.image || "/designer-headshot.png"}
              alt={userProfile.name || "User"}
            />
            <AvatarFallback>RD</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {userProfile.name || "User"}
              </h1>
              <Badge className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1">
                {userProfile.discipline || "Discipline"}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {userProfile.location || "Location"}
              </span>
            </div>
            {/* Follow Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{userProfile.followersCount || 0} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <UserCheck className="w-4 h-4" />
                <span>{userProfile.followingCount || 0} following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        {currentUserId && currentUserId !== userProfile.id && (
          <Button
            onClick={handleFollowToggle}
            disabled={isPending}
            variant={userProfile.isFollowing ? "outline" : "default"}
            className="flex items-center gap-2"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProfile.projects.length > 0 ? (
          userProfile.projects.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={item.coverImage || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <span>No Projects Found</span>
          </div>
        )}
      </div>
    </Card>
  );
}
