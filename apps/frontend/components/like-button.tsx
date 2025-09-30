"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  projectId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  onLikeToggle?: (projectId: string, isLiked: boolean) => void;
}

export default function LikeButton({
  projectId,
  initialLikeCount,
  initialIsLiked,
  onLikeToggle,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLikeToggle = async () => {
    if (isLoading) return;

    // Check if user is authenticated
    if (status === "loading") {
      return; // Wait for session to load
    }

    if (!session?.user) {
      // Redirect to login page if user is not authenticated
      router.push("/login");
      return;
    }

    startTransition(async () => {
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);

      try {
        const response = await fetch(`/api/projects/${projectId}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isLiked: newIsLiked }),
        });

        if (!response.ok) {
          // Revert optimistic update on error
          setIsLiked(!newIsLiked);
          setLikeCount(likeCount);
          throw new Error("Failed to update like status");
        }

        const data = await response.json();

        // Update with server response
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);

        // Call optional callback
        onLikeToggle?.(projectId, data.isLiked);
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert optimistic update on error
        setIsLiked(!newIsLiked);
        setLikeCount(likeCount);
      }
    });
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="flex items-center gap-1 h-8 px-2"
      >
        <Heart className="h-4 w-4 text-gray-300" />
        <span className="text-sm font-medium">{likeCount}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading}
      className="flex items-center gap-1 h-8 px-2 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </Button>
  );
}
