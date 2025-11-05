"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function ProjectDedicationFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const dedicatedToPersonRef = useRef<HTMLInputElement>(null);
  const dedicatedToBrandRef = useRef<HTMLInputElement>(null);
  const dedicatedToCauseRef = useRef<HTMLInputElement>(null);
  const dedicationReasonRef = useRef<HTMLInputElement>(null);

  const dedicatedToPerson = searchParams.get("dedicatedToPerson")?.toString() || "";
  const dedicatedToBrand = searchParams.get("dedicatedToBrand")?.toString() || "";
  const dedicatedToCause = searchParams.get("dedicatedToCause")?.toString() || "";
  const dedicationReason = searchParams.get("dedicationReason")?.toString() || "";

  const updateParam = useDebouncedCallback(
    (key: string, value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        if (value.trim()) {
          params.set(key, value.trim());
        } else {
          params.delete(key);
        }
        params.set("page", "1"); // Reset to first page when filter changes
        replace(`${pathname}?${params.toString()}`);
      });
    },
    300
  );

  const handleDedicatedToPersonChange = (value: string) => {
    updateParam("dedicatedToPerson", value);
  };

  const handleDedicatedToBrandChange = (value: string) => {
    updateParam("dedicatedToBrand", value);
  };

  const handleDedicatedToCauseChange = (value: string) => {
    updateParam("dedicatedToCause", value);
  };

  const handleDedicationReasonChange = (value: string) => {
    updateParam("dedicationReason", value);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="dedicatedToPerson" className="text-xs text-muted-foreground mb-1 block">
              Dedicated to Person
            </Label>
            <div className="relative">
              {isPending && (
                <Loader2 className="absolute right-2 top-2.5 h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              <Input
                id="dedicatedToPerson"
                ref={dedicatedToPersonRef}
                placeholder="Search by person name..."
                defaultValue={dedicatedToPerson}
                onChange={(e) => handleDedicatedToPersonChange(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="dedicatedToBrand" className="text-xs text-muted-foreground mb-1 block">
              Dedicated to Brand
            </Label>
            <div className="relative">
              {isPending && (
                <Loader2 className="absolute right-2 top-2.5 h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              <Input
                id="dedicatedToBrand"
                ref={dedicatedToBrandRef}
                placeholder="Search by brand name..."
                defaultValue={dedicatedToBrand}
                onChange={(e) => handleDedicatedToBrandChange(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="dedicatedToCause" className="text-xs text-muted-foreground mb-1 block">
              Dedicated to Cause
            </Label>
            <div className="relative">
              {isPending && (
                <Loader2 className="absolute right-2 top-2.5 h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              <Input
                id="dedicatedToCause"
                ref={dedicatedToCauseRef}
                placeholder="Search by cause name..."
                defaultValue={dedicatedToCause}
                onChange={(e) => handleDedicatedToCauseChange(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="dedicationReason" className="text-xs text-muted-foreground mb-1 block">
              Dedication Reason
            </Label>
            <div className="relative">
              {isPending && (
                <Loader2 className="absolute right-2 top-2.5 h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              <Input
                id="dedicationReason"
                ref={dedicationReasonRef}
                placeholder="Search by reason..."
                defaultValue={dedicationReason}
                onChange={(e) => handleDedicationReasonChange(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

