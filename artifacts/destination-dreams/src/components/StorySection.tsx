import React from 'react';
import { motion } from 'framer-motion';

interface StorySectionProps {
  story: string;
}

export function StorySection({ story }: StorySectionProps) {
  return (
    <section id="story" className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">How it began</span>
          <h2 className="font-serif text-5xl md:text-6xl text-foreground mb-12">Our Story</h2>
          
          <div className="relative">
            <div className="absolute -top-10 left-0 text-9xl text-primary/10 font-serif opacity-50">"</div>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-light text-justify relative z-10 px-4 md:px-10">
              {story}
            </p>
            <div className="absolute -bottom-16 right-0 text-9xl text-primary/10 font-serif opacity-50 rotate-180">"</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}