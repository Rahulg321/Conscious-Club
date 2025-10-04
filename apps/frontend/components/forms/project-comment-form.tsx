"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  projectCommentSchema,
  ProjectCommentSchemaType,
} from "@/lib/schemas/project-comment-schema";
import { addProjectComment } from "@/lib/actions/add-project-comment";

interface ProjectCommentFormProps {
  projectId: string;
  onCommentAdded?: () => void;
}

const ProjectCommentForm = ({
  projectId,
  onCommentAdded,
}: ProjectCommentFormProps) => {
  const [isSubmitting, startSubmitTransition] = React.useTransition();

  const form = useForm<ProjectCommentSchemaType>({
    resolver: zodResolver(projectCommentSchema),
    defaultValues: {
      content: "",
      projectId: projectId,
    },
  });

  const onSubmit = async (values: ProjectCommentSchemaType) => {
    startSubmitTransition(async () => {
      try {
        const result = await addProjectComment(values);

        if (result.success) {
          toast.success("Comment added successfully!");
          form.reset();
          onCommentAdded?.();
        } else {
          toast.error(result.message || "Failed to add comment");
        }
      } catch (error) {
        toast.error("Failed to add comment. Please try again.");
        console.error("Comment submission error:", error);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Add a Comment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this project..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Comment...
                </div>
              ) : (
                "Add Comment"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectCommentForm;
