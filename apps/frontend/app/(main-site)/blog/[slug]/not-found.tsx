import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Post Not Found
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn't find the blog post you're looking for. It may have
          been removed, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/blog">
            <Button variant="default" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
