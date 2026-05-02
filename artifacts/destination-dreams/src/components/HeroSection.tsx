import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Udaipur Palace" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <h2 className="text-primary font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-6">
            You are invited to the wedding of
          </h2>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 leading-none text-white drop-shadow-lg">
            {coupleName}
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-lg md:text-xl font-light tracking-wide opacity-90 text-white">
            <span>{weddingDate}</span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{destination}</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-primary"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <a href="#story" className="flex flex-col items-center gap-2 text-sm tracking-widest uppercase hover:text-primary/80 transition-colors">
          <span>Discover</span>
          <ChevronDown size={20} />
        </a>
      </motion.div>
    </section>
  );
}