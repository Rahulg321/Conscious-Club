"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  editBlogCategorySchema,
  type EditBlogCategorySchemaType,
} from "@/lib/schemas/blog-categories-schema";
import { Button } from "@/components/ui/button";
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
import { Loader2, Save } from "lucide-react";
import { adminEditBlogCategory } from "@/lib/actions/blog-categories-actions";

interface EditBlogCategoryFormProps {
  category: {
    id: string;
    name: string;
    description: string | null;
  };
  onSuccess?: () => void;
}

const EditBlogCategoryForm = ({
  category,
  onSuccess,
}: EditBlogCategoryFormProps) => {
  const router = useRouter();
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<EditBlogCategorySchemaType>({
    resolver: zodResolver(editBlogCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description || "",
    },
  });

  const onSubmit = async (values: EditBlogCategorySchemaType) => {
    startTransition(async () => {
      try {
        const response = await adminEditBlogCategory(values);
        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);
        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error("Error updating blog category:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lifestyle, Travel" {...field} />
              </FormControl>
              <FormDescription>
                The name of the category (max 100 characters)
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
                  placeholder="Brief description of this category..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what this category represents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditBlogCategoryForm;
