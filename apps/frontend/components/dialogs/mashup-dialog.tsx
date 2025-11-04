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
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Shuffle } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import MashupProjectUploadForm from "../forms/mashup-project-upload-form";
import { Session } from "next-auth";

export default function MashupDialog({
  collaboratorId,
  collaboratorName,
  userSession,
}: {
  collaboratorId: string;
  collaboratorName?: string;
  userSession: Session;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Shuffle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>
              Upload Mashup Project
              {collaboratorName ? ` with ${collaboratorName}` : ""}
            </DialogTitle>
            <DialogDescription>
              Create a collaborative project together
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] overflow-y-auto pr-4">
            <MashupProjectUploadForm
              setDialogOpen={setOpen}
              collaboratorId={collaboratorId}
              userSession={userSession}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shuffle className="h-4 w-4" />
          <span>Mashup</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            Upload Mashup Project
            {collaboratorName ? ` with ${collaboratorName}` : ""}
          </DrawerTitle>
          <DrawerDescription>
            Create a collaborative project together
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[500px] overflow-y-auto px-4">
          <MashupProjectUploadForm
            setDialogOpen={setOpen}
            collaboratorId={collaboratorId}
            userSession={userSession}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
