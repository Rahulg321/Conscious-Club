import { getBravoBySlug } from "@/lib/queries";
import { BravoImage } from "@/components/bravo-card";
import Image from "next/image";

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
