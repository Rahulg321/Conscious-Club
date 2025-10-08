"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  blogPostSchema,
  type BlogPostSchemaType,
} from "@/lib/schemas/blog-posts-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  FileText,
  Settings,
  Image as ImageIcon,
  Eye,
  X,
  Upload,
} from "lucide-react";
import { adminAddBlogPost } from "@/lib/actions/blog-posts-actions";
import ReactMarkdown from "react-markdown";

interface AddBlogPostsFormProps {
  categories?: Array<{ id: string; name: string }> | null;
  tags?: Array<{ id: string; name: string }> | null;
}

const AddBlogPostsForm = ({ categories, tags }: AddBlogPostsFormProps) => {
  const router = useRouter();
  const [isSubmitting, startTransition] = React.useTransition();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [featuredImageFile, setFeaturedImageFile] = React.useState<File | null>(
    null
  );
  const [featuredImagePreview, setFeaturedImagePreview] = React.useState<
    string | null
  >(null);
  const featuredImageRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<BlogPostSchemaType>({
    resolver: zodResolver(blogPostSchema) as any,
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      featuredImage: "",
      featuredImageAlt: "",
      status: "draft" as const,
      isPublished: false,
      categoryId: "none",
      tagIds: [],
    },
  });

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (featuredImagePreview) URL.revokeObjectURL(featuredImagePreview);
    };
  }, [featuredImagePreview]);

  const onSubmit = async (values: BlogPostSchemaType) => {
    startTransition(async () => {
      try {
        let featuredImageUrl = values.featuredImage;

        // Upload featured image if a file was selected
        if (featuredImageFile) {
          const imageFormData = new FormData();
          imageFormData.append("image", featuredImageFile);

          const uploadResponse = await fetch("/api/upload-blog-image", {
            method: "POST",
            body: imageFormData,
          });

          if (!uploadResponse.ok) {
            toast.error("Failed to upload featured image");
            return;
          }

          const uploadResult = await uploadResponse.json();
          featuredImageUrl = uploadResult.url;
        }

        const response = await adminAddBlogPost({
          ...values,
          featuredImage: featuredImageUrl,
        });

        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);
        form.reset();
        setSelectedTags([]);
        setFeaturedImageFile(null);
        if (featuredImagePreview) URL.revokeObjectURL(featuredImagePreview);
        setFeaturedImagePreview(null);
        router.refresh();
      } catch (error) {
        console.error("Error adding blog post:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const handleTagToggle = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(updatedTags);
    form.setValue("tagIds", updatedTags);
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Blog Post
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="content"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Media & SEO
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6 mt-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your blog post title..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The main title of your blog post (max 200 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary of your blog post..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in listings (max 500
                        characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Content *</FormLabel>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Markdown Preview</DialogTitle>
                              <DialogDescription>
                                Preview of how your content will be rendered
                              </DialogDescription>
                            </DialogHeader>
                            <div className="prose prose-sm dark:prose-invert max-w-none p-4">
                              {field.value ? (
                                <ReactMarkdown>{field.value}</ReactMarkdown>
                              ) : (
                                <p className="text-muted-foreground italic">
                                  No content to preview. Start writing to see
                                  the preview.
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog post content here... (Markdown supported)"
                          className="min-h-[400px] resize-y font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The full content of your blog post. Markdown is
                        supported (min 50 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Media & SEO Tab */}
              <TabsContent value="media" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <div>
                    <FormLabel>Featured Image</FormLabel>
                    <FormDescription className="mb-3">
                      Upload an image or provide a URL
                    </FormDescription>
                    <div className="space-y-4">
                      <input
                        ref={featuredImageRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFeaturedImageFile(file);
                            const nextUrl = URL.createObjectURL(file);
                            if (featuredImagePreview)
                              URL.revokeObjectURL(featuredImagePreview);
                            setFeaturedImagePreview(nextUrl);
                            form.setValue("featuredImage", "");
                          }
                        }}
                      />

                      {!featuredImagePreview &&
                        !form.watch("featuredImage") && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => featuredImageRef.current?.click()}
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Featured Image
                          </Button>
                        )}

                      {featuredImagePreview && (
                        <div className="rounded-md border p-3">
                          <div className="relative mx-auto h-48">
                            <img
                              src={featuredImagePreview}
                              alt="Featured image preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                if (featuredImagePreview)
                                  URL.revokeObjectURL(featuredImagePreview);
                                setFeaturedImagePreview(null);
                                setFeaturedImageFile(null);
                                if (featuredImageRef.current)
                                  featuredImageRef.current.value = "";
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or provide a URL
                          </span>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="featuredImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                type="url"
                                {...field}
                                disabled={!!featuredImageFile}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="featuredImageAlt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe the image..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Alt text for accessibility
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO title for search engines..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Title that appears in search results (defaults to post
                        title)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description for search engines..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Description that appears in search results (max 500
                        characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="keyword1, keyword2, keyword3..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords for SEO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/original-post"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Original URL if this content was published elsewhere
                        first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories && categories.length > 0 ? (
                              <>
                                <SelectItem value="none">
                                  No category
                                </SelectItem>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </>
                            ) : (
                              <SelectItem value="none" disabled>
                                No categories available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a category for this post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Publish Post
                        </FormLabel>
                        <FormDescription>
                          Make this post visible to the public
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

                {tags && tags.length > 0 && (
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Tags</FormLabel>
                          <FormDescription>
                            Select tags to categorize your post
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {tags.map((tag) => (
                            <FormItem
                              key={tag.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={selectedTags.includes(tag.id)}
                                  onCheckedChange={() =>
                                    handleTagToggle(tag.id)
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {tag.name}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Post...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Blog Post
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBlogPostsForm;
