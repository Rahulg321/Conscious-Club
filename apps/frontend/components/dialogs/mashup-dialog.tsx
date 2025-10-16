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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import ProjectUploadForm from "../forms/project-upload-form";
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
  const [showUploadForm, setShowUploadForm] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleYes = () => {
    setShowUploadForm(true);
  };

  const handleNo = () => {
    setOpen(false);
    setShowUploadForm(false);
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form state when dialog closes
      setShowUploadForm(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mashup</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent
          className={showUploadForm ? "sm:max-w-[700px]" : "sm:max-w-[425px]"}
        >
          <DialogHeader>
            <DialogTitle>
              {showUploadForm ? "Upload Mashup Project" : "Mashup Project"}
            </DialogTitle>
            {!showUploadForm && (
              <DialogDescription>
                Do you wish to mashup collaborate with{" "}
                {collaboratorName || "this user"} on a project together?
              </DialogDescription>
            )}
          </DialogHeader>
          {showUploadForm ? (
            <ScrollArea className="max-h-[600px] pr-4">
              <ProjectUploadForm
                setDialogOpen={setOpen}
                isMashup={true}
                collaboratorId={collaboratorId}
                userSession={userSession}
              />
            </ScrollArea>
          ) : (
            <div className="flex gap-4 pt-4">
              <Button onClick={handleYes} className="flex-1">
                Yes
              </Button>
              <Button onClick={handleNo} variant="outline" className="flex-1">
                No
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shuffle className="h-4 w-4" />
          <span>Mashup</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {showUploadForm ? "Upload Mashup Project" : "Mashup Project"}
          </DrawerTitle>
          {!showUploadForm && (
            <DrawerDescription>
              Do you wish to mashup collaborate with{" "}
              {collaboratorName || "this user"} on a project together?
            </DrawerDescription>
          )}
        </DrawerHeader>
        {showUploadForm ? (
          <ScrollArea className="max-h-[500px] px-4">
            <ProjectUploadForm
              setDialogOpen={setOpen}
              isMashup={true}
              collaboratorId={collaboratorId}
              userSession={userSession}
            />
          </ScrollArea>
        ) : (
          <div className="flex gap-4 px-4 pb-4">
            <Button onClick={handleYes} className="flex-1">
              Yes
            </Button>
            <Button onClick={handleNo} variant="outline" className="flex-1">
              No
            </Button>
          </div>
        )}
        {!showUploadForm && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
