import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { OrnamentDivider, BackgroundCornerOrnaments } from '@/components/OrnamentalElements';

interface StorySectionProps {
  story: string;
}

/* ─── Floating petal ─── */
function Petal({ x, delay, duration, size }: { x: number; delay: number; duration: number; size: number }) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none select-none"
      style={{ left: `${x}%`, fontSize: size }}
      animate={{
        y: ['0vh', '110vh'],
        x: [0, Math.sin(x) * 60, Math.sin(x * 2) * 40, 0],
        rotate: [0, 180, 360],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
    >
      🌸
    </motion.div>
  );
}

/* ─── Gold spark ─── */
function Spark({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], rotate: [0, 45, 90] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, repeatDelay: 3 + delay }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L9 7L16 8L9 9L8 16L7 9L0 8L7 7Z" fill="hsl(42,85%,62%)" opacity="0.7" />
      </svg>
    </motion.div>
  );
}

/* ─── Animated ink quill ─── */
function QuillDraw({ isInView }: { isInView: boolean }) {
  return (
    <motion.div className="flex justify-center mb-10">
      <motion.svg
        width="80" height="80" viewBox="0 0 80 80" fill="none"
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Quill feather */}
        <motion.path
          d="M60 8 C70 15, 72 30, 60 45 C50 55, 35 60, 20 70 C30 55, 40 40, 42 28 C44 18, 52 10, 60 8Z"
          fill="hsl(42 60% 30% / 0.4)"
          stroke="hsl(42 80% 58%)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.6, ease: 'easeInOut' }}
        />
        {/* Quill vane lines */}
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={i}
            d={`M${55 - i * 8},${18 + i * 12} C${48 - i * 6},${24 + i * 10} ${38 - i * 5},${32 + i * 8} ${30 - i * 4},${42 + i * 6}`}
            stroke="hsl(42 75% 55% / 0.4)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 1.2 + i * 0.15 }}
          />
        ))}
        {/* Nib */}
        <motion.path
          d="M20 70 L15 78 L22 74 Z"
          fill="hsl(42 85% 62%)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 2 }}
          style={{ transformOrigin: '18px 74px' }}
        />
        {/* Ink drop */}
        <motion.circle
          cx="13" cy="76" r="2.5"
          fill="hsl(42 85% 62% / 0.6)"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: [0, 1.4, 1] } : {}}
          transition={{ duration: 0.5, delay: 2.2 }}
          style={{ transformOrigin: '13px 76px' }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ─── Word-by-word story reveal ─── */
function StoryText({ story, isInView }: { story: string; isInView: boolean }) {
  const words = story.split(' ');
  return (
    <p className="font-serif text-xl md:text-2xl leading-relaxed text-center md:text-justify">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          style={{ color: `hsl(42 ${50 + (i % 3) * 5}% ${68 + (i % 2) * 6}% / 0.9)` }}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.55,
            delay: 1.2 + i * 0.035,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ─── Animated underline ink stroke ─── */
function InkUnderline({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <motion.svg width="300" height="12" viewBox="0 0 300 12" className="mx-auto">
      <motion.path
        d="M4,8 C60,3 120,11 180,6 C240,1 280,9 296,6"
        stroke="hsl(42 80% 55%)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.8, delay, ease: 'easeInOut' }}
      />
      {/* Shimmer on top */}
      <motion.path
        d="M4,8 C60,3 120,11 180,6 C240,1 280,9 296,6"
        stroke="hsl(42 95% 80%)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0"
        animate={isInView ? { opacity: [0, 0.8, 0], pathLength: [0, 1, 1] } : {}}
        transition={{ duration: 1.2, delay: delay + 1.6, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

/* ─── Animated side ornament ─── */
function SideOrnament({ side, isInView }: { side: 'left' | 'right'; isInView: boolean }) {
  const isLeft = side === 'left';
  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-0 md:left-4' : 'right-0 md:right-4'} hidden md:block`}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.8 }}
    >
      <motion.svg
        width="40" height="200" viewBox="0 0 40 200" fill="none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.line
          x1="20" y1="10" x2="20" y2="190"
          stroke="hsl(42 70% 50%)"
          strokeWidth="0.7"
          strokeDasharray="3 5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, delay: 1.0 }}
        />
        {[30, 70, 100, 130, 170].map((cy, i) => (
          <motion.circle
            key={i}
            cx="20" cy={cy} r="3"
            fill="hsl(42 80% 58%)"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.6 } : {}}
            transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
            style={{ transformOrigin: `20px ${cy}px` }}
          />
        ))}
        <motion.path
          d={isLeft ? 'M20,100 L5,90 L20,80 L35,90 Z' : 'M20,100 L5,90 L20,80 L35,90 Z'}
          fill="hsl(42 75% 52% / 0.5)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5 }}
          style={{ transformOrigin: '20px 90px' }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ─── Glowing border card ─── */
function GlowBorder({ isInView }: { isInView: boolean }) {
  return (
    <>
      {/* Top */}
      <motion.div className="absolute top-0 left-0 h-[1px]"
        style={{ 
          background: 'linear-gradient(to right, transparent, hsl(42 80% 55% / 0.7) 40%, hsl(42 90% 70%) 60%, transparent)',
          width: '100%', 
          transformOrigin: 'left' 
        }}
        initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.3 }}
      />
      {/* Bottom */}
      <motion.div className="absolute bottom-0 right-0 h-[1px]"
        style={{ 
          background: 'linear-gradient(to left, transparent, hsl(42 80% 55% / 0.7) 40%, hsl(42 90% 70%) 60%, transparent)', 
          width: '100%',
          transformOrigin: 'right'
        }}
        initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
      />
    </>
  );
}

export function StorySection({ story }: StorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const floralY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const petals = [
    { x: 3,  delay: 0.0, duration: 8,  size: 18 },
    { x: 15, delay: 1.5, duration: 10, size: 14 },
    { x: 28, delay: 3.0, duration: 7,  size: 16 },
    { x: 45, delay: 0.8, duration: 9,  size: 20 },
    { x: 60, delay: 2.2, duration: 8,  size: 14 },
    { x: 75, delay: 1.0, duration: 11, size: 18 },
    { x: 88, delay: 3.5, duration: 7,  size: 16 },
    { x: 97, delay: 0.4, duration: 9,  size: 14 },
  ];

  const sparks = [
    { x: 8,  y: 15, delay: 0.5 },
    { x: 90, y: 20, delay: 1.2 },
    { x: 5,  y: 70, delay: 2.1 },
    { x: 92, y: 75, delay: 0.8 },
    { x: 50, y: 8,  delay: 1.7 },
    { x: 25, y: 85, delay: 3.0 },
    { x: 72, y: 90, delay: 1.4 },
  ];

  return (
    <section
      ref={ref}
      id="story"
      className="relative w-full overflow-hidden py-32 px-4"
      style={{ background: 'hsl(25 30% 5%)' }}
    >
      {/* ── Deep parallax gradient backdrop ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 90% 70% at 50% 30%, hsl(350 40% 18% / 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 10% 60%, hsl(42 50% 18% / 0.15) 0%, transparent 55%),
            radial-gradient(ellipse 60% 60% at 90% 60%, hsl(42 50% 18% / 0.15) 0%, transparent 55%)
          `,
        }} />
      </motion.div>

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, hsl(25 30% 3% / 0.85) 100%)',
      }} />

      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

      {/* ── Petals ── */}
      {petals.map((p, i) => <Petal key={i} {...p} />)}

      {/* ── Sparks ── */}
      {sparks.map((s, i) => <Spark key={i} {...s} />)}

      {/* ── Animated background mandala ── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ y: floralY, width: 500, height: 500 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full opacity-[0.04]">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <g key={i} transform={`rotate(${angle}, 250, 250)`}>
              <path d="M250,50 Q270,150 250,250 Q230,150 250,50Z" fill="hsl(42,80%,60%)" />
              <path d="M250,50 Q260,130 250,200 Q240,130 250,50Z" fill="hsl(42,90%,70%)" />
            </g>
          ))}
          <circle cx="250" cy="250" r="120" stroke="hsl(42,70%,55%)" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="80" stroke="hsl(42,70%,55%)" strokeWidth="0.3" />
        </svg>
      </motion.div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto"
        style={{ y: textY }}
      >
        {/* ── Label ── */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: -25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="uppercase font-sans text-xs"
            style={{ color: 'hsl(42 65% 55% / 0.55)', letterSpacing: '0.5em' }}
            initial={{ letterSpacing: '0.2em', opacity: 0 }}
            animate={isInView ? { letterSpacing: '0.5em', opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            How It Began
          </motion.p>
        </motion.div>

        {/* ── Ink underline ── */}
        <InkUnderline isInView={isInView} delay={0.5} />

        {/* ── Main title ── */}
        <div className="text-center mt-6 mb-4">
          {'Our Story'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block font-serif text-5xl md:text-7xl"
              style={{
                color: 'hsl(42 85% 68%)',
                textShadow: '0 0 50px hsl(42 80% 52% / 0.35)',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.7 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* ── Ornament divider ── */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <OrnamentDivider variant="floral" color="hsl(42,78%,55%)" />
        </motion.div>

        {/* ── Quill icon ── */}
        <QuillDraw isInView={isInView} />

        {/* ── Story card ── */}
        <motion.div
          className="relative px-8 md:px-20 py-12"
          style={{
            background: 'linear-gradient(135deg, hsl(25 28% 9% / 0.95) 0%, hsl(350 20% 8% / 0.9) 50%, hsl(25 25% 9% / 0.95) 100%)',
            border: '1px solid hsl(42 65% 45% / 0.25)',
            borderRadius: '2px',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated glow borders */}
          <motion.div
            className="absolute top-0 left-0 h-[1.5px] rounded-full"
            style={{ background: 'linear-gradient(to right, transparent, hsl(42 80% 58% / 0.8), transparent)' }}
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : {}}
            transition={{ duration: 1.6, delay: 0.7 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 h-[1.5px] rounded-full"
            style={{ background: 'linear-gradient(to left, transparent, hsl(42 80% 58% / 0.8), transparent)' }}
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : {}}
            transition={{ duration: 1.6, delay: 0.9 }}
          />
          <motion.div
            className="absolute top-0 left-0 w-[1px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, transparent, hsl(42 75% 55% / 0.5), transparent)' }}
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : {}}
            transition={{ duration: 1.2, delay: 1.1 }}
          />
          <motion.div
            className="absolute top-0 right-0 w-[1px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, transparent, hsl(42 75% 55% / 0.5), transparent)' }}
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : {}}
            transition={{ duration: 1.2, delay: 1.3 }}
          />

          {/* Corner accents */}
          {[
            'top-0 left-0 border-t border-l',
            'top-0 right-0 border-t border-r',
            'bottom-0 left-0 border-b border-l',
            'bottom-0 right-0 border-b border-r',
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute ${cls} w-8 h-8`}
              style={{ borderColor: 'hsl(42 78% 55% / 0.6)' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.5 + i * 0.08 }}
            />
          ))}

          {/* Side ornaments */}
          <SideOrnament side="left" isInView={isInView} />
          <SideOrnament side="right" isInView={isInView} />

          {/* Card Content: Grid Layout with Image and Story */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Romantic Image */}
            <motion.div 
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative p-2 bg-[#FCF6BA]/10 border border-[#FCF6BA]/30 rounded-lg shadow-2xl overflow-hidden max-w-sm w-full group">
                {/* Thin gold inner frame border */}
                <div className="absolute inset-1.5 border border-[#FCF6BA]/20 pointer-events-none z-10" />
                
                <motion.img 
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our Story" 
                  className="w-full h-[260px] md:h-[300px] object-cover rounded-md z-0 transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    filter: "sepia(12%) contrast(105%) brightness(92%)"
                  }}
                />
              </div>
            </motion.div>

            {/* Right: Story Text with Quotes */}
            <div className="lg:col-span-7 relative">
              {/* Opening quote */}
              <motion.div
                className="absolute -top-10 -left-6 font-serif text-7xl leading-none select-none opacity-20"
                style={{ color: 'hsl(42 75% 52%)' }}
                initial={{ opacity: 0, scale: 0.4, x: -20 }}
                animate={isInView ? { opacity: 0.2, scale: 1, x: 0 } : {}}
                transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                "
              </motion.div>

              <div className="relative z-10">
                <StoryText story={story} isInView={isInView} />
              </div>

              {/* Closing quote */}
              <motion.div
                className="absolute -bottom-10 -right-4 font-serif text-7xl leading-none select-none rotate-180 opacity-20"
                style={{ color: 'hsl(42 75% 52%)' }}
                initial={{ opacity: 0, scale: 0.4, x: 20 }}
                animate={isInView ? { opacity: 0.2, scale: 1, x: 0 } : {}}
                transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                "
              </motion.div>
            </div>
          </div>

          {/* Inner radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-sm"
            animate={{
              background: [
                'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(350 40% 18% / 0.08) 0%, transparent 70%)',
                'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(42 50% 20% / 0.12) 0%, transparent 70%)',
                'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(350 40% 18% / 0.08) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* ── Bottom seal ── */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.0 }}
        >
          <motion.div
            className="inline-flex items-center gap-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, hsl(42 70% 52% / 0.5))' }} />
            <motion.span
              className="font-serif text-2xl select-none"
              style={{ color: 'hsl(42 80% 58%)' }}
              animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ❦
            </motion.span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, hsl(42 70% 52% / 0.5))' }} />
          </motion.div>

          <motion.p
            className="font-serif text-base italic mt-4"
            style={{ color: 'hsl(42 60% 60% / 0.55)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 2.4 }}
          >
            Written in the stars, sealed with love
          </motion.p>
        </motion.div>

      </motion.div>
    </section>
  );
}
