import React from 'react';
import { motion } from 'framer-motion';
import { InvitationBorder, SectionHeader } from '@/components/OrnamentalElements';

interface StorySectionProps {
  story: string;
}

export function StorySection({ story }: StorySectionProps) {
  return (
    <section id="story" className="py-32 px-6 luxury-bg relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <InvitationBorder className="invitation-card overflow-hidden">
            {/* Damask pattern background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: 'radial-gradient(hsl(var(--card-foreground)) 2px, transparent 2px), radial-gradient(hsl(var(--card-foreground)) 2px, transparent 2px)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px'
            }} />
            
            <div className="relative z-10">
              <SectionHeader label="How It Began" subLabel="Our Story" />
              
              <div className="relative px-8 md:px-16 py-8">
                {/* Decorative open quote */}
                <svg className="absolute top-0 left-0 w-12 h-12 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <p className="text-xl md:text-2xl leading-relaxed text-card-foreground font-serif italic text-justify relative z-10">
                  {story}
                </p>
                
                {/* Decorative close quote */}
                <svg className="absolute bottom-0 right-0 w-12 h-12 text-primary/30 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          </InvitationBorder>
        </motion.div>
      </div>
    </section>
  );
}