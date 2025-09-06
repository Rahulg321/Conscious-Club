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
  profilePicUploadSchema,
  ProfilePicUploadSchemaType,
} from "@/lib/schemas/profile-pic-upload-schema";
import { useRouter } from "next/navigation";

const ProfilePicUploadForm = () => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, startUploadTransition] = React.useTransition();

  const router = useRouter();

  const form = useForm<ProfilePicUploadSchemaType>({
    resolver: zodResolver(profilePicUploadSchema),
    defaultValues: {
      profilePic: undefined,
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

  const onSubmit = async (values: ProfilePicUploadSchemaType) => {
    startUploadTransition(async () => {
      try {
        if (!values.profilePic) {
          toast.error("Please upload a profile picture");
          return;
        }

        const formData = new FormData();
        formData.append("profilePic", values.profilePic);

        const response = await fetch("/api/upload-profile-pic", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Failed to upload profile picture");
          return;
        }

        const result = await response.json();
        console.log("Profile pic file:", result);

        toast.success("Profile picture uploaded successfully!");

        form.reset();
        setPreviewUrl(null);
        router.refresh();
      } catch (error) {
        toast.error("Failed to upload profile picture. Please try again.");
        console.error("Upload error:", error);
      }
    });
  };

  const removeFile = () => {
    form.setValue("profilePic", undefined);
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
              name="profilePic"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!previewUrl ? (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-full p-8 text-center hover:border-gray-400 transition-colors cursor-pointer w-32 h-32 mx-auto flex flex-col items-center justify-center"
                          onClick={() => fileRef.current?.click()}
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-xs text-gray-600 text-center">
                            Upload
                          </p>
                        </div>
                      ) : (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={previewUrl}
                            alt="Profile picture preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={removeFile}
                          >
                            <X className="h-3 w-3" />
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
                    Upload a profile picture. Recommended size: 400x400px
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
                  "Upload Profile Picture"
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfilePicUploadForm;
