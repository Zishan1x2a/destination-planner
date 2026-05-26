import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CornerOrnament } from '@/components/OrnamentalElements';

interface HeroSectionProps {
  coupleName: string;
  weddingDate: string;
  destination: string;
  onOpen: () => void;
  isOpened: boolean;
}

export function HeroSection({ coupleName, weddingDate, destination, onOpen, isOpened }: HeroSectionProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Set this to true when you have placed your video in public/videos/hero-bg.mp4
  const USE_VIDEO = true;

  return (
    <section id="hero" className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-20" />
        
        {USE_VIDEO ? (
          /* User's Custom Video Background */
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto max-w-none object-cover z-0"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        ) : (
          /* Animated Destination Background (Drone Pan Effect) */
          <motion.img 
            initial={{ scale: 1.2, x: "0%", filter: "brightness(0) blur(10px)" }}
            animate={{ scale: 1.1, x: "-5%", filter: "brightness(1) blur(0px)" }}
            transition={{ 
               scale: { duration: 2.5, ease: "easeOut" },
               filter: { duration: 2.5, ease: "easeOut" },
               x: { duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }
            }}
            src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Destination Palace" 
            className="absolute inset-0 w-[110%] h-[110%] max-w-none object-cover object-center z-0"
          />
        )}


      </motion.div>

      {/* Ornate Frame Overlay */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="absolute inset-[32px] z-10 pointer-events-none border-[3px] border-primary/80"
      >
        <div className="absolute inset-[4px] border border-primary/40" />
        <CornerOrnament position="tl" color="hsl(var(--primary))" size={80} />
        <CornerOrnament position="tr" color="hsl(var(--primary))" size={80} />
        <CornerOrnament position="bl" color="hsl(var(--primary))" size={80} />
        <CornerOrnament position="br" color="hsl(var(--primary))" size={80} />
      </motion.div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto -translate-y-16 sm:-translate-y-12 md:-translate-y-12">
        <div className="flex flex-col items-center">
          {/* Ganesha Image Container with Divine Halo Effect */}
          <div className="relative mb-4 flex items-center justify-center w-36 h-36 md:w-44 md:h-44">
            {/* Divine Pulsing Glow */}
            <motion.div
              animate={{
                scale: [0.9, 1.2, 0.9],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
              style={{ 
                background: "radial-gradient(circle, rgba(252, 246, 186, 0.4) 0%, rgba(212, 175, 55, 0.1) 50%, transparent 70%)" 
              }}
            />
            {/* Floating Ganesha Image with Golden Aura */}
            <motion.img
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -8, 0],
                filter: [
                  "brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(1478%) hue-rotate(323deg) brightness(104%) contrast(97%) drop-shadow(0px 4px 8px rgba(0,0,0,0.6)) drop-shadow(0px 0px 8px rgba(252,246,186,0.3))",
                  "brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(1478%) hue-rotate(323deg) brightness(104%) contrast(97%) drop-shadow(0px 8px 16px rgba(0,0,0,0.4)) drop-shadow(0px 0px 18px rgba(252,246,186,0.7))",
                  "brightness(0) saturate(100%) invert(96%) sepia(9%) saturate(1478%) hue-rotate(323deg) brightness(104%) contrast(97%) drop-shadow(0px 4px 8px rgba(0,0,0,0.6)) drop-shadow(0px 0px 8px rgba(252,246,186,0.3))"
                ]
              }}
              transition={{ 
                opacity: { duration: 1.2, delay: 0.2 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              src="/images/ganesha.png"
              alt="Lord Ganesha"
              className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10"
            />
          </div>

          {/* Shloka */}
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-[#FCF6BA] font-serif mb-6 text-center"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            <p className="text-[13px] md:text-base leading-relaxed tracking-wider">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
          </motion.div>

          {/* Dear Guest */}
          <motion.h2 
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.0 }}
            className="text-[#FCF6BA] font-serif tracking-[0.1em] italic text-3xl md:text-4xl mb-3"
            style={{ textShadow: "0 2px 5px rgba(0,0,0,0.8)" }}
          >
            Dear Guest,
          </motion.h2>

          {/* Invitation text */}
          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="text-[#FCF6BA]/80 font-sans tracking-[0.22em] uppercase text-[10px] md:text-xs mt-3 mb-4 max-w-md leading-relaxed"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            You are cordially invited to the wedding of
          </motion.p>
          
          {/* Couple Name */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4 leading-none text-[#FCF6BA] drop-shadow-lg"
            style={{ textShadow: "0 4px 10px rgba(0,0,0,0.8)" }}
          >
            {coupleName}
          </motion.h1>
          
          <svg width="200" height="40" viewBox="0 0 200 40" className="mb-6">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
              d="M10,20 Q50,-10 100,20 T190,20" 
              fill="none" stroke="#FCF6BA" strokeWidth="1.5" className="opacity-70" 
            />
            <motion.circle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} cx="100" cy="20" r="3" fill="#FCF6BA" />
            <motion.circle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} cx="10" cy="20" r="2" fill="#FCF6BA" />
            <motion.circle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} cx="190" cy="20" r="2" fill="#FCF6BA" />
          </svg>

          {/* Date & Destination */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="border border-[#FCF6BA]/60 bg-black/40 backdrop-blur-sm px-5 md:px-8 py-2 md:py-3 rounded-[40px] flex flex-row items-center justify-center gap-2 md:gap-8 text-[11px] sm:text-sm md:text-lg font-serif italic text-[#FCF6BA]/90 whitespace-nowrap"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            <span>{weddingDate}</span>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#FCF6BA]/60" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.8)" }} />
            <span>{destination}</span>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 z-20 text-[#FCF6BA]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        {!isOpened ? (
          <button 
            onClick={onOpen}
            className="group relative px-6 md:px-10 py-3 md:py-3.5 bg-[#FCF6BA]/10 hover:bg-[#FCF6BA]/20 border border-[#FCF6BA]/60 text-[#FCF6BA] transition-all duration-300 rounded-full flex items-center justify-center gap-3 backdrop-blur-md overflow-hidden cursor-pointer whitespace-nowrap"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(252,246,186,0.2)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCF6BA]/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="font-serif italic tracking-[0.15em] text-base md:text-lg font-medium whitespace-nowrap" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Open Invitation</span>
          </button>
        ) : (
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <a href="#story" className="flex flex-col items-center gap-2 text-sm tracking-widest hover:text-[#FCF6BA]/80 transition-colors" style={{ fontVariant: "small-caps", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
              <span>Scroll to Explore</span>
              <ChevronDown size={20} />
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
