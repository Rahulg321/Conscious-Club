import AddBravoForm from "@/components/forms/add-bravo-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllBravoCategories, requireAdmin } from "@/lib/queries";
import React from "react";

export const metadata = {
  title: "Add Bravo",
  description: "Add Bravo page",
};

const AddBravoPage = async () => {
  const session = await requireAdmin();
  const categories = (await getAllBravoCategories()) ?? [];
  return (
    <div className="block-space big-container">
      <div>
        <Button asChild>
          <Link href="/admin">Admin page</Link>
        </Button>
      </div>

      <AddBravoForm categories={categories} />
    </div>
  );
};

export default AddBravoPage;
