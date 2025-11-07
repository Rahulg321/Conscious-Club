"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, PlusCircle, Upload, EyeClosed, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingFormData } from "../../types";
import { toast } from "sonner";

interface ProjectUploadStepProps {
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | File[] | null
  ) => void;
  submitOnboarding: () => void;
  isSubmitting: boolean;
}

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

interface CoverImagePreview {
  url: string;
  file: File;
}

export const ProjectUploadStep = ({
  submitOnboarding,
  isSubmitting,
  formData,
  updateFormData,
}: ProjectUploadStepProps) => {
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [coverImagePreview, setCoverImagePreview] =
    useState<CoverImagePreview | null>(null);
  const [dedications, setDedications] = useState<boolean>(false);
  const mediaRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  // Sync cover image preview with form data
  useEffect(() => {
    if (formData.coverImage) {
      // Clean up old preview if it exists
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview.url);
      }
      const previewUrl = URL.createObjectURL(formData.coverImage);
      setCoverImagePreview({
        url: previewUrl,
        file: formData.coverImage,
      });
    } else {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview.url);
        setCoverImagePreview(null);
      }
    }
  }, [formData.coverImage]);

  // Sync media previews with form data
  useEffect(() => {
    const currentMediaFiles = formData.projectMedia || [];

    // If formData.projectMedia is empty, clear previews
    if (currentMediaFiles.length === 0) {
      setMediaPreviews((prev) => {
        prev.forEach((preview) => URL.revokeObjectURL(preview.url));
        return [];
      });
      return;
    }

    // Update previews based on current media files
    setMediaPreviews((prev) => {
      const previewFiles = prev.map((p) => p.file);
      const filesMatch =
        previewFiles.length === currentMediaFiles.length &&
        previewFiles.every((file, index) => file === currentMediaFiles[index]);

      if (filesMatch) {
        // Files match, no update needed
        return prev;
      }

      // Revoke old preview URLs
      prev.forEach((preview) => URL.revokeObjectURL(preview.url));

      // Create new previews
      return currentMediaFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        file,
      }));
    });
  }, [formData.projectMedia]);

  // Revoke object URLs on unmount
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
      console.log("🎬 [FRONTEND] Validating video duration for:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;

        console.log("🎬 [FRONTEND] Video metadata loaded:", {
          fileName: file.name,
          duration: duration,
          isValid: duration >= 5 && duration <= 20,
        });

        if (duration < 5 || duration > 20) {
          console.error("❌ [FRONTEND] Video duration validation failed:", {
            fileName: file.name,
            duration: duration,
            required: "5-20 seconds",
          });
          toast.error("Video must be between 5 and 20 seconds long");
          resolve(false);
        } else {
          console.log(
            "✅ [FRONTEND] Video duration validation passed:",
            file.name
          );
          resolve(true);
        }
      };

      videoElement.onerror = (error) => {
        console.error("❌ [FRONTEND] Error loading video file:", {
          fileName: file.name,
          error: error,
        });
        toast.error("Error loading video file");
        resolve(false);
      };

      videoElement.src = URL.createObjectURL(file);
    });
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentMedia = formData.projectMedia || [];

    console.log("📁 [FRONTEND] File selection changed:", {
      newFiles: files.length,
      currentMedia: currentMedia.length,
      totalAfterAdd: currentMedia.length + files.length,
      files: files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    });

    // Check if total count exceeds 4
    if (currentMedia.length + files.length > 4) {
      console.error("❌ [FRONTEND] Too many files selected:", {
        current: currentMedia.length,
        new: files.length,
        total: currentMedia.length + files.length,
        max: 4,
      });
      toast.error("You can only upload up to 4 media files");
      return;
    }

    // Validate video durations before adding
    const validFiles: File[] = [];
    console.log("🎬 [FRONTEND] Starting video validation for new files");

    for (const file of files) {
      if (file.type.startsWith("video/")) {
        console.log("🎬 [FRONTEND] Validating video file:", file.name);
        const isValid = await validateVideoDuration(file);
        if (isValid) {
          validFiles.push(file);
          console.log("✅ [FRONTEND] Video validation passed:", file.name);
        } else {
          console.error("❌ [FRONTEND] Video validation failed:", file.name);
        }
      } else {
        console.log("🖼️ [FRONTEND] Image file added:", file.name);
        validFiles.push(file);
      }
    }

    console.log("📁 [FRONTEND] File validation complete:", {
      totalFiles: files.length,
      validFiles: validFiles.length,
      rejectedFiles: files.length - validFiles.length,
    });

    if (validFiles.length > 0) {
      const newMedia = [...currentMedia, ...validFiles];
      updateFormData("projectMedia", newMedia);

      // Create preview URLs
      const newPreviews: MediaPreview[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        file,
      }));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);

      console.log("✅ [FRONTEND] Media previews updated:", {
        totalPreviews: newMedia.length,
        newPreviews: newPreviews.length,
      });
    }

    // Reset input
    if (mediaRef.current) {
      mediaRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = [...formData.projectMedia];
    newMedia.splice(index, 1);
    updateFormData("projectMedia", newMedia);

    // Revoke and update previews
    const previewToRemove = mediaPreviews[index];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    const newPreviews = [...mediaPreviews];
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };

  return (
    <div className="space-y-6">
      <div
        className="text-center text-indigo-500 flex items-center justify-end gap-2 cursor-pointer"
        onClick={() => !isSubmitting && submitOnboarding()}
      >
        {isSubmitting ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : (
          "Skip this step and add later"
        )}
        {/* <p className="text-sm text-muted-foreground mb-6">
          This step is optional. You can skip it and add creations later from
          your profile. If you start filling any project field, all required
          fields (cover image, title, and caption) must be completed.
        </p> */}
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Add a cover photo{" "}
          <span className="text-xs text-muted-foreground">(Max 20MB)</span>
        </Label>

        <div className="">
          <input
            ref={coverImageRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("🖼️ [FRONTEND] Cover image selected:", {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                });
                updateFormData("coverImage", file);

                // Create preview
                if (coverImagePreview) {
                  URL.revokeObjectURL(coverImagePreview.url);
                }
                const previewUrl = URL.createObjectURL(file);
                setCoverImagePreview({
                  url: previewUrl,
                  file,
                });
              }
            }}
          />

          {!formData.coverImage && (
            <Button
              type="button"
              variant="outline"
              onClick={() => coverImageRef.current?.click()}
              className="w-full text-sm text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-md shadow-indigo-100 hover:shadow-none rounded-xl"
              size="sm"
            >
              <Upload className=" h-2 w-2" />
              Select Image
            </Button>
          )}

          {formData.coverImage && coverImagePreview && (
            <div className="relative rounded-md border p-1">
              <img
                src={coverImagePreview.url}
                alt="Cover preview"
                className="w-full h-32 object-cover rounded-md bg-muted"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => {
                  URL.revokeObjectURL(coverImagePreview.url);
                  setCoverImagePreview(null);
                  updateFormData("coverImage", null);
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
      </div>

      {/* Project Media Upload */}
      <div className="">
        <Label className="text-sm font-medium">Upload Media</Label>

        <div className="mt-2">
          <input
            ref={mediaRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
            onChange={handleMediaChange}
          />

          {(!formData.projectMedia || formData.projectMedia.length === 0) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => mediaRef.current?.click()}
              className="w-full text-sm text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-md shadow-indigo-100 hover:shadow-none rounded-xl"
              size="sm"
            >
              <PlusCircle className="mr-2 h-3 w-3" />
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Upload up to 4 images or videos. Videos can be up to 20 seconds each
            and 200MB. Images up to 20MB each.
          </p>

          {formData.projectMedia && formData.projectMedia.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative rounded-md border">
                    {preview.type === "image" ? (
                      <img
                        src={preview.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md bg-muted"
                      />
                    ) : (
                      <video
                        src={preview.url}
                        className="w-full h-24 object-cover rounded-md bg-muted"
                        controls
                      />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 border-destructive text-destructive"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {formData.projectMedia.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => mediaRef.current?.click()}
                  className="w-full text-sm text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-md shadow-indigo-100 hover:shadow-none rounded-xl"
                  size="sm"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add More Media ({formData.projectMedia.length}/4)
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <div className="text-sm font-medium">
          Title
          <span className="text-xs text-red-500 ml-1">*</span>
        </div>
        <Input
          id="projectName"
          value={formData.projectName}
          onChange={(e) => updateFormData("projectName", e.target.value)}
          placeholder="Enter creation title"
          className="h-9"
        />
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <div className="text-sm font-medium">
          Caption
          <span className="text-xs text-red-500 ml-1">*</span>
        </div>
        <Textarea
          id="projectDescription"
          value={formData.projectDescription}
          onChange={(e) => updateFormData("projectDescription", e.target.value)}
          placeholder="..."
          className=""
        />
      </div>

      {/* Dedications Section */}
      {!dedications ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setDedications(!dedications)}
          className="w-full text-sm text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-md shadow-indigo-100 hover:shadow-none rounded-xl"
          size="sm"
        >
          <Plus className=" h-2 w-2" />
          Add Dedications (optional)
        </Button>
      ) : (
        <>
          <div className="space-y-3">
            <div className="">
              <Label className="text-sm font-medium text-indigo-500">
                Dedications
              </Label>
              {/* <p className="text-xs text-muted-foreground">
            Would you like to dedicate this to someone? — a person, a brand, or
            a cause?
          </p> */}
            </div>

            {/* Dedicated to Person */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="dedicatedToPerson" className="text-sm">
                  A person
                </Label>
                <Input
                  id="dedicatedToPerson"
                  value={formData.dedicatedToPerson}
                  onChange={(e) =>
                    updateFormData("dedicatedToPerson", e.target.value)
                  }
                  placeholder="Enter person's name"
                  className="h-9"
                />
              </div>

              {/* Dedicated to Brand */}
              <div className="space-y-2 w-full">
                <Label htmlFor="dedicatedToBrand" className="text-sm">
                  A brand
                </Label>
                <Input
                  id="dedicatedToBrand"
                  value={formData.dedicatedToBrand}
                  onChange={(e) =>
                    updateFormData("dedicatedToBrand", e.target.value)
                  }
                  placeholder="Enter brand name"
                  className="h-9"
                />
              </div>
            </div>

            {/* Dedicated to Cause */}
            <div className="space-y-2">
              <Label htmlFor="dedicatedToCause" className="text-sm">
                A cause
              </Label>
              <Input
                id="dedicatedToCause"
                value={formData.dedicatedToCause}
                onChange={(e) =>
                  updateFormData("dedicatedToCause", e.target.value)
                }
                placeholder="Enter cause name"
                className="h-9"
              />
            </div>

            {/* Dedication Reason */}
            <div className="space-y-2">
              <Label htmlFor="dedicationReason" className="text-sm">
                Drop your reason - we love a backstory!
              </Label>
              <Textarea
                id="dedicationReason"
                value={formData.dedicationReason}
                onChange={(e) =>
                  updateFormData("dedicationReason", e.target.value)
                }
                placeholder="..."
                className="min-h-[60px]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDedications(!dedications)}
              className="w-max text-sm text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-md shadow-indigo-100 hover:shadow-none rounded-xl"
              size="sm"
            >
              Hide Dedications
              <EyeClosed className=" h-2 w-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
