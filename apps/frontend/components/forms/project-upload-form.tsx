"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  projectUploadSchema,
  type ProjectUploadFormData,
} from "@/lib/schemas/project-upload-schema";
import { toast } from "sonner";

function ProjectUploadForm({ className }: React.ComponentProps<"form">) {
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<ProjectUploadFormData>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      projectLink: "",
    },
  });

  const onSubmit = async (data: ProjectUploadFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("projectCover", data.projectCover);
        formData.append("projectName", data.projectName);
        formData.append("projectDescription", data.projectDescription);
        formData.append("projectLink", data.projectLink);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to upload project");
        }

        const result = await response.json();
        console.log("Project uploaded successfully:", result);

        toast.success("uploaded successfully");

        // Reset form on success
        form.reset();
      } catch (error) {
        console.error("Error uploading project:", error);
        // You might want to show a toast notification here
        toast.error("error uploading file");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-6", className)}
      >
        <FormField
          control={form.control}
          name="projectCover"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Project Cover</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload Project"}
        </Button>
      </form>
    </Form>
  );
}

export default ProjectUploadForm;
