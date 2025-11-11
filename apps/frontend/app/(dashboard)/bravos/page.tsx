import React from "react";
import {
  getAllBravos,
  getAllBravoCategories,
  getUserPinnedBravoImage,
} from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BravoCard } from "@/components/bravo-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuroraBackground } from "@/components/aura-bg";

export const metadata = {
  title: "Bravos | ConsciousClub",
  description:
    "Discover and collect Bravos to show your support for your favorite projects and creators. Earn Bravos by completing tasks, participating in projects, and more on ConsciousClub.",
  openGraph: {
    title: "Bravos | ConsciousClub",
    description:
      "Collect Bravos to support projects and creators. Explore all available Bravos and categories on ConsciousClub.",
    url: "/bravos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bravos | ConsciousClub",
    description:
      "Show your support for projects and creators by collecting Bravos on ConsciousClub.",
  },
};

const page = async ({
  searchParams,
}: {
  searchParams: { category?: string | string[] };
}) => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const selectedCategory = searchParams?.category;
  const bravos = await getAllBravos(selectedCategory);
  const categories = await getAllBravoCategories();
  const pinnedBravo = await getUserPinnedBravoImage(userSession.user.id);

  // Find the selected category object to get its description
  const selectedCategoryObj = categories?.find(
    (category) => category.slug === selectedCategory
  );

  return (
    <AuroraBackground>
      <div className="block-space-mini px-4 h-full min-h-screen">
        {/* <div className="block-space-mini bg-gradient-to-br px-4 from-indigo-100 to-purple-100 h-full min-h-screen"> */}

        <div className="mb-4  space-y-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 z-50">
            <Button
              size="sm"
              variant={!selectedCategory ? "default" : "outline"}
              asChild
            >
              <Link href="/bravos">All</Link>
            </Button>
            {categories?.map((category) => {
              const isActive = selectedCategory === category.slug;
              const href = `/bravos?category=${category.slug}`;
              return (
                <Button
                  key={category.id}
                  size="sm"
                  className="cursor-pointer z-100"
                  variant={isActive ? "default" : "outline"}
                  asChild
                >
                  <Link href={href}>{category.name}</Link>
                </Button>
              );
            })}
          </div>
          {/* <h1 className="text-4xl font-bold">
          {categories?.find((category) => category.slug === selectedCategory)
            ?.name || ""}
        </h1> */}
          <div className="text-gray-600 font-caveat text-3xl w-full">
            {selectedCategory && selectedCategoryObj
              ? selectedCategoryObj.description
              : "Bravos are CC's currency for celebration and achievement. There are 2 Types: Flex Bravos & Buzz Bravos."}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bravos?.map((bravo) => (
            <BravoCard
              className="w-full"
              key={bravo.id}
              id={bravo.id}
              slug={bravo.slug}
              name={bravo.name}
              imageUrl={bravo.image}
              bravoCategory={bravo.categoryName || ""}
              isPinned={pinnedBravo?.name === bravo.name}
            />
          ))}
        </div>
      </div>
    </AuroraBackground>
  );
};

export default page;
