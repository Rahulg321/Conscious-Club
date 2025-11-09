"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { followUser, unfollowUser } from "@/lib/actions/follow-action";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  className,
  onFollowChange,
  hideText = false,
  hideIcon = false,
}: {
  userId: string;
  isFollowing: boolean;
  className?: string;
  hideText?: boolean;
  hideIcon?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollowToggle = () => {
    startTransition(async () => {
      try {
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
          {!hideIcon && <UserCheck className="w-4 h-4 mr-2" />}
          {!hideText && (isPending ? "Unfollowing..." : "Unfollow")}
        </>
      ) : (
        <>
          {!hideIcon && <UserPlus className="w-4 h-4 mr-2" />}
          {!hideText && (isPending ? "Following..." : "Follow")}
        </>
      )}
    </Button>
  );
}
