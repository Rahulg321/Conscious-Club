"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";

interface BlogTagFilterProps {
  tags: Array<{ id: string; name: string; slug: string }>;
}

const BlogTagFilter = ({ tags }: BlogTagFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTagsParam = searchParams.get("tags");

  const selectedTags = selectedTagsParam
    ? selectedTagsParam.split(",").filter(Boolean)
    : [];

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams);
    let newTags: string[];

    if (selectedTags.includes(tagSlug)) {
      // Remove tag if already selected
      newTags = selectedTags.filter((t) => t !== tagSlug);
    } else {
      // Add tag if not selected
      newTags = [...selectedTags, tagSlug];
    }

    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }

    // Reset to page 1 when changing filters
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const clearAllTags = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("tags");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4" />
            <span>Tags:</span>
          </div>

          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTags.includes(tag.slug) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagClick(tag.slug)}
              className="h-8"
            >
              {tag.name}
              {selectedTags.includes(tag.slug) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Button>
          ))}

          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllTags}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All ({selectedTags.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTagFilter;
