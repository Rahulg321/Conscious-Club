"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, User, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

interface ProjectCommentsListProps {
  projectId: string;
  onCommentAdded?: () => void;
}

const ProjectCommentsList = ({
  projectId,
  onCommentAdded,
}: ProjectCommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchComments = async () => {
    if (!projectId) return;

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`/api/projects/${projectId}/comments`);

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
      }
    });
  };

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  // Refresh comments when a new comment is added
  useEffect(() => {
    if (onCommentAdded) {
      // We'll call this from the parent when a comment is added
      const handleCommentAdded = () => {
        fetchComments();
      };

      // Store the handler for the parent to call
      (window as any).refreshComments = handleCommentAdded;
    }
  }, [onCommentAdded]);

  if (isPending && comments.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Comments</h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Comments</h3>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>
          {isPending && comments.length > 0 && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={comment.user.image || undefined}
                    alt={comment.user.name || "User"}
                  />
                  <AvatarFallback className="text-xs">
                    {comment.user.name ? (
                      comment.user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.user.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCommentsList;
