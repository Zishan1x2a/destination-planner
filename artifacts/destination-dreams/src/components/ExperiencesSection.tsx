import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LocalExperience } from '@/lib/mock-api-hooks';
import { SectionHeader } from '@/components/OrnamentalElements';

interface ExperiencesSectionProps {
  experiences: LocalExperience[];
}

export function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="experiences" className="py-32 px-6  relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="flex-1 text-left">
            <SectionHeader label="Explore" subLabel="Things To Do" align="left" />
          </div>
          
          <div className="flex gap-4 pb-12">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8 py-4">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0"
              >
                <div className="invitation-card p-8 h-full flex flex-col group hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] transition-all">
                  <div className="absolute top-0 right-4 bg-secondary text-secondary-foreground text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 shadow-sm border border-primary/30 z-10">
                    {experience.category}
                    <div className="absolute -left-2 top-0 w-0 h-0 border-y-[13px] border-y-transparent border-r-[8px] border-r-secondary" />
                  </div>
                  
                  <h3 className="font-serif text-3xl text-card-foreground mb-4 mt-4 italic">{experience.name}</h3>
                  <p className="text-card-foreground/70 font-serif text-lg mb-8 flex-1">
                    {experience.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-card-foreground mt-auto pt-6 border-t border-primary/30">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-serif italic">{experience.distanceFromHotel} from venue</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
