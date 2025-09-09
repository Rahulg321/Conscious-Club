"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  projectUploadSchema,
  type ProjectUploadFormData,
} from "@/lib/schemas/project-upload-schema";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Tags } from "@repo/db/schema";

function ProjectUploadForm({
  setDialogOpen,
  allTags,
}: {
  setDialogOpen: (open: boolean) => void;
  allTags: Tags[];
}) {
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<ProjectUploadFormData>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      projectLink: "",
      tagId: "",
    },
  });

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  const onSubmit = async (data: ProjectUploadFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("projectCover", data.projectCover);
        formData.append("projectName", data.projectName);
        formData.append("projectDescription", data.projectDescription);
        formData.append("projectLink", data.projectLink);
        formData.append("tagId", data.tagId);

        const response = await fetch("/api/upload-project", {
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
        if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
        setCoverPreviewUrl(null);
        setDialogOpen(false);
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
        className={cn("grid items-start gap-4")}
      >
        <FormField
          control={form.control}
          name="projectCover"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Project Cover</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <input
                    {...field}
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file as unknown as File);
                      if (file) {
                        const nextUrl = URL.createObjectURL(file);
                        if (coverPreviewUrl)
                          URL.revokeObjectURL(coverPreviewUrl);
                        setCoverPreviewUrl(nextUrl);
                      } else {
                        if (coverPreviewUrl)
                          URL.revokeObjectURL(coverPreviewUrl);
                        setCoverPreviewUrl(null);
                      }
                    }}
                  />
                  {!coverPreviewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  )}

                  {value && coverPreviewUrl && (
                    <div className="rounded-md border p-3">
                      <div className="relative mx-auto h-32">
                        <img
                          src={coverPreviewUrl}
                          alt="Project cover preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => {
                            if (coverPreviewUrl)
                              URL.revokeObjectURL(coverPreviewUrl);
                            setCoverPreviewUrl(null);
                            onChange(undefined as unknown as File);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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

        <FormField
          control={form.control}
          name="tagId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
