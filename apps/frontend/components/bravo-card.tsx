"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { pinBravo } from "@/lib/actions/pin-bravo-action";
import { toast } from "sonner";
import { useTransition } from "react";
import GlowingEffectComponent from "./ui/glowing-effect";

type BravoCardProps = {
  className: string;
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  bravoCategory: string;
  isPinned: boolean;
};

type BravoImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function BravoImage({ src, alt, className }: BravoImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={128}
      className={cn("w-full object-cover rounded-2xl", className)}
      // placeholder="blur"
      // blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}

type PinBravoDialogProps = {
  onPin: () => void;
  isPinned: boolean;
};

function PinBravoDialog({ onPin, isPinned }: PinBravoDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 bg-white/90",
            isPinned && "bg-green-100 border-green-300"
          )}
        >
          <Pin
            className={cn(
              "h-4 w-4",
              isPinned && "fill-green-600 text-green-600"
            )}
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pin Bravo to Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Do you wish to pin this bravo to your profile? This will make it
            visible on your profile page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onPin}>Yes, Pin It</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function BravoCard({
  className,
  id,
  slug,
  name,
  imageUrl,
  bravoCategory,
  isPinned,
}: BravoCardProps) {
  const [isPending, startTransition] = useTransition();

  const handlePinBravo = () => {
    if (!id) return;
    startTransition(async () => {
      const response = await pinBravo(id);
      if (response.success) {
        toast.success(
          (response.success as string) || "Bravo pinned successfully"
        );
      } else {
        toast.error((response.error as string) || "Failed to pin bravo");
      }
    });
  };
  // <div
  //   key={id}
  //   className={cn("overflow-hidden rounded-md border relative", {
  //     "border-blue-500": bravoCategory === "mood",
  //     "border-green-200 border-2": bravoCategory === "Flex Bravos",
  //   })}
  // >
  return (
    <div
      key={id}
      className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3"
    >
      <GlowingEffectComponent
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      {bravoCategory === "Flex Bravos" && (
        <div className="absolute top-2 right-2 z-10">
          <PinBravoDialog onPin={handlePinBravo} isPinned={isPinned} />
        </div>
      )}
      <Link href={`/bravos/${slug}`}>
        <BravoImage src={imageUrl} alt={name} />
        <div className="p-2 text-sm font-medium">{name}</div>
      </Link>
    </div>
  );
}
