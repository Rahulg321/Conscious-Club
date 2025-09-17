import TestimonialCard from "@/components/testimonial-card";

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "Capable has truly transformed my social networking experience. I've connected with like-minded people and discovered amazing opportunities. Highly recommended!",
  },
  {
    id: 2,
    name: "John Doe",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "The intuitive design and smart features of Capable made it easy to find meaningful connections. It's become my go-to app.",
  },
  {
    id: 3,
    name: "Emily Johnson",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "I love how Capable helps me stay in touch with friends and meet new people. The app is user-friendly and effective.",
  },
  {
    id: 4,
    name: "Michael Brown",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "With Capable, I've expanded my professional network and found great connections. The seamless interface makes socializing much easier.",
  },
  {
    id: 5,
    name: "David Wilson",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "Capable's features are fantastic for both meeting new people and staying connected with existing friends. It's a must-have app.",
  },
  {
    id: 6,
    name: "Laura Martinez",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "I'm amazed at how Capable's advanced privacy controls and customizable features have enhanced my online social experience. Truly innovative.",
  },
  {
    id: 7,
    name: "James Taylor",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "The community support and engaging multimedia sharing on Capable have made it my favorite platform for connecting and sharing.",
  },
  {
    id: 8,
    name: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    text: "Capable has revolutionized how I network professionally. The platform's intelligent matching system helps me connect with the right people effortlessly.",
  },
];

export default function TestimonialsSection() {
  return (
    <div className="container mx-auto px-4 block-space flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center mb-8">
        <h3 className="text-3xl font-bold text-center mb-2">Club Chatter</h3>
        <p className="text-lg text-muted-foreground text-center">
          The buzz from our creators & explorers
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              image={testimonial.image}
              rating={testimonial.rating}
              text={testimonial.text}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
