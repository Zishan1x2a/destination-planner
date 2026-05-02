import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import type { EventInfo } from '@workspace/api-client-react';

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
    <section id="itinerary" className="py-32 px-6 bg-card relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">The Celebration</span>
          <h2 className="font-serif text-5xl md:text-6xl text-foreground">Events Itinerary</h2>
        </div>

        <div className="relative border-l border-primary/20 pl-6 md:pl-10 ml-4 md:ml-0 space-y-16">
          {days.map((day, dayIndex) => (
            <div key={day} className="relative">
              <div className="absolute -left-[54px] md:-left-[88px] top-0 bg-background border border-primary text-primary w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full font-serif text-xl md:text-2xl z-10">
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
                    className="bg-background border border-border p-6 md:p-8 relative group hover:border-primary/50 transition-colors"
                  >
                    <div className="absolute -left-8 md:-left-[42px] top-8 w-4 h-px bg-primary/50" />
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-primary/80 font-medium tracking-wider text-sm block mb-2">{event.date}</span>
                        <h3 className="font-serif text-3xl text-foreground">{event.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground shrink-0 bg-secondary/10 text-secondary px-4 py-2">
                        <Clock size={16} />
                        <span className="text-sm font-medium">{event.time}</span>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-muted-foreground font-light mb-6">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <MapPin size={16} className="text-primary" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="hidden sm:block text-border">•</div>
                      <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="text-primary uppercase tracking-widest text-xs">Dress Code:</span>
                        <span>{event.dressCode}</span>
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