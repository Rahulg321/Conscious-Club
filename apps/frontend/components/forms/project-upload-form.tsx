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
import { X, Plus, ImagePlus, Video } from "lucide-react";
import { useRouter } from "next/navigation";

function ProjectUploadForm({
  setDialogOpen,
}: {
  setDialogOpen: (open: boolean) => void;
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
      additionalImages: [],
    },
  });

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      additionalImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [coverPreviewUrl, additionalImagePreviews, videoPreviewUrl]);

  const onSubmit = async (data: ProjectUploadFormData) => {
    // Validate video duration if video is provided
    if (data.coverVideo && videoDuration) {
      if (videoDuration < 5 || videoDuration > 10) {
        toast.error("Video must be between 5 and 10 seconds long");
        return;
      }
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("projectCover", data.projectCover);
        formData.append("projectName", data.projectName);
        formData.append("projectDescription", data.projectDescription);
        formData.append("projectLink", data.projectLink || "");
        formData.append("dedicatedToPerson", data.dedicatedToPerson || "");
        formData.append("dedicatedToBrand", data.dedicatedToBrand || "");
        formData.append("dedicatedToCause", data.dedicatedToCause || "");

        // Append additional images if any
        if (data.additionalImages && data.additionalImages.length > 0) {
          data.additionalImages.forEach((image) => {
            formData.append("additionalImages", image);
          });
        }

        // Append video if provided
        if (data.coverVideo) {
          formData.append("coverVideo", data.coverVideo);
          if (videoDuration) {
            formData.append("videoDuration", videoDuration.toString());
          }
        }

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
        additionalImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        setCoverPreviewUrl(null);
        setAdditionalImagePreviews([]);
        setVideoPreviewUrl(null);
        setVideoDuration(null);
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
          name="projectCover"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Cover</FormLabel>
              <FormControl>
                <div className="space-y-2">
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
                      size="sm"
                    >
                      Choose File
                    </Button>
                  )}

                  {value && coverPreviewUrl && (
                    <div className="rounded-md border p-2">
                      <div className="relative mx-auto h-20">
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
          name="additionalImages"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Additional Images (Optional)
              </FormLabel>
              <FormDescription className="text-xs">
                Upload up to 5 additional images to showcase your project
              </FormDescription>
              <FormControl>
                <div className="space-y-2">
                  <input
                    {...field}
                    ref={additionalImagesRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const currentImages = value || [];

                      // Check if total count exceeds 5
                      if (currentImages.length + files.length > 5) {
                        toast.error(
                          "You can only upload up to 5 additional images"
                        );
                        return;
                      }

                      const newImages = [...currentImages, ...files];
                      onChange(newImages);

                      // Create preview URLs
                      const newPreviews = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      setAdditionalImagePreviews((prev) => [
                        ...prev,
                        ...newPreviews,
                      ]);

                      // Reset input
                      if (additionalImagesRef.current) {
                        additionalImagesRef.current.value = "";
                      }
                    }}
                  />

                  {(!value || value.length === 0) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => additionalImagesRef.current?.click()}
                      className="w-full"
                      size="sm"
                    >
                      <ImagePlus className="mr-2 h-3 w-3" />
                      Add Additional Images
                    </Button>
                  )}

                  {value && value.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {additionalImagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative rounded-md border p-1"
                          >
                            <img
                              src={preview}
                              alt={`Additional image ${index + 1}`}
                              className="w-full h-16 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                const newImages = [...(value || [])];
                                newImages.splice(index, 1);
                                onChange(newImages);

                                // Revoke and update previews
                                URL.revokeObjectURL(preview);
                                const newPreviews = [
                                  ...additionalImagePreviews,
                                ];
                                newPreviews.splice(index, 1);
                                setAdditionalImagePreviews(newPreviews);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {value.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => additionalImagesRef.current?.click()}
                          className="w-full"
                          size="sm"
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Add More Images ({value.length}/5)
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
          name="coverVideo"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Cover Video (Optional)
              </FormLabel>
              <FormDescription className="text-xs">
                Upload a video between 5-10 seconds to showcase your project
              </FormDescription>
              <FormControl>
                <div className="space-y-2">
                  <input
                    {...field}
                    ref={videoRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Create video element to check duration
                        const videoElement = document.createElement("video");
                        videoElement.preload = "metadata";

                        videoElement.onloadedmetadata = () => {
                          window.URL.revokeObjectURL(videoElement.src);
                          const duration = videoElement.duration;
                          setVideoDuration(duration);

                          if (duration < 5 || duration > 10) {
                            toast.error(
                              "Video must be between 5 and 10 seconds long"
                            );
                            if (videoRef.current) videoRef.current.value = "";
                            return;
                          }

                          onChange(file as unknown as File);
                          const nextUrl = URL.createObjectURL(file);
                          if (videoPreviewUrl)
                            URL.revokeObjectURL(videoPreviewUrl);
                          setVideoPreviewUrl(nextUrl);
                        };

                        videoElement.src = URL.createObjectURL(file);
                      } else {
                        if (videoPreviewUrl)
                          URL.revokeObjectURL(videoPreviewUrl);
                        setVideoPreviewUrl(null);
                        setVideoDuration(null);
                      }
                    }}
                  />

                  {!videoPreviewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoRef.current?.click()}
                      className="w-full"
                      size="sm"
                    >
                      <Video className="mr-2 h-3 w-3" />
                      Add Cover Video
                    </Button>
                  )}

                  {value && videoPreviewUrl && (
                    <div className="rounded-md border p-2">
                      <div className="relative mx-auto">
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="w-full h-32 rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => {
                            if (videoPreviewUrl)
                              URL.revokeObjectURL(videoPreviewUrl);
                            setVideoPreviewUrl(null);
                            setVideoDuration(null);
                            onChange(undefined as unknown as File);
                            if (videoRef.current) videoRef.current.value = "";
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {videoDuration && (
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          Duration: {videoDuration.toFixed(1)}s
                        </p>
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
                Add Link (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
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
          <div className="space-y-1">
            <FormLabel className="text-sm font-medium">
              Dedications (Optional)
            </FormLabel>
            <FormDescription className="text-xs">
              Would you like to dedicate this to someone? — a person, a brand?
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
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-9">
          {isSubmitting ? "Uploading..." : "Upload Project"}
        </Button>
      </form>
    </Form>
  );
}

export default ProjectUploadForm;
