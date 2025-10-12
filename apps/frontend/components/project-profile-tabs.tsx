"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectProfileTabs = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get the current type filter from search params, default to "projects"
  const currentType = searchParams.get("type") || "projects";

  const handleTabChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (value === "projects") {
        params.delete("type"); // Remove type param for projects (default)
      } else {
        params.set("type", value);
      }

      // Reset to page 1 when changing type
      params.set("page", "1");

      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Tabs value={currentType} onValueChange={handleTabChange} className="">
      <TabsList>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="mashups">Mashups</TabsTrigger>
        <TabsTrigger value="profiles">Profiles</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProjectProfileTabs;
