"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  blogCategorySchema,
  type BlogCategorySchemaType,
} from "@/lib/schemas/blog-categories-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Plus } from "lucide-react";
import { adminAddBlogCategory } from "@/lib/actions/blog-categories-actions";

const AddBlogCategoriesForm = () => {
  const router = useRouter();
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<BlogCategorySchemaType>({
    resolver: zodResolver(blogCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: BlogCategorySchemaType) => {
    startTransition(async () => {
      try {
        const response = await adminAddBlogCategory(values);
        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);
        form.reset();
        router.refresh();
      } catch (error) {
        console.error("Error adding blog category:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Blog Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Category...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Category
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBlogCategoriesForm;
