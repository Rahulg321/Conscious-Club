"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
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
}

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

export const ProjectUploadStep = ({
  formData,
  updateFormData,
}: ProjectUploadStepProps) => {
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

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentMedia = formData.projectMedia || [];

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
      updateFormData("projectMedia", newMedia);

      // Create preview URLs
      const newPreviews: MediaPreview[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        file,
      }));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
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
    const preview = mediaPreviews[index];
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }
    const newPreviews = [...mediaPreviews];
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-6">
          This step is optional. You can skip it and add creations later from
          your profile.
        </p>
      </div>

      {/* Project Media Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Upload Media</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Upload up to 4 images or videos. Videos must be 5-20 seconds and up to
          200MB. Images up to 20MB.
        </p>

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
            className="w-full"
          >
            <Plus className="mr-2 h-3 w-3" />
            Add More Media ({formData.projectMedia?.length || 0}/4)
          </Button>
        )}

        {formData.projectMedia && formData.projectMedia.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative rounded-md border p-1">
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
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add More Media ({formData.projectMedia.length}/4)
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="projectName">Title</Label>
        <Input
          id="projectName"
          value={formData.projectName}
          onChange={(e) => updateFormData("projectName", e.target.value)}
          placeholder="Enter your project name"
        />
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Caption</Label>
        <Textarea
          id="projectDescription"
          value={formData.projectDescription}
          onChange={(e) => updateFormData("projectDescription", e.target.value)}
          placeholder="Describe your project, what it does, and what makes it special..."
          className="min-h-[80px]"
        />
      </div>

      {/* Dedications Section */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Dedications (Optional)</Label>
          <p className="text-xs text-muted-foreground">
            Would you like to dedicate this to someone? — a person, a brand, or
            a cause?
          </p>
        </div>

        {/* Dedicated to Person */}
        <div className="space-y-2">
          <Label htmlFor="dedicatedToPerson" className="text-sm">
            A Person
          </Label>
          <Input
            id="dedicatedToPerson"
            value={formData.dedicatedToPerson}
            onChange={(e) =>
              updateFormData("dedicatedToPerson", e.target.value)
            }
            placeholder="Enter person's name"
          />
        </div>

        {/* Dedicated to Brand */}
        <div className="space-y-2">
          <Label htmlFor="dedicatedToBrand" className="text-sm">
            A Brand
          </Label>
          <Input
            id="dedicatedToBrand"
            value={formData.dedicatedToBrand}
            onChange={(e) => updateFormData("dedicatedToBrand", e.target.value)}
            placeholder="Enter brand name"
          />
        </div>

        {/* Dedicated to Cause */}
        <div className="space-y-2">
          <Label htmlFor="dedicatedToCause" className="text-sm">
            A Cause
          </Label>
          <Input
            id="dedicatedToCause"
            value={formData.dedicatedToCause}
            onChange={(e) => updateFormData("dedicatedToCause", e.target.value)}
            placeholder="Enter cause name"
          />
        </div>

        {/* Dedication Reason */}
        <div className="space-y-2">
          <Label htmlFor="dedicationReason" className="text-sm">
            And Why?
          </Label>
          <Textarea
            id="dedicationReason"
            value={formData.dedicationReason}
            onChange={(e) => updateFormData("dedicationReason", e.target.value)}
            placeholder="Tell us why this dedication is meaningful to you..."
            className="min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
};
