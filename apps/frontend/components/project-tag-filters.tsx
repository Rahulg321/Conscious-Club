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
      className="bg-white border-b border-gray-200 px-4 sm:px-6 py-1 sticky top-0 z-30"
      data-pending={isPending ? "" : undefined}
    >
      <div className="max-w-7xl mx-auto"></div>
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
