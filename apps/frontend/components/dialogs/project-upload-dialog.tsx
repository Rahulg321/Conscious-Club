"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import ProjectUploadForm from "../forms/project-upload-form";
import useMediaQuery from "@/hooks/use-media-query";
import { Plus } from "lucide-react";
import { Session } from "next-auth";

export default function ProjectUploadDialog({
  userSession,
}: {
  userSession: Session;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="overflow-hidden">
          <div className="relative overflow-hidden">
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-indigo-500 border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600"
              >
                <Plus className="w-4 h-4 " />
                Add new creation
              </Button>
            </DialogTrigger>
            <DialogContent className="">
              <ScrollArea className="max-h-[600px] pr-4">
                <ProjectUploadForm
                  setDialogOpen={setOpen}
                  userSession={userSession}
                />
              </ScrollArea>
            </DialogContent>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-indigo-500 border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600"
        >
          <Plus className="w-4 h-4 " />
          Add new creation
        </Button>
      </DialogTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Upload Project</DrawerTitle>
          <DrawerDescription>
            Make changes to your project here.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[500px] px-4">
          <ProjectUploadForm
            setDialogOpen={setOpen}
            userSession={userSession}
          />
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
