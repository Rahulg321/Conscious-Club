"use client";

import React, { useCallback, useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { FunnelX, Loader2 } from "lucide-react";
import { fields, filterMaping } from "./forms/onboarding/config";
import {
  Filters,
  type Filter,
  type FilterElement,
} from "@/components/ui/filters";

// const getAllRoles = (): string[] => {
//   return Object.values(DISCIPLINE_TO_ROLES).flat();
// };

const ProjectTagsFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<Filter[]>([]);

  const handleClearAll = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("tags");
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
      setFilters([]);
    });
  };

  const handleFiltersChange = useCallback((filters: Filter[]) => {
    startTransition(() => {
      let allFilters: unknown[] = [];
      filters.forEach((filter) => {
        allFilters = [...allFilters, ...filter.values];
      });
      const params = new URLSearchParams(searchParams);

      if (allFilters.length > 0) {
        params.set("tags", allFilters.join(","));
        replace(`${pathname}?${params.toString()}`);
      } else {
        params.delete("tags");
        replace(`${pathname}?${params.toString()}`);
      }
      setFilters(filters);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentTags = params.get("tags")?.split(",").filter(Boolean) || [];
    if (currentTags.length > 0 && filters.length === 0) {
      const filterList = filterMaping.filter((filter) =>
        currentTags.includes(filter.value)
      );

      let filterArray: FilterElement = [];

      filterList.forEach((filter) => {
        const findList = filterArray.find((f) => f.field === filter.name);

        if (findList) {
          const newList = filterArray.filter((f) => f.field !== filter.name);
          filterArray = [
            ...newList,
            {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              operator: "is_any_of",
              values: [...findList.values, filter.value],
              field: filter.name,
            },
          ];
        } else {
          filterArray = [
            ...filterArray,
            {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              operator: "is_any_of",
              values: [filter.value],
              field: filter.name,
            },
          ];
        }
      });
      setFilters(filterArray);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("isPending", isPending);
  }, [isPending]);

  useEffect(() => {
    console.log("isPending", isPending);
  }, [isPending]);

  return (
    <div
      className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-30"
      data-pending={isPending ? "" : undefined}
    >
      <div className="max-w-7xl mx-auto">
        {/* <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center text-sm text-muted-foreground">
              <FilterIcon className="h-4 w-4 mr-2" aria-hidden="true" />
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
        </div> */}

        {/* <div className="mt-2 -mx-1 overflow-x-auto scrollbar-hide">
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
        </div> */}
      </div>
      <div className="flex items-start gap-2.5 grow space-y-6 self-start content-start">
        <div className="flex-1 py-2">
          <Filters
            filters={filters}
            fields={fields}
            variant="outline"
            onChange={handleFiltersChange}
          />
        </div>
        {filters.length > 0 && (
          <Button
            variant="outline"
            className="text-destructive"
            onClick={() => handleClearAll()}
          >
            <FunnelX /> Clear
          </Button>
        )}
      </div>
      {isPending && (
        <span className="inline-flex items-center text-xs text-muted-foreground">
          <Loader2
            className="ml-2 h-3.5 w-3.5 animate-spin"
            aria-label="Loading"
          />
        </span>
      )}
    </div>
  );
};

export default ProjectTagsFilter;
