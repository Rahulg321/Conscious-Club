import React from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const GetHired = () => {
  return (
    <div>
      <nav className="flex justify-center pt-8 pb-16">
        <div className="flex items-center gap-8">
          <button className="text-foreground font-medium text-sm tracking-wide">
            HIRE
          </button>
          <button className="text-muted-foreground font-medium text-sm tracking-wide">
            GET HIRED
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold text-foreground mb-8 text-balance">
          A new way to work
        </h1>

        <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto text-balance">
          Discover, connect, and work with the world's best independent
          creatives and clients.
        </p>

        {/* Search Section */}
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="What do you need help with?"
              className="pl-12 py-6 text-lg border-input bg-background"
            />
          </div>
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Browse 1M+ independents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetHired;
