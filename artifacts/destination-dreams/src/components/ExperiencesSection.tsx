import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LocalExperience } from '@workspace/api-client-react';

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
    <section id="experiences" className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Explore</span>
            <h2 className="font-serif text-5xl md:text-6xl text-foreground">Things To Do</h2>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 py-4">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0"
              >
                <div className="bg-card border border-border p-8 h-full flex flex-col group hover:border-primary/50 transition-colors">
                  <span className="self-start text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-primary/10 text-primary mb-6">
                    {experience.category}
                  </span>
                  
                  <h3 className="font-serif text-2xl text-foreground mb-4">{experience.name}</h3>
                  <p className="text-muted-foreground font-light mb-8 flex-1">
                    {experience.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-foreground/70 mt-auto pt-6 border-t border-border">
                    <MapPin size={16} className="text-primary" />
                    <span>{experience.distanceFromHotel} from venue</span>
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