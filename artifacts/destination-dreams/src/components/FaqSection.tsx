import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from '@workspace/api-client-react';
import { InvitationBorder, SectionHeader } from '@/components/OrnamentalElements';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section id="faq" className="py-32 px-6 bg-background relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <InvitationBorder className="invitation-card p-8 md:p-16">
            <SectionHeader label="Details" subLabel="Questions" />

            <Accordion type="single" collapsible className="w-full mt-12">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b-0 border-t border-primary/30"
                >
                  <AccordionTrigger className="font-serif text-xl md:text-2xl text-card-foreground hover:text-primary transition-colors text-left py-6 italic [&>svg]:hidden flex justify-between group">
                    <span>{faq.question}</span>
                    <span className="text-primary text-sm transition-transform duration-300 group-data-[state=open]:rotate-90 ml-4 shrink-0 mt-2">✦</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-card-foreground/80 font-serif text-lg leading-relaxed pb-8 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </InvitationBorder>
        </motion.div>
      </div>
    </section>
  );
}