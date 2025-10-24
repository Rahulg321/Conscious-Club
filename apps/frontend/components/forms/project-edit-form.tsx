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
  FormDescription,
} from "../ui/form";
import {
  projectEditSchema,
  type ProjectEditFormData,
} from "@/lib/schemas/project-edit-schema";
import { toast } from "sonner";
import { X, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { isVideo } from "@/lib/utils";

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file?: File;
}

interface ProjectEditFormProps {
  project: any;
  userSession: Session;
}

function ProjectEditForm({ project, userSession }: ProjectEditFormProps) {
  const [isSubmitting, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProjectEditFormData>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      projectName: project.name || "",
      projectDescription: project.description || "",
      projectLink: project.link || "",
      dedicatedToPerson: project.dedicatedToPerson || "",
      dedicatedToBrand: project.dedicatedToBrand || "",
      dedicatedToCause: project.dedicatedToCause || "",
      dedicationReason: project.dedicationReason || "",
      media: [],
    },
  });

  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const mediaRef = useRef<HTMLInputElement>(null);

  // Initialize media previews from existing project media
  useEffect(() => {
    if (project.media && project.media.length > 0) {
      const existingPreviews: MediaPreview[] = project.media.map(
        (mediaUrl: string) => ({
          url: mediaUrl,
          type: isVideo(mediaUrl) ? "video" : "image",
        })
      );
      setMediaPreviews(existingPreviews);

      // Convert existing media URLs to File objects for form handling
      const convertUrlToFile = async (
        url: string,
        index: number
      ): Promise<File> => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const fileName = `existing-media-${index}.${url.split(".").pop() || "jpg"}`;
          return new File([blob], fileName, { type: blob.type });
        } catch (error) {
          console.error("Error converting URL to File:", error);
          // Create a dummy file if conversion fails
          return new File([""], `existing-media-${index}.jpg`, {
            type: "image/jpeg",
          });
        }
      };

      // Convert all existing media to files and add to form
      Promise.all(
        project.media.map((url: string, index: number) =>
          convertUrlToFile(url, index)
        )
      ).then((files) => {
        form.setValue("media", files);
      });
    }
  }, [project.media, form]);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((preview) => {
        if (preview.file) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [mediaPreviews]);

  const onSubmit = async (data: ProjectEditFormData) => {
    startTransition(async () => {
      try {
        console.log("Edit form submission:", {
          projectName: data.projectName,
          mediaCount: data.media.length,
          mediaFiles: data.media.map((f) => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })),
        });

        const formData = new FormData();
        formData.append("projectName", data.projectName);
        formData.append("projectDescription", data.projectDescription);
        formData.append("projectLink", data.projectLink || "");
        formData.append("dedicatedToPerson", data.dedicatedToPerson || "");
        formData.append("dedicatedToBrand", data.dedicatedToBrand || "");
        formData.append("dedicatedToCause", data.dedicatedToCause || "");
        formData.append("dedicationReason", data.dedicationReason || "");

        // Add all media files (treat all as new uploads like upload form)
        data.media.forEach((file, index) => {
          console.log(`Adding file ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });
          formData.append("media", file);
        });

        const updateUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/update-project/${project.id}`;

        const response = await fetch(updateUrl, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${userSession.user.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update project");
        }

        toast.success("Project updated successfully!");
        router.push(`/profile/${project.userId}/projects/${project.id}`);
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Update failed: ${errorMessage}`);
      }
    });
  };

  const removeMediaPreview = (index: number) => {
    const preview = mediaPreviews[index];
    if (!preview) return;

    // Revoke URL if it's a blob URL (new files)
    if (preview.url.startsWith("blob:")) {
      URL.revokeObjectURL(preview.url);
    }

    // Update form field - remove the corresponding file
    const currentMedia = form.getValues("media") || [];
    const newMedia = [...currentMedia];
    newMedia.splice(index, 1);
    form.setValue("media", newMedia);

    // Update previews
    const newPreviews = [...mediaPreviews];
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };

  const handleMediaChange = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const currentMedia = form.getValues("media") || [];

    // Check if total count exceeds 4
    if (currentMedia.length + fileArray.length > 4) {
      toast.error("You can only upload up to 4 media files");
      if (mediaRef.current) {
        mediaRef.current.value = "";
      }
      return;
    }

    // Add files to form
    const newMedia = [...currentMedia, ...fileArray];
    form.setValue("media", newMedia);

    // Create preview URLs
    const newPreviews: MediaPreview[] = fileArray.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
    }));

    setMediaPreviews((prev) => [...prev, ...newPreviews]);

    // Reset input
    if (mediaRef.current) {
      mediaRef.current.value = "";
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-3 text-sm")}
      >
        <FormField
          control={form.control}
          name="media"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Upload Media
              </FormLabel>
              <FormDescription className="text-xs mt-0 p-0">
                Upload up to 4 images or videos. Videos can be up to 20 seconds
                and 200MB. Images up to 20MB.
              </FormDescription>
              <FormControl>
                <div className="space-y-2 mt-2">
                  <input
                    {...field}
                    ref={mediaRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                    multiple
                    className="hidden"
                    onChange={(e) => handleMediaChange(e.target.files)}
                  />

                  {(!mediaPreviews || mediaPreviews.length === 0) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => mediaRef.current?.click()}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="mr-2 h-3 w-3" />
                      Add Media
                    </Button>
                  )}

                  {mediaPreviews && mediaPreviews.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {mediaPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative rounded-md border p-1"
                            style={{
                              borderColor: "var(--color-border)",
                            }}
                          >
                            {preview.type === "image" ? (
                              <img
                                src={preview.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-24 object-contain rounded-md"
                                style={{ background: "var(--color-muted)" }}
                              />
                            ) : (
                              <video
                                src={preview.url}
                                className="w-full h-24 object-contain rounded-md"
                                style={{ background: "var(--color-muted)" }}
                                controls
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removeMediaPreview(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {mediaPreviews.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => mediaRef.current?.click()}
                          className="w-full"
                          size="sm"
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Add More Media ({mediaPreviews.length}/4)
                        </Button>
                      )}
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
              <FormLabel className="text-sm font-medium">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter project name"
                  {...field}
                  className="h-9"
                />
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
              <FormLabel className="text-sm font-medium">Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project..."
                  className="min-h-[80px]"
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
              <FormLabel className="text-sm font-medium">
                Project Link
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  className="h-9"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="">
            <FormLabel className="text-sm font-medium">
              Dedications (Optional)
            </FormLabel>
            <FormDescription className="text-xs">
              Would you like to dedicate this to someone? — a person, a brand,
              or a cause?
            </FormDescription>
          </div>

          <FormField
            control={form.control}
            name="dedicatedToPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">A Person</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter person's name"
                    {...field}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dedicatedToBrand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">A Brand</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter brand name"
                    {...field}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dedicatedToCause"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">A Cause</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter cause name"
                    {...field}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dedicationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">And Why?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why this dedication is meaningful to you..."
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-9">
          {isSubmitting ? "Updating..." : "Update Project"}
        </Button>
      </form>
    </Form>
  );
}

export default ProjectEditForm;
