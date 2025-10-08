import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddBlogCategoriesForm from "@/components/forms/add-blog-categories-form";
import { getAllBlogCategories, requireAdmin } from "@/lib/queries";
import AdminBlogCategoryCard from "@/components/admin-blog-category-card";
import { ArrowLeft, FolderOpen } from "lucide-react";

export const metadata = {
  title: "Manage Blog Categories - Admin",
  description: "Add, edit, and manage blog categories for your blog posts",
};

const page = async () => {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  await requireAdmin();

  const blogCategories = await getAllBlogCategories();

  return (
    <div className="block-space big-container">
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
          <FolderOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Manage Blog Categories</h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage categories to organize your blog posts. Categories
          help structure your content and improve navigation.
        </p>
      </div>

      {/* Add Category Form */}
      <div className="mb-12">
        <AddBlogCategoriesForm />
      </div>

      {/* Existing Categories */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Existing Categories</h2>
          <p className="text-sm text-muted-foreground">
            {blogCategories && blogCategories.length > 0
              ? `${blogCategories.length} ${blogCategories.length === 1 ? "category" : "categories"} available`
              : "No categories created yet"}
          </p>
        </div>

        {blogCategories && blogCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {blogCategories.map((category) => (
              <AdminBlogCategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                description={category.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No blog categories yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first category using the form above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
