import React from 'react';
import { motion } from 'framer-motion';
import type { EventInfo } from '@workspace/api-client-react';
import { SectionHeader } from '@/components/OrnamentalElements';

interface ItinerarySectionProps {
  events: EventInfo[];
}

export function ItinerarySection({ events }: ItinerarySectionProps) {
  // Group events by day
  const eventsByDay = events.reduce((acc, event) => {
    const day = event.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {} as Record<number, EventInfo[]>);

  const days = Object.keys(eventsByDay).map(Number).sort();

  return (
    <section id="itinerary" className="py-32 px-6 bg-background relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="The Celebration" subLabel="Events Itinerary" />

        <div className="relative border-l-2 border-dashed border-primary pl-8 md:pl-12 ml-4 md:ml-0 mt-16 space-y-20">
          {days.map((day, dayIndex) => (
            <div key={day} className="relative">
              <div className="absolute -left-[54px] md:-left-[74px] top-0 bg-card border-2 border-primary text-primary w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full font-serif text-2xl md:text-3xl z-10 shadow-[0_0_0_4px_hsl(var(--background))]">
                <div className="absolute inset-1 border border-primary/40 rounded-full" />
                {day}
              </div>
              
              <div className="space-y-12">
                {eventsByDay[day].map((event, eventIndex) => (
                  <motion.div
                    key={event.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: eventIndex * 0.1 }}
                    className="invitation-card p-6 md:p-8 relative group hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-shadow"
                  >
                    <div className="absolute -left-8 md:-left-12 top-8 w-8 md:w-12 h-px bg-primary" />
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <span className="text-primary font-medium tracking-[0.2em] uppercase text-xs block mb-2">{event.date}</span>
                        <h3 className="font-serif text-3xl md:text-4xl text-card-foreground italic">{event.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 bg-secondary text-secondary-foreground px-4 py-2 relative">
                        <div className="absolute left-[-6px] top-0 w-0 h-0 border-y-[18px] border-y-transparent border-r-[6px] border-r-secondary" />
                        <span className="text-sm font-serif italic tracking-widest">{event.time}</span>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-card-foreground/80 font-serif italic text-lg mb-8">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-primary/30">
                      <div className="flex items-center gap-2 text-sm text-card-foreground font-serif text-lg">
                        <span className="text-primary text-[10px]">✦</span>
                        <span>{event.venue}</span>
                      </div>
                      <div className="border border-primary px-4 py-1 rounded-full flex items-center gap-2 bg-background/50 text-card-foreground">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12h20M12 2v20"/>
                        </svg>
                        <span className="font-serif italic">{event.dressCode}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}