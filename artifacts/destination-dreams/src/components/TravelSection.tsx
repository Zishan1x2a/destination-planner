import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { AirportInfo, HotelInfo } from '@workspace/api-client-react';
import { InvitationBorder, SectionHeader } from '@/components/OrnamentalElements';

interface TravelSectionProps {
  airport: AirportInfo;
  hotels: HotelInfo[];
}

export function TravelSection({ airport, hotels }: TravelSectionProps) {
  return (
    <section id="travel" className="py-32 px-6 luxury-bg relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="Travel & Stay" subLabel="Join Us In India" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {/* Airport Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-1 lg:col-span-3 xl:col-span-1"
          >
            <InvitationBorder className="invitation-card h-full flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center text-primary mb-6 relative">
                <div className="absolute inset-1 border border-primary/50 rounded-full" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-.5-.5-2.5 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-4 4-2.8-.9c-.4-.1-.8.2-1 .5L1 17l5 2 2 5c.3.2.6-.2.5-1l-.9-2.8 4-4 4 6c.4.2.8-.2.6-.7z"/>
                </svg>
              </div>
              <h3 className="font-serif text-3xl mb-2 text-card-foreground italic">{airport.name} ({airport.code})</h3>
              <p className="text-card-foreground/70 font-serif text-lg mb-6 flex-1">
                Travel Time: {airport.travelTime}
              </p>
              {airport.transferInfo && (
                <div className="border border-primary/30 bg-primary/5 p-4 relative w-full">
                  <p className="text-sm text-card-foreground font-serif italic">
                    {airport.transferInfo}
                  </p>
                </div>
              )}
            </InvitationBorder>
          </motion.div>

          {/* Hotels */}
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              className="col-span-1"
            >
              <InvitationBorder className="invitation-card h-full flex flex-col p-8 relative overflow-hidden">
                {hotel.type === 'primary' && (
                  <div className="absolute top-4 right-[-30px] rotate-45 bg-secondary text-secondary-foreground text-[10px] tracking-widest uppercase py-1 px-10 shadow-sm border-y border-primary/50">
                    Primary
                  </div>
                )}
                
                <div className="flex justify-center mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 20h20"/>
                    <path d="M5 20V8l7-5 7 5v12"/>
                    <path d="M9 20v-6h6v6"/>
                    <path d="M12 10v.01"/>
                  </svg>
                </div>
                
                <h3 className="font-serif text-3xl mb-4 text-card-foreground text-center italic">{hotel.name}</h3>
                <p className="text-card-foreground/80 font-serif text-lg mb-6 flex-1 text-center">
                  {hotel.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="text-center border-y border-primary/30 py-3 text-card-foreground font-serif italic text-lg">
                    <span>{hotel.checkIn} — {hotel.checkOut}</span>
                  </div>
                  {hotel.groupCode && (
                    <div className="border border-primary luxury-bg/50 p-4 text-center">
                      <span className="block text-xs uppercase tracking-widest text-primary mb-1">Group Code</span>
                      <span className="font-mono text-lg text-card-foreground">{hotel.groupCode}</span>
                    </div>
                  )}
                </div>

                {hotel.bookingUrl && (
                  <a 
                    href={hotel.bookingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-4 bg-secondary text-secondary-foreground font-serif tracking-widest uppercase hover:bg-secondary/90 transition-colors border-t border-primary/50"
                  >
                    <span>Book Room</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </InvitationBorder>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}