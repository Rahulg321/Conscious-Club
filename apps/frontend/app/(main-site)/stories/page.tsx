import { Metadata } from "next";
import React, { Suspense } from "react";
import {
  getFilteredBlogPosts,
  getAllBlogCategories,
  getAllBlogTags,
} from "@/lib/queries";
import BlogCategoryFilter from "@/components/blog-category-filter";
import BlogTagFilter from "@/components/blog-tag-filter";
import BlogSearchFilter from "@/components/blog-search-filter";
import BlogCard from "@/components/blog-card";
import ProjectPagination from "@/components/project-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog - Conscious Club",
  description:
    "Read the latest articles, tutorials, and insights from the Conscious Club community",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-svh bg-background">
      <div className="bg-card border-b border-border px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 flex items-center justify-center">
            <Suspense
              fallback={
                <Skeleton className="h-12 w-full max-w-2xl rounded-lg" />
              }
            >
              <BlogSearchFilter />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {/* <Suspense fallback={<div>Loading categories...</div>}>
        <BlogCategoriesFilter />
      </Suspense> */}

      {/* Tag Filter */}
      {/* <Suspense fallback={<div>Loading tags...</div>}>
        <BlogTagsFilter />
      </Suspense> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-between mb-8">
              <span className="text-muted-foreground">Loading...</span>
            </div>
          }
        >
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function BlogContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page, query, category, tags: tagParams } = await searchParams;

  const searchQuery = query as string;
  const categorySlug = category as string;
  const currentPage = Number(page) || 1;

  const selectedTags =
    typeof tagParams === "string"
      ? tagParams.split(",").filter(Boolean)
      : Array.isArray(tagParams)
        ? tagParams
        : [];

  const limit = 9;
  const offset = (currentPage - 1) * limit;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Suspense
          fallback={<span className="text-muted-foreground">Loading...</span>}
        >
          <BlogPostCount
            categorySlug={categorySlug}
            tagSlugs={selectedTags}
            searchQuery={searchQuery || ""}
          />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        }
      >
        <FetchAndDisplayBlogPosts
          categorySlug={categorySlug}
          tagSlugs={selectedTags}
          searchQuery={searchQuery || ""}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </>
  );
}

async function BlogCategoriesFilter() {
  const categories = await getAllBlogCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <BlogCategoryFilter
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      }))}
    />
  );
}

async function BlogTagsFilter() {
  const tags = await getAllBlogTags();

  if (!tags || tags.length === 0) return null;

  return (
    <BlogTagFilter
      tags={tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      }))}
    />
  );
}

async function BlogPostCount({
  categorySlug,
  tagSlugs,
  searchQuery,
}: {
  categorySlug: string | undefined;
  tagSlugs: string[] | string | undefined;
  searchQuery: string;
}) {
  const { totalPosts } = await getFilteredBlogPosts(
    categorySlug,
    tagSlugs,
    searchQuery,
    0,
    1
  );

  return (
    <h2 className="text-2xl font-semibold text-foreground">
      {totalPosts} {totalPosts === 1 ? "Story" : "Stories"}
      {searchQuery && (
        <span className="text-lg font-normal text-muted-foreground ml-2">
          matching "{searchQuery}"
        </span>
      )}
    </h2>
  );
}

async function FetchAndDisplayBlogPosts({
  categorySlug,
  tagSlugs,
  searchQuery,
  limit,
  offset,
}: {
  categorySlug: string | undefined;
  tagSlugs: string[] | string | undefined;
  searchQuery: string | undefined;
  limit: number;
  offset: number;
}) {
  const { posts, totalPages, totalPosts } = await getFilteredBlogPosts(
    categorySlug,
    tagSlugs,
    searchQuery,
    offset,
    limit
  );

  if (totalPosts === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No posts found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            categoryName={post.categoryName}
            categorySlug={post.categorySlug}
            tags={post.tags}
            readingTime={post.readingTime}
            publishedAt={post.publishedAt}
            featuredImage={post.featuredImage}
            featuredImageAlt={post.featuredImageAlt}
            viewCount={post.viewCount}
          />
        ))}
      </div>

      {totalPages > 1 && <ProjectPagination totalPages={totalPages} />}
    </div>
  );
}
