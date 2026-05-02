import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, Calendar, ExternalLink } from 'lucide-react';
import type { AirportInfo, HotelInfo } from '@workspace/api-client-react';

interface TravelSectionProps {
  airport: AirportInfo;
  hotels: HotelInfo[];
}

export function TravelSection({ airport, hotels }: TravelSectionProps) {
  return (
    <section id="travel" className="py-32 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Travel & Stay</span>
          <h2 className="font-serif text-5xl md:text-6xl text-foreground">Join Us In India</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Airport Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border p-8 flex flex-col items-center text-center col-span-1 lg:col-span-3 xl:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Plane size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-2">{airport.name} ({airport.code})</h3>
            <p className="text-muted-foreground font-light mb-6 flex-1">
              Travel Time: {airport.travelTime}
            </p>
            {airport.transferInfo && (
              <p className="text-sm text-primary/80 bg-primary/5 px-4 py-2 rounded">
                {airport.transferInfo}
              </p>
            )}
          </motion.div>

          {/* Hotels */}
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              className="bg-card border border-border p-8 flex flex-col col-span-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Hotel size={24} />
                </div>
                <span className={`text-xs tracking-wider uppercase px-3 py-1 border ${hotel.type === 'primary' ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                  {hotel.type}
                </span>
              </div>
              
              <h3 className="font-serif text-2xl mb-4">{hotel.name}</h3>
              <p className="text-muted-foreground font-light mb-6 flex-1">
                {hotel.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Calendar size={16} className="text-primary" />
                  <span>{hotel.checkIn} — {hotel.checkOut}</span>
                </div>
                {hotel.groupCode && (
                  <div className="text-sm border border-border/50 p-3 bg-background/50 flex justify-between items-center">
                    <span className="text-muted-foreground">Group Code</span>
                    <span className="font-medium text-primary tracking-widest">{hotel.groupCode}</span>
                  </div>
                )}
              </div>

              {hotel.bookingUrl && (
                <a 
                  href={hotel.bookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-serif tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  <span>Book Room</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}