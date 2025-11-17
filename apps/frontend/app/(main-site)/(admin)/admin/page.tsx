import {
  getAllBravos,
  getAllBravoCategories,
  requireAdmin,
} from "@/lib/queries";
import AddBravoForm from "@/components/forms/add-bravo-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminBravoCard from "@/components/admin-bravo-card";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Admin",
  description: "Admin page",
};

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  const session = await requireAdmin();
  const params = await searchParams;
  const selectedCategory = params?.category;
  const bravos = (await getAllBravos(selectedCategory)) ?? [];
  const categories = await getAllBravoCategories();

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>

        <Button asChild>
          <Link href="/admin/add-blog-tags">Add Blog Tags</Link>
        </Button>

        <Button asChild>
          <Link href="/admin/add-blog-categories">Add Blog Categories</Link>
        </Button>

        <Button asChild>
          <Link href="/admin/add-blog-posts">Add Blog Posts</Link>
        </Button>

        <Button asChild>
          <Link href="/admin/add-bravo">Add Bravo</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/bravo-categories">See Bravo Categories</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/challenges">Challenges</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/add-bravo-category">Add Bravo Category</Link>
        </Button>
      </div>

      <div className="mt-6 mb-2 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={!selectedCategory ? "default" : "outline"}
          asChild
        >
          <Link href="/admin">All</Link>
        </Button>
        {categories?.map((category) => {
          const isActive = selectedCategory === category.slug;
          const href = `/admin?category=${category.slug}`;
          return (
            <Button
              key={category.id}
              size="sm"
              variant={isActive ? "default" : "outline"}
              asChild
            >
              <Link href={href}>{category.name}</Link>
            </Button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bravos.length === 0 ? (
          <div className="col-span-full text-sm text-muted-foreground">
            No bravos yet.
          </div>
        ) : (
          bravos.map((b: any) => (
            <AdminBravoCard
              key={b.id}
              id={b.id}
              name={b.name}
              slug={b.slug}
              image={b.image}
              categoryName={b.categoryName}
            />
          ))
        )}
      </div>
    </>
  );
}
