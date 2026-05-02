import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
    { href: '#destination', label: 'Destination' },
    { href: '#travel', label: 'Travel' },
    { href: '#itinerary', label: 'Itinerary' },
    { href: '#experiences', label: 'Experiences' },
    { href: '#rsvp', label: 'RSVP' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border/50 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#hero" className="font-serif text-2xl md:text-3xl tracking-widest text-primary">
            {coupleName}
          </a>
          
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            {links.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`transition-colors ${activeSection === link.href.substring(1) ? 'text-primary' : 'hover:text-primary'}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button 
            className="md:hidden text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl tracking-widest text-primary">{coupleName}</span>
              <button onClick={() => setIsOpen(false)} className="text-primary">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-2xl font-serif text-center flex-1 justify-center">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className={`${activeSection === link.href.substring(1) ? 'text-primary' : 'text-foreground hover:text-primary'} transition-colors`}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}