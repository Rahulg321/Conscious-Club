"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqData = [
  {
    question: "Why the extra 'b' in ConsciousClubb?",
    answer: [
      "Because we're extra - in the best way. ;) The extra b = bravos + benefits + belonging + more bang for your creativity + more clubB!",
    ],
  },
  {
    question: "Do I need to be a professional creator to join?",
    answer: ["Not at all! Creators of all levels are welcome."],
  },
  {
    question: "Is there a cost to join?",
    answer: [
      "Joining CC is completely free! We believe in making creativity accessible to everyone :)",
    ],
  },
  {
    question: "What are CC Bravos? How to earn them?",
    answer: [
      "Bravos are CC's currency for celebration and achievement. There are 2 Types: Flex Bravos & Buzz Bravos.",
      "Flex Bravos show off your vibe, your style, your mood. They are available in the Bravo shelf to choose and pin on your profile. Imagine this like a social currency of CC.",
      "Buzz Bravos - coming soon - are CC's reward currency. They are earned through challenges which unlock perks",
      // "Creating the most liked entries, Creating the most liked Mashups"
    ],
  },
];

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string | undefined>("item-0");
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 text-balance">
          Your curiosity, answered.
        </h2>
        <p className="text-muted-foreground text-base mt-4">
          We're here to answer your all questions.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="space-y-2"
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(
                "rounded-lg border-none px-4 py-1",
                openItem === `item-${index}` ? "bg-muted" : "bg-card"
              )}
            >
              <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              {faq.answer.map((ans: string, idx: any) => {
                return (
                  <AccordionContent
                    key={idx}
                    className="text-muted-foreground text-sm leading-relaxed pb-4"
                  >
                    {ans}
                  </AccordionContent>
                );
              })}
              {/* <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{faq.answer}</AccordionContent> */}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
