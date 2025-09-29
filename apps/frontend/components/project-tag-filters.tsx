"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Filter, Loader2 } from "lucide-react";
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
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
              Tags
            </span>
            <span className="text-xs text-foreground/70 bg-accent px-2 py-0.5 rounded-full whitespace-nowrap">
              {selectedTags.length} selected
            </span>
            {isPending && (
              <span className="inline-flex items-center text-xs text-muted-foreground">
                <Loader2
                  className="ml-2 h-3.5 w-3.5 animate-spin"
                  aria-label="Loading"
                />
              </span>
            )}
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              disabled={isPending}
              aria-label="Clear all selected tags"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="mt-2 -mx-1 overflow-x-auto scrollbar-hide">
          <div className="px-1 flex items-center gap-2">
            {filterTags?.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <Button
                  key={tag.id}
                  variant={isSelected ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`rounded-full px-3 py-1 h-8 whitespace-nowrap flex-shrink-0 transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary"
                      : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-accent"
                  }`}
                  disabled={isPending}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${tag.name}`}
                >
                  {tag.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTagsFilter;
