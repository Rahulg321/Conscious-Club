import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Who can be an explorer on CC?",
    answer:
      "Doesn't matter if you're into matcha, checkered boxers, K-dramas, Marvel, or cat memes. If you love trying trends before they're cool, you belong here. (p.s. if shopping is your guilty pleasure - congrats, you qualify.)",
  },
  {
    question: "Do I need to be a professional creator to join?",
    answer:
      "Not at all! We welcome creators of all levels, from beginners to professionals. What matters most is your passion for creating and exploring new trends.",
  },
  {
    question: "What do I get as an explorer?",
    answer:
      "As an explorer, you'll get early access to trending products, exclusive rewards, opportunities to collaborate with brands, and a community of like-minded creators to connect with.",
  },
  {
    question: "Is there a cost to join?",
    answer:
      "Joining CC is completely free! There are no membership fees or hidden costs. We believe in making creativity accessible to everyone.",
  },
  {
    question: "How do rewards work right now?",
    answer:
      "Our reward system is based on your engagement and content quality. You can earn points through creating content, engaging with the community, and completing challenges, which can be redeemed for exclusive perks and products.",
  },
  {
    question: "Can I upload my past portfolio work?",
    answer:
      "Yes! We encourage you to showcase your previous work. You can upload your portfolio to help brands and other creators discover your unique style and expertise.",
  },
  {
    question: "When will brands come onboard?",
    answer:
      "We're actively partnering with exciting brands and expect to have our first brand collaborations launching soon. Early explorers will get first access to these opportunities!",
  },
];

export function FAQSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
          Your curiosity, answered.
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl">
          We're here to answer your all questions.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="space-y-4"
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 py-2 bg-card"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
