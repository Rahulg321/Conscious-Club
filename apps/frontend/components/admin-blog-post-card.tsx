"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Edit2,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  FolderOpen,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  adminDeleteBlogPost,
  adminToggleBlogPostPublishStatus,
} from "@/lib/actions/blog-posts-actions";
import EditBlogPostForm from "./forms/edit-blog-post-form";

interface AdminBlogPostCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  isPublished: boolean;
  categoryName: string | null;
  tags: Array<{ id: string; name: string }>;
  readingTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  categories?: Array<{ id: string; name: string }> | null;
  allTags?: Array<{ id: string; name: string }> | null;
  content: string;
  categoryId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  wordCount: number | null;
}

const AdminBlogPostCard = ({
  id,
  title,
  slug,
  excerpt,
  status,
  isPublished,
  categoryName,
  tags,
  readingTime,
  publishedAt,
  createdAt,
  categories,
  allTags,
  content,
  categoryId,
  metaTitle,
  metaDescription,
  metaKeywords,
  canonicalUrl,
  featuredImage,
  featuredImageAlt,
  wordCount,
}: AdminBlogPostCardProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await adminDeleteBlogPost(id);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsToggling(true);
    try {
      const response = await adminToggleBlogPostPublishStatus(id, !isPublished);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "draft":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "archived":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not published";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          </div>
          <Badge className={getStatusColor(status)} variant="secondary">
            {status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Slug: <span className="font-mono">{slug}</span>
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {categoryName && (
            <div className="flex items-center gap-1">
              <FolderOpen className="h-3 w-3" />
              <span>{categoryName}</span>
            </div>
          )}
          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        <div className="flex gap-2 w-full">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Blog Post</DialogTitle>
                <DialogDescription>
                  Update the details of this blog post.
                </DialogDescription>
              </DialogHeader>
              <EditBlogPostForm
                post={{
                  id,
                  title,
                  content,
                  excerpt: excerpt || "",
                  categoryId: categoryId || "",
                  tagIds: tags.map((tag) => tag.id),
                  status,
                  isPublished,
                  metaTitle: metaTitle || "",
                  metaDescription: metaDescription || "",
                  metaKeywords: metaKeywords || "",
                  canonicalUrl: canonicalUrl || "",
                  featuredImage: featuredImage || "",
                  featuredImageAlt: featuredImageAlt || "",
                  readingTime: readingTime || undefined,
                  wordCount: wordCount || undefined,
                }}
                categories={categories}
                tags={allTags}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant={isPublished ? "secondary" : "default"}
            size="sm"
            className="flex-1"
            onClick={handleTogglePublish}
            disabled={isToggling}
          >
            {isToggling ? (
              <>Loading...</>
            ) : isPublished ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Publish
              </>
            )}
          </Button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                blog post
                <span className="font-semibold"> "{title}" </span>
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default AdminBlogPostCard;
