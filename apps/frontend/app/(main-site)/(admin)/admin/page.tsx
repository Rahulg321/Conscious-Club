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
import React from "react";

export const metadata = {
  title: "Admin",
  description: "Admin page",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { category?: string | string[] };
}) {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  const session = await requireAdmin();
  const selectedCategory = searchParams?.category;
  const bravos = (await getAllBravos(selectedCategory)) ?? [];
  const categories = await getAllBravoCategories();

  return (
    <div className="block-space big-container">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link href="/admin/add-bravo">Add Bravo</Link>
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
    </div>
  );
}
