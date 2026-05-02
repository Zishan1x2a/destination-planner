import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    // Parse target date assuming it might be 'Feb 15 2026 6:30 PM' or ISO string
    // Given the prompt: Feb 15 2026 18:30:00 (using a fixed fallback if parsing fails)
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
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541845157-a6d2d100c931?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {isCelebration ? (
            <h2 className="font-serif text-5xl md:text-7xl text-primary animate-pulse">
              The Celebration Begins!
            </h2>
          ) : (
            <>
              <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-12 block">
                The Countdown
              </span>
              
              <div className="flex justify-center gap-4 md:gap-8 lg:gap-12">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 tabular-nums w-20 md:w-32 lg:w-40 text-center">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}