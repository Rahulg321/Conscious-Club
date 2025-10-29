"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Filter, Loader2 } from "lucide-react";
import { DISCIPLINE_TO_ROLES } from "./forms/onboarding/config";

// Extract all unique roles from DISCIPLINE_TO_ROLES
const getAllRoles = (): string[] => {
  return Object.values(DISCIPLINE_TO_ROLES).flat();
};

const ProjectTagsFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get all available roles
  const allRoles = useMemo(() => getAllRoles(), []);

  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];

  const handleTagToggle = (roleName: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      const currentTags = params.get("tags")?.split(",").filter(Boolean) || [];

      let newTags;
      if (currentTags.includes(roleName)) {
        // Remove tag if already selected
        newTags = currentTags.filter((name) => name !== roleName);
      } else {
        // Add tag if not selected
        newTags = [...currentTags, roleName];
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
            {allRoles.map((roleName) => {
              const isSelected = selectedTags.includes(roleName);
              return (
                <Button
                  key={roleName}
                  variant={isSelected ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(roleName)}
                  className={`rounded-full px-3 py-1 h-8 whitespace-nowrap flex-shrink-0 transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary"
                      : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-accent"
                  }`}
                  disabled={isPending}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${roleName}`}
                >
                  {roleName}
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
