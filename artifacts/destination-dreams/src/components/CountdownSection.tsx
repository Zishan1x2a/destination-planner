import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InvitationBorder, OrnamentDivider } from '@/components/OrnamentalElements';

interface CountdownSectionProps {
  targetDate: string;
}

export function CountdownSection({ targetDate }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isCelebration, setIsCelebration] = useState(false);

  useEffect(() => {
    const target = new Date("2026-02-15T18:30:00+05:30").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setIsCelebration(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="py-32 px-6  relative overflow-hidden flex justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541845157-a6d2d100c931?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl relative z-10"
      >
        <InvitationBorder className="invitation-card py-16 px-8 md:px-16 text-center">
          <OrnamentDivider variant="floral" color="hsl(var(--primary))" />
          
          {isCelebration ? (
            <h2 className="font-serif text-5xl md:text-7xl text-primary animate-pulse my-12 italic">
              The Celebration Begins!
            </h2>
          ) : (
            <>
              <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block" style={{ fontVariant: "small-caps" }}>
                Counting Down To
              </span>
              <h2 className="font-serif text-5xl md:text-6xl text-card-foreground italic mb-16">
                The Wedding Ceremony
              </h2>
              
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="bg-card border-[3px] border-primary relative px-6 py-8 md:px-8 md:py-10 mb-4 flex items-center justify-center min-w-[100px] md:min-w-[140px]">
                      <div className="absolute inset-1 border border-primary/40 pointer-events-none" />
                      <span className="font-serif text-5xl md:text-7xl text-card-foreground tabular-nums leading-none">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-primary font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <OrnamentDivider variant="diamond" color="hsl(var(--primary))" />
        </InvitationBorder>
      </motion.div>
    </section>
  );
}
