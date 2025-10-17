"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Tag as TagIcon } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  tags: Array<{ id: string; name: string; slug: string }>;
  readingTime: number | null;
  publishedAt: Date | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  viewCount: number | null;
}

const BlogCard = ({
  id,
  title,
  slug,
  excerpt,
  categoryName,
  categorySlug,
  tags,
  readingTime,
  publishedAt,
  featuredImage,
  featuredImageAlt,
  viewCount,
}: BlogCardProps) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/blog/${slug}`}>
      <Card className="h-full flex flex-col overflow-hidden cursor-pointer group">
        {featuredImage && (
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            <Image
              src={featuredImage}
              alt={featuredImageAlt || title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {categoryName && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {categoryName}
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {excerpt}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <TagIcon className="h-2.5 w-2.5" />
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(publishedAt)}</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} min</span>
                </div>
              )}
            </div>
            {viewCount !== null && viewCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{viewCount}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
