import React from "react";
import { getAllBravos } from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BravoCard } from "@/components/bravo-card";

export const metadata = {
  title: "Bravos",
  description: "Bravos page",
};

const page = async () => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const bravos = await getAllBravos();
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
