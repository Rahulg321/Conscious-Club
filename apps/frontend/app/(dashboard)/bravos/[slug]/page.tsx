import { getBravoBySlug } from "@/lib/queries";
import { BravoImage } from "@/components/bravo-card";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bravo = await getBravoBySlug(slug);

  if (!bravo) {
    return {
      title: "Bravo Not Found",
      description: "The requested bravo could not be found.",
    };
  }

  return {
    title: `${bravo.name} | Conscious Club`,
    description:
      bravo.description || `Discover ${bravo.name} on Conscious Club`,
    openGraph: {
      title: bravo.name,
      description:
        bravo.description || `Discover ${bravo.name} on Conscious Club`,
      images: bravo.image ? [{ url: bravo.image }] : [],
    },
  };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const bravo = await getBravoBySlug(slug);

  if (!bravo) {
    return <div>Bravo not found</div>;
  }

  return (
    <div className="block-space-mini big-container">
      <h1 className="text-4xl font-bold">{bravo.name}</h1>
      <p className="text-gray-600">{bravo?.description}</p>
      <Image src={bravo?.image} alt={bravo?.name} width={300} height={128} />
    </div>
  );
};

export default page;
