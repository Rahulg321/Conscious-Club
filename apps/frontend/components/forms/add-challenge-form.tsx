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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { challengeUploadSchema } from "@/lib/schemas/challenge-upload-schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const AddChallengeForm = () => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, startUploadTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(challengeUploadSchema),
    defaultValues: {
      name: "",
      description: "",
      bannerImage: undefined,
      deadline: "",
      reward: "",
      prizePool: "",
      isActive: true,
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

  const onSubmit = async (values: z.infer<typeof challengeUploadSchema>) => {
    startUploadTransition(async () => {
      try {
        if (!values.bannerImage) {
          toast.error("Please upload a banner image");
          return;
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("deadline", values.deadline);
        formData.append("reward", values.reward || "");
        formData.append("prizePool", values.prizePool || "0");
        formData.append("isActive", String(values.isActive));
        formData.append("bannerImage", values.bannerImage);

        const response = await fetch("/api/upload-challenge", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.error || "Failed to upload challenge");
          return;
        }

        const result = await response.json();
        console.log("Challenge uploaded:", result);

        toast.success("Challenge uploaded successfully!");
        form.reset();
        setPreviewUrl(null);
        router.push("/admin/challenges");
        router.refresh();
      } catch (error) {
        toast.error("Failed to upload challenge. Please try again.");
        console.error("Upload error:", error);
      }
    });
  };

  const removeFile = () => {
    form.setValue("bannerImage", undefined as any);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Challenge</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter challenge name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the challenge (max 64 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter challenge description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what this challenge is about
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      When does this challenge end?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prizePool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prize Pool</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Total prize pool amount (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter reward description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What do participants win? (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Make this challenge visible to users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerImage"
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
                            PNG, JPG, JPEG, WebP up to 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Challenge banner preview"
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
                          Choose Banner Image
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a banner image for the challenge. Recommended size:
                    1200x400px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Challenge...
                </div>
              ) : (
                "Upload Challenge"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddChallengeForm;
