import React from "react";
import AddBravoCategoryForm from "@/components/forms/add-bravo-category-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";

export const metadata = {
  title: "Add Bravo Category",
  description: "Add Bravo Category page",
};

const page = async () => {
  const session = await requireAdmin();
  return (
    <div className="block-space big-container">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Add Bravo Category</h1>
        <Button asChild>
          <Link href="/admin">Admin page</Link>
        </Button>
      </div>

      <AddBravoCategoryForm />
    </div>
  );
};

export default page;
