import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type BravoImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function BravoImage({ src, alt, className }: BravoImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={128}
      className={cn("w-full object-cover", className)}
      // placeholder="blur"
      // blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}

export function BravoCard({
  className,
  id,
  slug,
  name,
  imageUrl,
}: {
  className: string;
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
}) {
  return (
    <div key={id} className="overflow-hidden rounded-md border">
      <Link href={`/bravos/${slug}`}>
        <BravoImage src={imageUrl} alt={name} />
        <div className="p-2 text-sm font-medium">{name}</div>
      </Link>
    </div>
  );
}
