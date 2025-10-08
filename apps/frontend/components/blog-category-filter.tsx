"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, X } from "lucide-react";

interface BlogCategoryFilterProps {
  categories: Array<{ id: string; name: string; slug: string }>;
}

const BlogCategoryFilter = ({ categories }: BlogCategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategory === categorySlug) {
      // If clicking the same category, remove it
      params.delete("category");
    } else {
      // Otherwise, set the new category
      params.set("category", categorySlug);
    }

    // Reset to page 1 when changing filters
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FolderOpen className="h-4 w-4" />
            <span>Categories:</span>
          </div>

          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={clearCategory}
            className="h-8"
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory === category.slug ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleCategoryClick(category.slug)}
              className="h-8"
            >
              {category.name}
            </Button>
          ))}

          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCategory}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCategoryFilter;
