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
import {
  challengeUpdateSchema,
  ChallengeUpdateSchemaType,
} from "@/lib/schemas/challenge-upload-schema";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Challenges } from "@repo/db/schema";

interface EditChallengeFormProps {
  challenge: Challenges;
}

const EditChallengeForm = ({ challenge }: EditChallengeFormProps) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    challenge.bannerImage
  );
  const [isUploading, startUploadTransition] = React.useTransition();
  const router = useRouter();

  // Format deadline for datetime-local input
  const formatDateForInput = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const form = useForm<ChallengeUpdateSchemaType>({
    resolver: zodResolver(challengeUpdateSchema),
    defaultValues: {
      name: challenge.name,
      description: challenge.description || "",
      bannerImage: undefined,
      deadline: formatDateForInput(challenge.deadline),
      reward: challenge.reward || "",
      prizePool: challenge.prizePool ? String(challenge.prizePool) : "",
      isActive: challenge.isActive,
    },
  });

  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // Revert to original image
      setPreviewUrl(challenge.bannerImage);
    }
  };

  // Clean up preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== challenge.bannerImage) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, challenge.bannerImage]);

  const onSubmit = async (values: ChallengeUpdateSchemaType) => {
    startUploadTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("deadline", values.deadline);
        formData.append("reward", values.reward || "");
        formData.append(
          "prizePool",
          String(values.prizePool ? Number(values.prizePool) : 0)
        );
        formData.append("isActive", String(values.isActive));

        // Only append image if a new one was selected
        if (values.bannerImage) {
          formData.append("bannerImage", values.bannerImage);
        }

        const response = await fetch(`/api/challenges/${challenge.id}`, {
          method: "PATCH",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.error || "Failed to update challenge");
          return;
        }

        const result = await response.json();
        console.log("Challenge updated:", result);

        toast.success("Challenge updated successfully!");
        router.push(`/admin/challenges/${challenge.id}`);
        router.refresh();
      } catch (error) {
        toast.error("Failed to update challenge. Please try again.");
        console.error("Update error:", error);
      }
    });
  };

  const removeFile = () => {
    form.setValue("bannerImage", undefined as any);
    setPreviewUrl(challenge.bannerImage);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Challenge</CardTitle>
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
                      {previewUrl ? (
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
                      ) : (
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
                      {previewUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change Banner Image
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a new banner image for the challenge (optional).
                    Recommended size: 1200x400px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Challenge...
                </div>
              ) : (
                "Update Challenge"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditChallengeForm;
