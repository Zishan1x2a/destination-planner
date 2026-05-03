import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { InvitationBorder, SectionHeader } from '@/components/OrnamentalElements';

interface DestinationSectionProps {
  description: string;
  facts: string[];
  googleMapsUrl: string;
}

export function DestinationSection({ description, facts, googleMapsUrl }: DestinationSectionProps) {
  return (
    <section id="destination" className="py-32 px-6 bg-background relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <InvitationBorder className="invitation-card overflow-hidden text-center">
            {/* Medallion Watermark */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-primary/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0C55 20 70 30 90 35C70 40 55 50 50 70C45 50 30 40 10 35C30 30 45 20 50 0Z" />
              <path d="M50 30C52 40 58 45 68 47C58 49 52 54 50 64C48 54 42 49 32 47C42 45 48 40 50 30Z" />
            </svg>
            
            <div className="relative z-10">
              <SectionHeader label="The Venue" subLabel="Udaipur, Rajasthan" />
              
              <div className="max-w-2xl mx-auto mb-12">
                <p className="text-xl leading-relaxed text-card-foreground font-serif italic mb-12">
                  {description}
                </p>
                
                <div className="space-y-4 mb-12 text-left bg-black/5 p-8 border border-primary/20">
                  {facts.map((fact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <span className="text-primary mt-1 text-[10px]">✦</span>
                      <p className="text-card-foreground font-serif text-lg leading-relaxed">
                        {fact}
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                <Button 
                  className="bg-secondary text-secondary-foreground font-serif tracking-widest uppercase rounded-none border border-primary/50 hover:bg-secondary/90 px-8 py-6 h-auto"
                  asChild
                >
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                    <MapPin size={20} />
                    <span>Open in Maps</span>
                  </a>
                </Button>
              </div>
            </div>
          </InvitationBorder>
        </motion.div>
      </div>
    </section>
  );
}