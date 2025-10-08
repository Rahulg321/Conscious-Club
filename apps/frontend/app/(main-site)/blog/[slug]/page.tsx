import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Eye,
  Tag as TagIcon,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    keywords: post.metaKeywords || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || undefined,
    },
  };
}

const BlogPostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const relatedPosts = await getRelatedBlogPosts(
    post.id,
    post.categoryId || null,
    post.tags.map((t) => t.id),
    3
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative w-full h-[400px] bg-gray-200">
          <Image
            src={post.featuredImage || ""}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Category */}
          {post.categoryName && (
            <div className="mb-4">
              <Link
                href={`/blog?category=${post.categorySlug}`}
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <FolderOpen className="h-3 w-3 mr-1" />
                  {post.categoryName}
                </Badge>
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt || null)}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            {post.viewCount !== null &&
              post.viewCount !== undefined &&
              post.viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount} views</span>
                </div>
              )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tags=${tag.slug}`}
                  className="inline-block"
                >
                  <Badge
                    variant="outline"
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <Separator className="mb-8" />

          <div className="prose">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Footer Metadata */}
          {post.wordCount && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Word count: {post.wordCount} words
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
