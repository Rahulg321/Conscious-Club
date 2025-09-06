"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  bannerUploadSchema,
  BannerUploadSchemaType,
} from "@/lib/schemas/banner-upload-schema";
import { useRouter } from "next/navigation";

const BannerUploadForm = () => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, startUploadTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<BannerUploadSchemaType>({
    resolver: zodResolver(bannerUploadSchema),
    defaultValues: {
      banner: undefined,
    },
  });

  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // Clear preview if no file
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  // Clean up preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = async (values: BannerUploadSchemaType) => {
    startUploadTransition(async () => {
      try {
        if (!values.banner) {
          toast.error("Please upload a banner");
          return;
        }

        const formData = new FormData();
        formData.append("banner", values.banner);

        const response = await fetch("/api/upload-user-banner", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Failed to upload banner");
          return;
        }

        const result = await response.json();
        console.log("Banner file:", result);

        toast.success("Banner uploaded successfully!");
        console.log("Banner file:", values.banner);
        form.reset();
        setPreviewUrl(null);
        router.refresh();
      } catch (error) {
        toast.error("Failed to upload banner. Please try again.");
        console.error("Upload error:", error);
      }
    });
  };

  const removeFile = () => {
    form.setValue("banner", undefined);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="banner"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!previewUrl ? (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => fileRef.current?.click()}
                        >
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG, WebP up to 5MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Banner preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <input
                        {...field}
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                          handleFileChange(file);
                        }}
                      />
                      {!previewUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a banner image for your profile. Recommended size:
                    1200x300px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewUrl && (
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  "Upload Banner"
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BannerUploadForm;
