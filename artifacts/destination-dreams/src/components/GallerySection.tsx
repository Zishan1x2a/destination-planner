import React from 'react';
import { motion } from 'framer-motion';

interface GallerySectionProps {
  gallery: string[];
}

export function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section id="gallery" className="py-32 px-6 bg-card relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Moments</span>
          <h2 className="font-serif text-5xl md:text-6xl text-foreground">Gallery</h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.2 }}
              className="break-inside-avoid relative overflow-hidden group aspect-[3/4]"
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img 
                src={url} 
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}