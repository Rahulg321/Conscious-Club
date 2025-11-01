"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
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
  challengeEntrySchema,
  type ChallengeEntrySchemaType,
} from "@/lib/schemas/challenge-entry-schema";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

interface ChallengeEntryFormProps {
  challengeId: string;
  setDialogOpen?: (open: boolean) => void;
}

export function ChallengeEntryForm({ challengeId, setDialogOpen }: ChallengeEntryFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChallengeEntrySchemaType>({
    resolver: zodResolver(challengeEntrySchema),
    defaultValues: {
      challengeId,
      caption: "",
      media: undefined,
    },
  });

  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview.url);
      }
    };
  }, [mediaPreview]);

  const handleMediaChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Only take the first file
    if (!file) return;

    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];

    if (![...imageTypes, ...videoTypes].includes(file.type)) {
      toast.error(`${file.name} is not a valid file type`);
      return;
    }

    if (videoTypes.includes(file.type) && file.size > 50 * 1024 * 1024) {
      toast.error(`${file.name} exceeds 50MB size limit`);
      return;
    }

    if (imageTypes.includes(file.type) && file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} exceeds 5MB size limit`);
      return;
    }

    form.setValue("media", file);

    // Revoke previous preview if exists
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview.url);
    }

    const preview: MediaPreview = {
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
    };

    setMediaPreview(preview);

    if (mediaRef.current) {
      mediaRef.current.value = "";
    }
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview.url);
    }
    form.resetField("media");
    setMediaPreview(null);
  };

  const onSubmit = async (data: ChallengeEntrySchemaType) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to submit an entry");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("challengeId", data.challengeId);
        formData.append("caption", data.caption);
        formData.append("media", data.media); // Single file

        const uploadUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/submit-challenge-entry`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (parseError) {
            errorData = { error: "Unknown error occurred" };
          }

          const errorMessage =
            errorData?.details || errorData?.error || "Failed to submit entry";
          toast.error(errorMessage);
          return;
        }

        const result = await response.json();
        toast.success("Challenge entry submitted successfully!");

        // Reset form on success
        form.reset();
        if (mediaPreview) {
          URL.revokeObjectURL(mediaPreview.url);
        }
        setMediaPreview(null);
        
        // Close dialog if provided
        if (setDialogOpen) {
          setDialogOpen(false);
        }
        
        router.refresh();
      } catch (error) {
        console.error("Error submitting challenge entry:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Caption</FormLabel>
              <FormDescription className="text-xs">
                Describe your entry (10-500 characters)
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your challenge entry..."
                  className="min-h-[100px]"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="media"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Media</FormLabel>
              <FormDescription className="text-xs">
                Upload one image or video. Videos up to 50MB, images up to 5MB.
              </FormDescription>
              <FormControl>
                <div className="space-y-2">
                  <input
                    {...field}
                    ref={mediaRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => handleMediaChange(e.target.files)}
                    disabled={isPending}
                  />

                  {!value && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => mediaRef.current?.click()}
                      className="w-full"
                      size="sm"
                      disabled={isPending}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Media
                    </Button>
                  )}

                  {mediaPreview && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      {mediaPreview.type === "image" ? (
                        <Image
                          src={mediaPreview.url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={mediaPreview.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeMedia}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Entry"}
        </Button>
      </form>
    </Form>
  );
}
