import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddBlogPostsForm from "@/components/forms/add-blog-posts-form";
import {
  getAllBlogPosts,
  getAllBlogCategories,
  getAllBlogTags,
  requireAdmin,
} from "@/lib/queries";
import AdminBlogPostCard from "@/components/admin-blog-post-card";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

export const metadata = {
  title: "Manage Blog Posts - Admin",
  description: "Create, edit, and manage blog posts for your website",
};

const page = () => {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <BlogPostsContent />
      </Suspense>
    </div>
  );
};

async function BlogPostsContent() {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  await requireAdmin();

  const blogPosts = await getAllBlogPosts();
  const blogCategories = await getAllBlogCategories();
  const blogTags = await getAllBlogTags();

  return (
    <>
      {/* Navigation */}
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage blog posts. Write engaging content, add images, and
          optimize for SEO to attract readers.
        </p>
      </div>

      {/* Add Post Form */}
      <div className="mb-12">
        <AddBlogPostsForm categories={blogCategories} tags={blogTags} />
      </div>

      {/* Existing Posts */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Existing Blog Posts</h2>
          <p className="text-sm text-muted-foreground">
            {blogPosts && blogPosts.length > 0
              ? `${blogPosts.length} ${blogPosts.length === 1 ? "post" : "posts"} available`
              : "No blog posts created yet"}
          </p>
        </div>

        {blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <AdminBlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                content={post.content}
                status={post.status}
                isPublished={post.isPublished}
                categoryName={post.categoryName}
                categoryId={post.categoryId}
                tags={post.tags}
                readingTime={post.readingTime}
                wordCount={post.wordCount}
                publishedAt={post.publishedAt}
                createdAt={post.createdAt}
                categories={blogCategories}
                allTags={blogTags}
                metaTitle={post.metaTitle}
                metaDescription={post.metaDescription}
                metaKeywords={post.metaKeywords}
                canonicalUrl={post.canonicalUrl}
                featuredImage={post.featuredImage}
                featuredImageAlt={post.featuredImageAlt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg border-border">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No blog posts yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first blog post using the form above to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default page;
