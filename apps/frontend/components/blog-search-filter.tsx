"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const BlogSearchFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("query") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (searchValue.trim()) {
      params.set("query", searchValue.trim());
    } else {
      params.delete("query");
    }

    // Reset to page 1 when searching
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search blog posts by title or excerpt..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-7 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" size="sm" className="h-7">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BlogSearchFilter;
