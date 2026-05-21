import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { CornerOrnament } from '@/components/OrnamentalElements';

interface NavigationProps {
  coupleName: string;
}

export function Navigation({ coupleName }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#story', label: 'Story' },
    { href: '#itinerary', label: 'Itinerary' },
    { href: '#rsvp', label: 'RSVP' },
    { href: '#destination', label: 'Venue' },
    { href: '#contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
      
      const sections = links.map(l => l.href.substring(1));
      let currentSection = 'hero';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${scrolled ? 'translate-y-0 opacity-100 bg-background/95 backdrop-blur-md border-b-[1.5px] border-primary/40 py-4 shadow-xl' : '-translate-y-full opacity-0 py-4'}`}>
        {scrolled && (
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        )}
        
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
          <a href="#hero" className="font-serif text-3xl md:text-4xl tracking-widest text-primary flex items-center gap-3 italic">
            <span className="text-[12px] text-primary">✦</span>
            {coupleName?.split(' ')[0]?.[0] || 'P'} & {coupleName?.split(' ')[2]?.[0] || 'A'}
            <span className="text-[12px] text-primary">✦</span>
          </a>
          
          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase font-medium">
            {links.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`relative transition-colors py-2 ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                {link.label}
                {activeSection === link.href.substring(1) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-primary text-[8px]"
                  >
                    ✦
                  </motion.div>
                )}
              </a>
            ))}
          </div>

          <button 
            className="md:hidden text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={32} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-50 bg-card flex flex-col p-6 border-l-[6px] border-primary"
          >
            <CornerOrnament position="tl" color="hsl(var(--primary))" size={60} />
            <CornerOrnament position="tr" color="hsl(var(--primary))" size={60} />
            <CornerOrnament position="bl" color="hsl(var(--primary))" size={60} />
            <CornerOrnament position="br" color="hsl(var(--primary))" size={60} />

            <div className="flex justify-between items-center mb-12 relative z-10">
              <span className="font-serif text-3xl italic text-primary">P & A</span>
              <button onClick={() => setIsOpen(false)} className="text-primary hover:rotate-90 transition-transform">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 text-2xl font-serif text-center flex-1 justify-center relative z-10">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className={`italic ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-card-foreground hover:text-primary'} transition-colors flex flex-col items-center gap-2`}
                >
                  {link.label}
                  {activeSection === link.href.substring(1) && (
                    <span className="text-primary text-xs">✦</span>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}