"use client";

import Image from "next/image";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { adminDeleteBravo } from "@/lib/actions/admin-delete-bravo";
import { toast } from "sonner";

export default function AdminBravoCard({
  id,
  name,
  slug,
  image,
  categoryName,
}: {
  id: string;
  name: string;
  slug: string;
  image: string;
  categoryName: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!id) return;
    startTransition(async () => {
      const response = await adminDeleteBravo(id);
      if (response.success) {
        toast.success("Bravo deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete bravo");
      }
    });
  };

  return (
    <div
      key={id}
      className="overflow-hidden rounded-lg border bg-white shadow-sm"
    >
      <div className="relative h-36 w-full bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2 p-3">
        <div>
          <div className="text-sm font-semibold leading-tight">{name}</div>
          <div className="text-xs text-muted-foreground">/{slug}</div>
        </div>
        <div className="flex items-center gap-2">
          {categoryName ? (
            <span className="rounded-md bg-muted px-2 py-1 text-xs capitalize text-muted-foreground">
              {categoryName}
            </span>
          ) : null}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
