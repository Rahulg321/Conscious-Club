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
import ProjectUploadForm from "../forms/project-upload-form";
import useMediaQuery from "@/hooks/use-media-query";
import { Tags } from "@repo/db/schema";

export default function ProjectUploadDialog({ allTags }: { allTags: Tags[] }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Upload Project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ProjectUploadForm setDialogOpen={setOpen} allTags={allTags} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Upload Project</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Upload Project</DrawerTitle>
          <DrawerDescription>
            Make changes to your project here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProjectUploadForm setDialogOpen={setOpen} allTags={allTags} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
