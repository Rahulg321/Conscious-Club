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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  bravoUploadSchema,
  BravoUploadSchemaType,
} from "@/lib/schemas/bravo-upload-schema";
import { useRouter } from "next/navigation";

const AddBravoForm = () => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, startUploadTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<BravoUploadSchemaType>({
    resolver: zodResolver(bravoUploadSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      type: undefined,
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

  const onSubmit = async (values: BravoUploadSchemaType) => {
    startUploadTransition(async () => {
      try {
        if (!values.image) {
          toast.error("Please upload an image");
          return;
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("type", values.type);
        formData.append("image", values.image);

        const response = await fetch("/api/upload-bravo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Failed to upload bravo");
          return;
        }

        const result = await response.json();
        console.log("Bravo uploaded:", result);

        toast.success("Bravo uploaded successfully!");
        form.reset();
        setPreviewUrl(null);
        router.refresh();
      } catch (error) {
        toast.error("Failed to upload bravo. Please try again.");
        console.error("Upload error:", error);
      }
    });
  };

  const removeFile = () => {
    form.setValue("image", undefined as any);
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
        <CardTitle>Add New Bravo</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bravo name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the bravo (max 64 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bravo Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bravo type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Boss">Boss</SelectItem>
                        <SelectItem value="Bestie">Bestie</SelectItem>
                        <SelectItem value="Buzz">Buzz</SelectItem>
                        <SelectItem value="Bold">Bold</SelectItem>
                        <SelectItem value="Brag">Brag</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the type of bravo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter bravo description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what this bravo represents
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Bravo Image</FormLabel>
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
                            alt="Bravo preview"
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
                          Choose Image
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image for the bravo. Recommended size: 400x400px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Bravo...
                </div>
              ) : (
                "Upload Bravo"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBravoForm;
