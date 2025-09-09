"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Filter, X, Loader2 } from "lucide-react";
import { Tags } from "@repo/db/schema";

const ProjectTagsFilter = ({ filterTags }: { filterTags: Tags[] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];

  const handleTagToggle = (tagId: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      const currentTags = params.get("tags")?.split(",").filter(Boolean) || [];

      let newTags;
      if (currentTags.includes(tagId)) {
        // Remove tag if already selected
        newTags = currentTags.filter((id) => id !== tagId);
      } else {
        // Add tag if not selected
        newTags = [...currentTags, tagId];
      }

      if (newTags.length > 0) {
        params.set("tags", newTags.join(","));
      } else {
        params.delete("tags");
      }

      // Reset to page 1 when filtering
      params.set("page", "1");

      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("tags");
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {isPending && (
            <div className=" animate-spin">
              <Loader2 className="size-4" />
            </div>
          )}

          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 flex-shrink-0"
              disabled={isPending}
            >
              Clear All
            </Button>
          )}

          {filterTags?.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <Button
                key={tag.id}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTagToggle(tag.id)}
                className={`whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                disabled={isPending}
              >
                {tag.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTagsFilter;
