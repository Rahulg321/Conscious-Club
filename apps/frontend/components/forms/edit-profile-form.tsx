"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  editProfileSchema,
  type EditProfileSchemaType,
} from "@/lib/schemas/edit-profile-schema";
import { EditUserProfile } from "@/lib/actions/edit-profile";
import { Loader2 } from "lucide-react";

function EditProfileForm({
  className,
  userId,
  name,
  bio,
  location,
  setDialogOpen,
}: {
  className?: string;
  userId: string;
  name?: string;
  bio?: string;
  location?: string;
  setDialogOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: name || "",
      bio: bio || "",
      location: location || "",
    },
  });

  const onSubmit = async (values: EditProfileSchemaType) => {
    startTransition(async () => {
      try {
        const response = await EditUserProfile(values);

        if (!response.success) {
          toast.error(response.message || "Failed to update profile");
          return;
        }

        toast.success("Profile updated successfully");
        setDialogOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="A short bio about you" {...field} />
              </FormControl>
              <FormDescription>Max 280 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              Saving...
            </div>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default EditProfileForm;
