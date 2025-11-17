"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { followUser, unfollowUser } from "@/lib/actions/follow-action";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FollowButton({
  isIcon = false,
  userId,
  isFollowing: initialIsFollowing,
  className,
  onFollowChange,
}: {
  isIcon?: boolean;
  userId: string;
  isFollowing: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollowToggle = () => {
    startTransition(async () => {
      try {
        console.log("clicked on follow action");

        const action = initialIsFollowing ? unfollowUser : followUser;
        const result = await action(userId);

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success || "Action completed successfully");
          // Call callback if provided
          if (onFollowChange) {
            onFollowChange(!initialIsFollowing);
          }
          // Refresh the page to update follow status
          router.refresh();
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isPending}
      variant={initialIsFollowing ? "outline" : "default"}
      className={className}
    >
      {initialIsFollowing ? (
        <>
          {isIcon && (
            <UserCheck className={`w-4 h-4 ${isIcon ? "" : "mr-2"}`} />
          )}
          {isIcon ? "" : isPending ? "Unfollowing..." : "Unfollow"}
        </>
      ) : (
        <>
          {isIcon && <UserPlus className={`w-4 h-4 ${isIcon ? "" : "mr-2"}`} />}
          {isIcon ? "" : isPending ? "Following..." : "Follow"}
        </>
      )}
    </Button>
  );
}
