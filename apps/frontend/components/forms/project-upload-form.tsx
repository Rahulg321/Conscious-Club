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
  projectUploadSchema,
  type ProjectUploadFormData,
} from "@/lib/schemas/project-upload-schema";
import { toast } from "sonner";
import { X, Plus, Upload, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

function ProjectUploadForm({
  setDialogOpen,
  isMashup = false,
  collaboratorId,
}: {
  setDialogOpen: (open: boolean) => void;
  isMashup?: boolean;
  collaboratorId?: string;
}) {
  const [isSubmitting, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProjectUploadFormData>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      projectLink: "",
      dedicatedToPerson: "",
      dedicatedToBrand: "",
      dedicatedToCause: "",
      dedicationReason: "",
      media: [],
    },
  });

  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const mediaRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [mediaPreviews]);

  const validateVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;

        if (duration < 5 || duration > 10) {
          toast.error("Video must be between 5 and 10 seconds long");
          resolve(false);
        } else {
          resolve(true);
        }
      };

      videoElement.onerror = () => {
        toast.error("Error loading video file");
        resolve(false);
      };

      videoElement.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = async (data: ProjectUploadFormData) => {
    // Validate all videos have correct duration
    const videoFiles = data.media.filter((file) =>
      file.type.startsWith("video/")
    );

    for (const videoFile of videoFiles) {
      const isValid = await validateVideoDuration(videoFile);
      if (!isValid) {
        return;
      }
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("projectName", data.projectName);
        formData.append("projectDescription", data.projectDescription);
        formData.append("projectLink", data.projectLink || "");
        formData.append("dedicatedToPerson", data.dedicatedToPerson || "");
        formData.append("dedicatedToBrand", data.dedicatedToBrand || "");
        formData.append("dedicatedToCause", data.dedicatedToCause || "");
        formData.append("dedicationReason", data.dedicationReason || "");
        formData.append("isMashup", isMashup.toString());
        if (collaboratorId) {
          formData.append("collaboratorId", collaboratorId);
        }

        // Append all media files
        data.media.forEach((file) => {
          formData.append("media", file);
        });

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
        mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        setMediaPreviews([]);
        setDialogOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Error uploading project:", error);
        toast.error("error uploading file");
      }
    });
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
              <FormLabel className="text-sm font-medium ">
                Upload Media
              </FormLabel>
              <FormDescription className="text-xs mt-0 p-0 ">
                Upload up to 4 images or videos. Videos can be upto 10 seconds.
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
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      const currentMedia = value || [];

                      // Check if total count exceeds 4
                      if (currentMedia.length + files.length > 4) {
                        toast.error("You can only upload up to 4 media files");
                        return;
                      }

                      // Validate video durations before adding
                      const validFiles: File[] = [];
                      for (const file of files) {
                        if (file.type.startsWith("video/")) {
                          const isValid = await validateVideoDuration(file);
                          if (isValid) {
                            validFiles.push(file);
                          }
                        } else {
                          validFiles.push(file);
                        }
                      }

                      if (validFiles.length > 0) {
                        const newMedia = [...currentMedia, ...validFiles];
                        onChange(newMedia);

                        // Create preview URLs
                        const newPreviews: MediaPreview[] = validFiles.map(
                          (file) => ({
                            url: URL.createObjectURL(file),
                            type: file.type.startsWith("video/")
                              ? "video"
                              : "image",
                            file,
                          })
                        );
                        setMediaPreviews((prev) => [...prev, ...newPreviews]);
                      }

                      // Reset input
                      if (mediaRef.current) {
                        mediaRef.current.value = "";
                      }
                    }}
                  />

                  {(!value || value.length === 0) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => mediaRef.current?.click()}
                      className="w-full"
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-3 w-3" />
                    </Button>
                  )}

                  {value && value.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {mediaPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative rounded-md border p-1"
                          >
                            {preview.type === "image" ? (
                              <img
                                src={preview.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                              />
                            ) : (
                              <video
                                src={preview.url}
                                className="w-full h-24 object-cover rounded-md"
                                controls
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                const newMedia = [...(value || [])];
                                newMedia.splice(index, 1);
                                onChange(newMedia);

                                // Revoke and update previews
                                URL.revokeObjectURL(preview.url);
                                const newPreviews = [...mediaPreviews];
                                newPreviews.splice(index, 1);
                                setMediaPreviews(newPreviews);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {value.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => mediaRef.current?.click()}
                          className="w-full"
                          size="sm"
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Add More Media ({value.length}/4)
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
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

export default ProjectUploadForm;
