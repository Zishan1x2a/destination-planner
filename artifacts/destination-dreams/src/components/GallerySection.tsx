import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, CornerOrnament } from '@/components/OrnamentalElements';

interface GallerySectionProps {
  gallery: string[];
}

export function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section id="gallery" className="py-32 px-6 luxury-bg relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Moments" subLabel="Gallery" />

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mt-16">
          {gallery.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.2 }}
              className="break-inside-avoid relative overflow-hidden group p-2 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.2)] transition-all duration-500 bg-card"
            >
              <div className="absolute inset-1 border-[4px] border-primary pointer-events-none z-20">
                <div className="absolute inset-[2px] border border-primary/40" />
                <CornerOrnament position="tl" color="hsl(var(--primary))" size={40} />
                <CornerOrnament position="tr" color="hsl(var(--primary))" size={40} />
                <CornerOrnament position="bl" color="hsl(var(--primary))" size={40} />
                <CornerOrnament position="br" color="hsl(var(--primary))" size={40} />
              </div>
              
              <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              
              <img 
                src={url} 
                alt={`Gallery image ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}