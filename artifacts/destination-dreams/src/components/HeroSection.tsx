import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CornerOrnament } from '@/components/OrnamentalElements';

interface HeroSectionProps {
  coupleName: string;
  weddingDate: string;
  destination: string;
}

export function HeroSection({ coupleName, weddingDate, destination }: HeroSectionProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Udaipur Palace" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Ornate Frame Overlay */}
      <div className="absolute inset-[32px] z-10 pointer-events-none border-[3px] border-primary/80">
        <div className="absolute inset-[4px] border border-primary/40" />
        <CornerOrnament position="tl" color="hsl(var(--primary))" size={80} />
        <CornerOrnament position="tr" color="hsl(var(--primary))" size={80} />
        <CornerOrnament position="bl" color="hsl(var(--primary))" size={80} />
        <CornerOrnament position="br" color="hsl(var(--primary))" size={80} />
      </div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-primary font-serif tracking-[0.2em] italic text-lg md:text-xl mb-8" style={{ fontVariant: "small-caps" }}>
            You are cordially invited to the wedding of
          </h2>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-6 leading-none text-primary drop-shadow-lg">
            {coupleName}
          </h1>
          
          <svg width="200" height="40" viewBox="0 0 200 40" className="mb-12">
            <path d="M10,20 Q50,-10 100,20 T190,20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" className="opacity-70" />
            <circle cx="100" cy="20" r="3" fill="hsl(var(--primary))" />
            <circle cx="10" cy="20" r="2" fill="hsl(var(--primary))" />
            <circle cx="190" cy="20" r="2" fill="hsl(var(--primary))" />
          </svg>

          <div className="border border-primary/60 bg-black/40 backdrop-blur-sm px-8 py-3 rounded-[40px] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-lg md:text-xl font-serif italic text-primary/90">
            <span>{weddingDate}</span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span>{destination}</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-primary"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <a href="#story" className="flex flex-col items-center gap-2 text-sm tracking-widest hover:text-primary/80 transition-colors" style={{ fontVariant: "small-caps" }}>
          <span>Discover</span>
          <ChevronDown size={20} />
        </a>
      </motion.div>
    </section>
  );
}