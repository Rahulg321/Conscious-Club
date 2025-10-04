"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminDeleteBravoCategory } from "@/lib/actions/admin-delete-bravo-category";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { EditBravoCategoryDialog } from "./dialogs/edit-bravo-category-dialog";

export default function AdminBravoCategoryCard({
  id,
  name,
  slug,
  description,
}: {
  id: string;
  name: string;
  slug: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle className="flex-1 flex items-baseline justify-between">
          <span className="truncate">{name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            /{slug}
          </span>
        </CardTitle>
        <EditBravoCategoryDialog
          bravoCategoryId={id}
          bravoCategoryName={name}
          bravoCategoryDescription={description}
        />

        <CategoryDeleteAlertDialog id={id} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

const CategoryDeleteAlertDialog = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size={"icon"}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the bravo
            category and all associated bravos. account and remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!id) return;
              startTransition(async () => {
                const response = await adminDeleteBravoCategory(id);
                if (response.success) {
                  toast.success("Category deleted successfully");
                } else {
                  toast.error(response.message || "Failed to delete category");
                }
              });
            }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
