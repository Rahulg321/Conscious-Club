import React, { Suspense } from "react";
import AddBravoCategoryForm from "@/components/forms/add-bravo-category-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Add Bravo Category",
  description: "Add Bravo Category page",
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
        <AddBravoCategoryContent />
      </Suspense>
    </div>
  );
};

async function AddBravoCategoryContent() {
  const session = await requireAdmin();
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Add Bravo Category</h1>
        <Button asChild>
          <Link href="/admin">Admin page</Link>
        </Button>
      </div>

      <AddBravoCategoryForm />
    </>
  );
}

export default page;
