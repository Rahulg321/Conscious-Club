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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useMediaQuery from "@/hooks/use-media-query";
import BearSticker from "@/public/stickers/bear-sticker.png";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import Bravo1 from "@/public/bravos/Bravo1.jpg";
import Bravo2 from "@/public/bravos/Bravo2.jpg";
import Bravo3 from "@/public/bravos/Bravo3.jpg";
import Bravo10 from "@/public/bravos/Bravo10.jpg";
import Bravo11 from "@/public/bravos/Bravo11.jpg";
import Bravo19 from "@/public/bravos/Bravo19.jpg";
import Bravo27 from "@/public/bravos/Bravo27.jpg";
import Bravo35 from "@/public/bravos/Bravo35.jpg";
import Bravo42 from "@/public/bravos/Bravo42.jpg";
import Bravo44 from "@/public/bravos/Bravo44.jpg";
import Bravo45 from "@/public/bravos/Bravo45.jpg";
import Bravo48 from "@/public/bravos/Bravo48.jpg";
import Bravo51 from "@/public/bravos/Bravo51.jpg";
import Bravo52 from "@/public/bravos/Bravo52.jpg";
import Bravo57 from "@/public/bravos/Bravo57.jpg";
import { ScrollArea } from "@/components/ui/scroll-area";

const allBravos = [
  {
    id: 1,
    name: "Bravo 1",
    image: Bravo1,
  },
  {
    id: 2,
    name: "Bravo 2",
    image: Bravo2,
  },
  {
    id: 3,
    name: "Bravo 3",
    image: Bravo3,
  },
  {
    id: 4,
    name: "Bravo 10",
    image: Bravo10,
  },
  {
    id: 5,
    name: "Bravo 11",
    image: Bravo11,
  },
  {
    id: 6,
    name: "Bravo 19",
    image: Bravo19,
  },
  {
    id: 7,
    name: "Bravo 27",
    image: Bravo27,
  },
  {
    id: 8,
    name: "Bravo 35",
    image: Bravo35,
  },
  {
    id: 9,
    name: "Bravo 42",
    image: Bravo42,
  },
  {
    id: 10,
    name: "Bravo 44",
    image: Bravo44,
  },
  {
    id: 11,
    name: "Bravo 45",
    image: Bravo45,
  },
  {
    id: 12,
    name: "Bravo 48",
    image: Bravo48,
  },
  {
    id: 13,
    name: "Bravo 51",
    image: Bravo51,
  },
  {
    id: 14,
    name: "Bravo 52",
    image: Bravo52,
  },
  {
    id: 15,
    name: "Bravo 57",
    image: Bravo57,
  },
];

type BravoImageProps = {
  src: StaticImageData;
  alt: string;
  className?: string;
};

function BravoImage({ src, alt, className }: BravoImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("w-full h-32 object-cover grayscale opacity-70", className)}
    />
  );
}

export function BravoDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 flex-col">
            <Image src={BearSticker} alt="Bear Sticker" />
            <Button variant="link">
              Collect Bravos <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px] md:max-w-[640px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Bravo</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <DisplayBravo className="px-4" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Bravo</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Bravo</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <DisplayBravo className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DisplayBravo({ className }: { className: string }) {
  return (
    <ScrollArea
      className={cn("h-[500px] md:h-[600px] lg:h-[700px]", className)}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {allBravos.map((bravo) => (
          <div key={bravo.id} className="overflow-hidden rounded-md border">
            <BravoImage src={bravo.image} alt={bravo.name} />
            <div className="p-2 text-sm font-medium">{bravo.name}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
