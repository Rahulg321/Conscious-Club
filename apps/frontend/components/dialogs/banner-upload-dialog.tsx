"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
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
import useMediaQuery from "@/hooks/use-media-query";
import { Camera } from "lucide-react";
import BannerUploadForm from "../forms/banner-upload-form";

export default function BannerUploadDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-8 h-8 md:w-10 md:h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors">
            <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Banner</DialogTitle>
            <DialogDescription>
              Make changes to your banner here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <BannerUploadForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="w-8 h-8 md:w-10 md:h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors">
          <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Upload Banner</DrawerTitle>
          <DrawerDescription>
            Make changes to your banner here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <BannerUploadForm />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
