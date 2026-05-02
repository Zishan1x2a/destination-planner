import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface DestinationSectionProps {
  description: string;
  facts: string[];
  googleMapsUrl: string;
}

export function DestinationSection({ description, facts, googleMapsUrl }: DestinationSectionProps) {
  return (
    <section id="destination" className="py-32 px-6 bg-card relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">The Venue</span>
            <h2 className="font-serif text-5xl md:text-6xl text-foreground mb-8">Udaipur, Rajasthan</h2>
            <p className="text-lg leading-relaxed text-muted-foreground font-light mb-8">
              {description}
            </p>
            <Button 
              className="font-serif tracking-widest uppercase rounded-none border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 h-auto"
              variant="outline"
              asChild
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <MapPin size={20} />
                <span>View on Map</span>
              </a>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`bg-background/50 border border-border p-8 backdrop-blur-sm ${index % 2 !== 0 ? 'md:translate-y-12' : ''}`}
              >
                <div className="text-primary mb-4">
                  <MapPin size={24} />
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {fact}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}