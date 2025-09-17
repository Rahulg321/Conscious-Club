import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImQuotesRight } from "react-icons/im";

export type Testimonial = {
  id?: number;
  name: string;
  image?: string | null;
  rating: number;
  text: string;
};

export default function TestimonialCard({
  name,
  image,
  rating,
  text,
}: Testimonial) {
  return (
    <Card className="relative bg-[radial-gradient(circle,_rgba(0,0,0,0.08)_1.2px,_transparent_1.2px)] bg-[length:12px_12px] bg-repeat rounded-2xl p-6 bg-[#F8FAFC] border border-[#dee5ed] shadow-sm hover:shadow-md transition-shadow">
      {/* Top blur gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute top-4 right-4">
        <ImQuotesRight className="w-6 h-6 text-black " />
      </div>

      <div className="flex border-b border-[#dee5ed] pb-4 items-center gap-3 mb-4">
        <Avatar className="size-12">
          <AvatarImage
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-[#1d1d1d] text-base">{name}</h3>
          <div className="flex gap-1 mt-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#ffd029] text-[#ffd029]" />
            ))}
          </div>
        </div>
      </div>

      <div className="">
        <p className="text-[#333333] text-sm leading-relaxed">{text}</p>
      </div>
    </Card>
  );
}
