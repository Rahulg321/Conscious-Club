import { getAllBravoCategories, requireAdmin } from "@/lib/queries";
import React, { Suspense } from "react";
import AdminBravoCategoryCard from "@/components/admin-bravo-category-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Bravo Categories",
  description: "Bravo Categories page",
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
        <BravoCategoriesContent />
      </Suspense>
    </div>
  );
};

async function BravoCategoriesContent() {
  await requireAdmin();
  const categories = await getAllBravoCategories();
  return (
    <>
      <div>
        <Button asChild>
          <Link href="/admin">Admin page</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Bravo Categories</h1>
      </div>

      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {!categories || categories.length === 0 ? (
          <div className="col-span-full text-sm text-muted-foreground">
            No categories yet.
          </div>
        ) : (
          categories.map((category) => (
            <AdminBravoCategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
              description={category.description}
            />
          ))
        )}
      </div>
    </>
  );
}

export default page;
