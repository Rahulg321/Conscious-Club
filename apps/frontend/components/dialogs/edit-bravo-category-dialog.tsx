"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import {
  bravoCategorySchema,
  type BravoCategorySchemaType,
} from "@/lib/schemas/bravo-category-schema";
import { adminEditBravoCategory } from "@/lib/actions/edit-bravo-category";

export function EditBravoCategoryDialog({
  bravoCategoryId,
  bravoCategoryName,
  bravoCategoryDescription,
}: {
  bravoCategoryId: string;
  bravoCategoryName: string;
  bravoCategoryDescription: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bravo Category</DialogTitle>
            <DialogDescription>
              Make changes to your bravo category here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <EditBravoCategoryForm
            bravoCategoryId={bravoCategoryId}
            bravoCategoryName={bravoCategoryName}
            bravoCategoryDescription={bravoCategoryDescription}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Edit />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Bravo Category</DrawerTitle>
          <DrawerDescription>
            Make changes to your bravo category here. Click save when
            you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <EditBravoCategoryForm
          bravoCategoryId={bravoCategoryId}
          bravoCategoryName={bravoCategoryName}
          bravoCategoryDescription={bravoCategoryDescription}
          onSuccess={() => setOpen(false)}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function EditBravoCategoryForm({
  bravoCategoryId,
  bravoCategoryName,
  bravoCategoryDescription,
  onSuccess,
  className,
}: {
  bravoCategoryId: string;
  bravoCategoryName: string;
  bravoCategoryDescription: string;
  onSuccess: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<BravoCategorySchemaType>({
    resolver: zodResolver(bravoCategorySchema),
    defaultValues: {
      name: bravoCategoryName,
      description: bravoCategoryDescription,
    },
  });

  const onSubmit = async (values: BravoCategorySchemaType) => {
    startTransition(async () => {
      try {
        const response = await adminEditBravoCategory(bravoCategoryId, values);
        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);
        onSuccess();
        router.refresh();
      } catch (error) {
        console.error("Error updating bravo category:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the category (max 64 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description"
                    className="min-h-[100px] max-h-[200px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Briefly describe this category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating Category...
            </div>
          ) : (
            "Update Category"
          )}
        </Button>
      </form>
    </Form>
  );
}
