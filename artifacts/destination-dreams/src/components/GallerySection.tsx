import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, X, Maximize2 } from 'lucide-react';
import { SectionHeader, CornerOrnament, BackgroundCornerOrnaments } from '@/components/OrnamentalElements';

interface GalleryItem {
  url: string;
  category: string;
  caption: string;
}

interface GallerySectionProps {
  gallery: GalleryItem[];
}

const CATEGORY_MAP: Record<string, string> = {
  all: 'All Moments',
  couple: 'Couple Portraits',
  events: 'Ceremonies',
  decor: 'Venue & Decor',
};

export function GallerySection({ gallery }: GallerySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter gallery items based on selected category
  const filteredGallery = gallery.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  // Reset index to 0 when active category changes to avoid out-of-bounds
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  // Autoplay loop
  useEffect(() => {
    if (!isAutoplay || lightboxIndex !== null || filteredGallery.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, filteredGallery.length, lightboxIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredGallery.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredGallery.length) % filteredGallery.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % filteredGallery.length);
  };

  return (
    <section ref={ref} id="gallery" className="py-24 md:py-32 px-4 md:px-6 relative bg-background overflow-hidden">
      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader label="Moments" subLabel="Gallery" />

        {/* ── Category Filters ── */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-8 md:mt-12 mb-8">
          {Object.entries(CATEGORY_MAP).map(([key, label]) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`relative px-4 py-2 text-sm font-sans font-medium tracking-wider uppercase transition-all duration-300 rounded-full border border-primary/20 ${
                  isActive
                    ? 'text-primary-foreground bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)] border-transparent'
                    : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Interactive Main Gallery Viewport ── */}
        <div className="max-w-4xl mx-auto">
          {filteredGallery.length > 0 ? (
            <div className="glowing-gold-border group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="glowing-gold-border-content aspect-[4/3] md:aspect-[16/10] bg-black/40 relative">
                {/* Framer motion transition on active image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={filteredGallery[activeIndex]?.url}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={filteredGallery[activeIndex]?.url}
                      alt={filteredGallery[activeIndex]?.caption}
                      className="w-full h-full object-cover select-none cursor-pointer"
                      onClick={() => setLightboxIndex(activeIndex)}
                      loading="eager"
                    />
                    
                    {/* Hover Shimmer/Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                    
                    {/* Zoom / Maximize hover icon */}
                    <div 
                      onClick={() => setLightboxIndex(activeIndex)}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-primary/95 text-foreground/80 hover:text-primary-foreground p-3 rounded-full border border-foreground/20 hover:border-transparent scale-0 group-hover:scale-100 transition-all duration-300 cursor-pointer z-30 shadow-lg"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Royal Corner Ornaments */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  <CornerOrnament position="tl" color="hsl(var(--primary))" size={36} />
                  <CornerOrnament position="tr" color="hsl(var(--primary))" size={36} />
                  <CornerOrnament position="bl" color="hsl(var(--primary))" size={36} />
                  <CornerOrnament position="br" color="hsl(var(--primary))" size={36} />
                </div>

                {/* Left Navigation Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary/90 text-foreground hover:text-primary-foreground p-2 md:p-3 rounded-full border border-primary/20 hover:border-transparent hover:scale-110 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100 shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary/90 text-foreground hover:text-primary-foreground p-2 md:p-3 rounded-full border border-primary/20 hover:border-transparent hover:scale-110 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100 shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border border-primary/20 rounded-lg">
              <p className="text-foreground/60 font-sans">No photos in this category yet.</p>
            </div>
          )}

          {/* ── Caption and Controls Center ── */}
          {filteredGallery.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-2 gap-4">
              <div className="text-center md:text-left">
                <motion.h3
                  key={filteredGallery[activeIndex]?.caption}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl md:text-2xl font-serif text-primary gold-shimmer-text tracking-wide"
                >
                  {filteredGallery[activeIndex]?.caption}
                </motion.h3>
                <p className="text-sm font-sans text-foreground/60 mt-1 uppercase tracking-widest">
                  {CATEGORY_MAP[filteredGallery[activeIndex]?.category] || ''}
                </p>
              </div>

              {/* Controls: Play/Pause with Progress and Count */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-sans text-foreground/50 tracking-wider">
                  {activeIndex + 1} / {filteredGallery.length}
                </span>

                <button
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className="relative p-2 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                  aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
                >
                  {/* Autoplay Circular Progress SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16.5"
                      stroke="hsl(var(--primary)/0.1)"
                      strokeWidth="1.5"
                      fill="transparent"
                    />
                    <motion.circle
                      key={`${activeIndex}-${isAutoplay}`}
                      cx="18"
                      cy="18"
                      r="16.5"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="transparent"
                      strokeDasharray="103.6"
                      initial={{ strokeDashoffset: 103.6 }}
                      animate={isAutoplay ? { strokeDashoffset: 0 } : { strokeDashoffset: 103.6 }}
                      transition={isAutoplay ? { duration: 5, ease: "linear" } : {}}
                      className="origin-center -rotate-90"
                    />
                  </svg>
                  
                  {isAutoplay ? <Pause className="w-4 h-4 z-10" /> : <Play className="w-4 h-4 z-10" />}
                </button>
              </div>
            </div>
          )}

          {/* ── Scrollable Thumbnail Ribbon ── */}
          {filteredGallery.length > 1 && (
            <div className="relative mt-8 max-w-3xl mx-auto px-4">
              {/* Left Fade Overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              {/* Right Fade Overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div className="flex gap-3 overflow-x-auto py-3 px-6 no-scrollbar scroll-smooth justify-start md:justify-center">
                {filteredGallery.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-primary scale-105 shadow-[0_0_15px_hsl(var(--primary)/0.5)]'
                          : 'border-primary/20 opacity-55 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Cinematic Fullscreen Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
          >
            {/* Background click to close */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxIndex(null)} />

            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-foreground/80 hover:text-primary hover:scale-110 p-3 rounded-full border border-foreground/20 hover:border-primary transition-all duration-300 z-[110]"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image & Navigation Frame */}
            <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/10] flex items-center justify-center z-10 max-h-[75vh]">
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev - 1 + filteredGallery.length) % filteredGallery.length : null
                  );
                }}
                className="absolute left-2 md:left-4 text-foreground/80 hover:text-primary hover:scale-110 p-3 rounded-full border border-foreground/20 hover:border-primary transition-all duration-300 bg-black/50 z-20"
                aria-label="Previous lightbox image"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Active Image Box */}
              <div className="relative max-h-[70vh] max-w-[85vw] overflow-hidden border border-primary/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-black/40">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={filteredGallery[lightboxIndex]?.url}
                    src={filteredGallery[lightboxIndex]?.url}
                    alt={filteredGallery[lightboxIndex]?.caption}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[68vh] max-w-full object-contain"
                  />
                </AnimatePresence>

                {/* Lightbox Corners */}
                <div className="absolute inset-0 pointer-events-none">
                  <CornerOrnament position="tl" color="hsl(var(--primary))" size={24} />
                  <CornerOrnament position="tr" color="hsl(var(--primary))" size={24} />
                  <CornerOrnament position="bl" color="hsl(var(--primary))" size={24} />
                  <CornerOrnament position="br" color="hsl(var(--primary))" size={24} />
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev + 1) % filteredGallery.length : null
                  );
                }}
                className="absolute right-2 md:right-4 text-foreground/80 hover:text-primary hover:scale-110 p-3 rounded-full border border-foreground/20 hover:border-primary transition-all duration-300 bg-black/50 z-20"
                aria-label="Next lightbox image"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Caption & Indicator */}
            <div className="mt-8 text-center z-10 max-w-xl px-4 pointer-events-none">
              <motion.h4
                key={filteredGallery[lightboxIndex]?.caption}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-3xl font-serif text-primary gold-shimmer-text tracking-wide"
              >
                {filteredGallery[lightboxIndex]?.caption}
              </motion.h4>
              <p className="text-foreground/50 text-sm mt-2 font-sans tracking-widest uppercase">
                {CATEGORY_MAP[filteredGallery[lightboxIndex]?.category] || ''} • Image {lightboxIndex + 1} of {filteredGallery.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
