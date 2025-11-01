"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChallengeEntryForm } from "@/components/forms/challenge-entry-form";
import useMediaQuery from "@/hooks/use-media-query";
import { Plus } from "lucide-react";

interface ChallengeEntryDialogProps {
  challengeId: string;
  userHasEntry: boolean;
  isDeadlinePassed: boolean;
  isChallengeActive: boolean;
}

export function ChallengeEntryDialog({
  challengeId,
  userHasEntry,
  isDeadlinePassed,
  isChallengeActive,
}: ChallengeEntryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const canSubmit = !userHasEntry && !isDeadlinePassed && isChallengeActive;

  if (!canSubmit) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit Entry
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Challenge Entry</DialogTitle>
            <DialogDescription>
              Share your creativity and participate in this challenge
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] pr-4">
            <ChallengeEntryForm challengeId={challengeId} setDialogOpen={setOpen} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Submit Entry
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Submit Challenge Entry</DrawerTitle>
          <DrawerDescription>
            Share your creativity and participate in this challenge
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[500px] px-4">
          <ChallengeEntryForm challengeId={challengeId} setDialogOpen={setOpen} />
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

