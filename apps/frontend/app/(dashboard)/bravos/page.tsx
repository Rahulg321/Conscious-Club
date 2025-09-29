import React from "react";
import { getAllBravos } from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BravoCard } from "@/components/bravo-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Bravos",
  description: "Bravos page",
};

const page = async ({
  searchParams,
}: {
  searchParams: { type?: string | string[] };
}) => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const selectedType = searchParams?.type;
  const bravos = await getAllBravos(selectedType);
  const types = ["All", "Boss", "Bestie", "Buzz", "Bold", "Brag"] as const;
  return (
    <div className="block-space-mini big-container">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">Bravos</h1>
        <p className="text-gray-600">
          Bravos are the best way to show your support for your favorite
          projects. You can collect bravos by completing tasks, projects, and
          more.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {types.map((t) => {
          const isAll = t === "All";
          const isActive = isAll ? !selectedType : selectedType === t;
          const href = isAll ? "/bravos" : `/bravos?type=${t}`;
          return (
            <Button
              key={t}
              size="sm"
              variant={isActive ? "default" : "outline"}
              asChild
            >
              <Link href={href}>{t}</Link>
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bravos?.map((bravo) => (
          <BravoCard
            className="w-full"
            key={bravo.id}
            id={bravo.id}
            slug={bravo.slug}
            name={bravo.name}
            imageUrl={bravo.image}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
