"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  editBlogTagSchema,
  type EditBlogTagSchemaType,
} from "@/lib/schemas/blog-tags-schema";
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
import { adminEditBlogTag } from "@/lib/actions/blog-tags-actions";

interface EditBlogTagFormProps {
  tag: {
    id: string;
    name: string;
    description: string | null;
  };
  onSuccess?: () => void;
}

const EditBlogTagForm = ({ tag, onSuccess }: EditBlogTagFormProps) => {
  const router = useRouter();
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<EditBlogTagSchemaType>({
    resolver: zodResolver(editBlogTagSchema),
    defaultValues: {
      id: tag.id,
      name: tag.name,
      description: tag.description || "",
    },
  });

  const onSubmit = async (values: EditBlogTagSchemaType) => {
    startTransition(async () => {
      try {
        const response = await adminEditBlogTag(values);
        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);
        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error("Error updating blog tag:", error);
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
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Technology, Wellness" {...field} />
              </FormControl>
              <FormDescription>
                The name of the tag (max 50 characters)
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
                  placeholder="Brief description of this tag..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what this tag represents
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

export default EditBlogTagForm;
