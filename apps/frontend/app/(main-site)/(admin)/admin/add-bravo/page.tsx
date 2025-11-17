import AddBravoForm from "@/components/forms/add-bravo-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllBravoCategories, requireAdmin } from "@/lib/queries";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Add Bravo",
  description: "Add Bravo page",
};

const AddBravoPage = () => {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <AddBravoContent />
      </Suspense>
    </div>
  );
};

async function AddBravoContent() {
  const session = await requireAdmin();
  const categories = (await getAllBravoCategories()) ?? [];
  return (
    <>
      <div>
        <Button asChild>
          <Link href="/admin">Admin page</Link>
        </Button>
      </div>

      <AddBravoForm categories={categories} />
    </>
  );
}

export default AddBravoPage;
