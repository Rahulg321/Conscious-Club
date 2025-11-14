import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddBlogTagsForm from "@/components/forms/add-blog-tags-form";
import { getAllBlogTags, requireAdmin } from "@/lib/queries";
import AdminBlogTagCard from "@/components/admin-blog-tag-card";
import { ArrowLeft, Tags, Loader2 } from "lucide-react";

export const metadata = {
  title: "Manage Blog Tags - Admin",
  description: "Add, edit, and manage blog tags for your blog posts",
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
        <BlogTagsContent />
      </Suspense>
    </div>
  );
};

async function BlogTagsContent() {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  await requireAdmin();

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
          <Tags className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Manage Blog Tags</h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage tags to categorize your blog posts. Tags help
          readers discover related content.
        </p>
      </div>

      {/* Add Tag Form */}
      <div className="mb-12">
        <AddBlogTagsForm />
      </div>

      {/* Existing Tags */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Existing Tags</h2>
          <p className="text-sm text-muted-foreground">
            {blogTags && blogTags.length > 0
              ? `${blogTags.length} tag${blogTags.length === 1 ? "" : "s"} available`
              : "No tags created yet"}
          </p>
        </div>

        {blogTags && blogTags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {blogTags.map((tag) => (
              <AdminBlogTagCard
                key={tag.id}
                id={tag.id}
                name={tag.name}
                slug={tag.slug}
                description={tag.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg border-border">
            <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No blog tags yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first tag using the form above to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default page;
