import { getAllBravos, requireAdmin } from "@/lib/queries";
import AddBravoForm from "@/components/forms/add-bravo-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminBravoCard from "@/components/admin-bravo-card";
import React from "react";

export const metadata = {
  title: "Admin",
  description: "Admin page",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { type?: string | string[] };
}) {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  const session = await requireAdmin();
  const selectedType = searchParams?.type;
  const bravos = (await getAllBravos(selectedType)) ?? [];
  const types = ["All", "Boss", "Bestie", "Buzz", "Bold", "Brag"] as const;

  return (
    <div className="block-space big-container">
      <div>
        <Button asChild>
          <Link href="/admin/add-bravo">Add Bravo</Link>
        </Button>
      </div>

      <div className="mt-6 mb-2 flex flex-wrap items-center gap-2">
        {types.map((t) => {
          const isAll = t === "All";
          const isActive = isAll ? !selectedType : selectedType === t;
          const href = isAll ? "/admin" : `/admin?type=${t}`;
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

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bravos.length === 0 ? (
          <div className="col-span-full text-sm text-muted-foreground">
            No bravos yet.
          </div>
        ) : (
          bravos.map((b: any) => (
            <AdminBravoCard
              key={b.id}
              id={b.id}
              name={b.name}
              slug={b.slug}
              image={b.image}
              type={b.type}
            />
          ))
        )}
      </div>
    </div>
  );
}
