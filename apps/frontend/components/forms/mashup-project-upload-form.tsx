"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
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
  mashupProjectUploadSchema,
  type MashupProjectUploadFormData,
} from "@/lib/schemas/mashup-project-upload-schema";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

interface CoverImagePreview {
  url: string;
  file: File;
}

function MashupProjectUploadForm({
  setDialogOpen,
  collaboratorId,
  userSession,
}: {
  setDialogOpen: (open: boolean) => void;
  userSession: Session;
  collaboratorId: string;
}) {
  const [isSubmitting, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<MashupProjectUploadFormData>({
    resolver: zodResolver(mashupProjectUploadSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      projectLink: "",
      dedicatedToPerson: "",
      dedicatedToBrand: "",
      dedicatedToCause: "",
      dedicationReason: "",
      media: [],
      coverImage: undefined,
      collaboratorId: collaboratorId,
    },
  });

  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [coverImagePreview, setCoverImagePreview] =
    useState<CoverImagePreview | null>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  // Sync collaboratorId prop with form state
  useEffect(() => {
    form.setValue("collaboratorId", collaboratorId);
  }, [collaboratorId, form]);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview.url);
      }
    };
  }, [mediaPreviews, coverImagePreview]);

  const validateVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;
        if (duration < 5 || duration > 20) {
          toast.error("Video must be between 5 and 20 seconds long");
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

  const onSubmit = async (data: MashupProjectUploadFormData) => {
    console.log("🚀 [MASHUP] On submit called with data:", data);
    startTransition(async () => {
      const startTime = Date.now();
      try {
        const formData = new FormData();
        formData.append("projectName", data.projectName);
        formData.append("projectDescription", data.projectDescription);
        formData.append("projectLink", data.projectLink || "");
        formData.append("dedicatedToPerson", data.dedicatedToPerson || "");
        formData.append("dedicatedToBrand", data.dedicatedToBrand || "");
        formData.append("dedicatedToCause", data.dedicatedToCause || "");
        formData.append("dedicationReason", data.dedicationReason || "");
        formData.append("collaboratorId", collaboratorId);

        if (data.coverImage) {
          formData.append("coverImage", data.coverImage);
        }

        data.media.forEach((file) => {
          formData.append("media", file);
        });

        const uploadUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-mashup-project`;
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userSession.user.accessToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          let errorData: any = undefined;
          try {
            errorData = await response.json();
          } catch {}
          const errorMessage =
            errorData?.details ||
            errorData?.error ||
            "Failed to upload project";
          toast.error(`Upload failed: ${errorMessage}`);
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }

        await response.json();
        toast.success("Project uploaded successfully!");

        form.reset();
        mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        setMediaPreviews([]);
        if (coverImagePreview) {
          URL.revokeObjectURL(coverImagePreview.url);
          setCoverImagePreview(null);
        }
        setDialogOpen(false);
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Upload failed: ${errorMessage}`);
        console.error("Mashup upload error", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log("📝 [MASHUP] Form onSubmit event fired!");
          e.preventDefault();
          form.handleSubmit(
            (data) => {
              console.log("✅ [MASHUP] Form validation passed:", data);
              onSubmit(data);
            },
            (errors) => {
              console.error("❌ [MASHUP] Form validation failed:", errors);
              // Show first error
              const firstError = Object.values(errors)[0];
              if (firstError?.message) {
                toast.error(firstError.message);
              }
            }
          )();
        }}
        className={cn("grid items-start gap-3 text-sm")}
      >
        {/* Hidden field for collaboratorId - required by schema but not user input */}
        <FormField
          control={form.control}
          name="collaboratorId"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { onChange, value, ref: rhfRef, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Cover Image</FormLabel>
              <FormDescription className="text-xs mt-0 p-0">
                Upload a cover image for your project (required). Max 20MB.
              </FormDescription>
              <FormControl>
                <div className="space-y-2 mt-2">
                  <input
                    {...field}
                    ref={(e) => {
                      console.log("🔗 [MASHUP] Cover input ref callback:", e);
                      rhfRef(e);
                      coverImageRef.current = e;
                    }}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className=""
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      console.log(
                        "🖼️ [FRONTEND] Cover image selected:",
                        e.target.files
                      );

                      if (file) {
                        console.log("🖼️ [FRONTEND] Cover image selected:", {
                          name: file.name,
                          size: file.size,
                          type: file.type,
                        });

                        onChange(file);
                        if (coverImagePreview) {
                          URL.revokeObjectURL(coverImagePreview.url);
                        }
                        const previewUrl = URL.createObjectURL(file);
                        setCoverImagePreview({ url: previewUrl, file });
                      }
                    }}
                  />

                  {!value && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                          "🖼️ [MASHUP] Cover button clicked, ref:",
                          coverImageRef.current
                        );
                        if (coverImageRef.current) {
                          // Use setTimeout to ensure browser treats it as user-initiated
                          setTimeout(() => {
                            coverImageRef.current?.click();
                          }, 0);
                        } else {
                          console.error(
                            "❌ [MASHUP] coverImageRef.current is null!"
                          );
                        }
                      }}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="mr-2 h-3 w-3" />
                      Select Cover Image
                    </Button>
                  )}

                  {value && coverImagePreview && (
                    <div className="relative rounded-md border p-1">
                      <img
                        src={coverImagePreview.url}
                        alt="Cover preview"
                        className="w-full h-32 object-contain rounded-md bg-muted"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          URL.revokeObjectURL(coverImagePreview.url);
                          setCoverImagePreview(null);
                          onChange(undefined);
                          if (coverImageRef.current) {
                            coverImageRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
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
          name="media"
          render={({ field: { onChange, value, ref: rhfRef, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium ">
                Upload Media
              </FormLabel>
              <FormDescription className="text-xs mt-0 p-0 ">
                Upload one image or video. Videos can be up to 20 seconds and
                200MB. Images up to 20MB.
              </FormDescription>
              <FormControl>
                <div className="space-y-2 mt-2">
                  <input
                    {...field}
                    ref={(e) => {
                      console.log("🔗 [MASHUP] Media input ref callback:", e);
                      rhfRef(e);
                      mediaRef.current = e;
                    }}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                    className=""
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Validate video duration if it's a video
                      if (file.type.startsWith("video/")) {
                        const isValid = await validateVideoDuration(file);
                        if (!isValid) {
                          // Reset input if validation fails
                          if (mediaRef.current) {
                            mediaRef.current.value = "";
                          }
                          return;
                        }
                      }

                      // Clear previous previews
                      mediaPreviews.forEach((preview) =>
                        URL.revokeObjectURL(preview.url)
                      );

                      // Set new file
                      onChange([file]);
                      const previewUrl = URL.createObjectURL(file);
                      setMediaPreviews([
                        {
                          url: previewUrl,
                          type: file.type.startsWith("video/")
                            ? "video"
                            : "image",
                          file,
                        },
                      ]);

                      // Reset input to allow selecting the same file again
                      if (mediaRef.current) {
                        mediaRef.current.value = "";
                      }
                    }}
                  />

                  {(!value || value.length === 0) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                          "📁 [MASHUP] Media button clicked, ref:",
                          mediaRef.current
                        );
                        if (mediaRef.current) {
                          // Use setTimeout to ensure browser treats it as user-initiated
                          setTimeout(() => {
                            mediaRef.current?.click();
                          }, 0);
                        } else {
                          console.error(
                            "❌ [MASHUP] mediaRef.current is null!"
                          );
                        }
                      }}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="mr-2 h-3 w-3" />
                      Select Media
                    </Button>
                  )}

                  {value && value.length > 0 && mediaPreviews[0] && (
                    <div className="relative rounded-md border p-1">
                      {mediaPreviews[0].type === "image" ? (
                        <img
                          src={mediaPreviews[0].url}
                          alt="Media preview"
                          className="w-full h-24 object-contain rounded-md bg-muted"
                        />
                      ) : (
                        <video
                          src={mediaPreviews[0].url}
                          className="w-full h-24 object-contain rounded-md bg-muted"
                          controls
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          onChange([]);
                          if (mediaPreviews[0]) {
                            URL.revokeObjectURL(mediaPreviews[0].url);
                          }
                          setMediaPreviews([]);
                          if (mediaRef.current) {
                            mediaRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
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
              <FormLabel className="text-sm font-medium">
                Caption (optional)
              </FormLabel>
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
                <FormLabel className="text-sm">Person</FormLabel>
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
                <FormLabel className="text-sm">Brand</FormLabel>
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
                <FormLabel className="text-sm">Cause</FormLabel>
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 w-full"
          onClick={(e) => {
            console.log("🔘 [MASHUP] Submit button clicked!");
            console.log("🔘 [MASHUP] Form state:", {
              isValid: form.formState.isValid,
              errors: form.formState.errors,
              values: form.getValues(),
            });
            // Don't prevent default - let form submission happen
          }}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

export default MashupProjectUploadForm;
