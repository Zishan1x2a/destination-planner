import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { OrnamentDivider } from '@/components/OrnamentalElements';

interface DestinationSectionProps {
  description: string;
  facts: string[];
  googleMapsUrl: string;
}

/* ─── Animated gold particle ─── */
function GoldParticle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        background: `radial-gradient(circle, hsl(42 90% 65%) 0%, hsl(42 80% 50%) 60%, transparent 100%)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Animated lotus ─── */
function FloatingLotus({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-2xl"
      style={{ left: `${x}%`, bottom: '8%' }}
      animate={{ y: [0, -18, 0], rotate: [-5, 5, -5], opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      🪷
    </motion.div>
  );
}

/* ─── Udaipur palace SVG silhouette ─── */
function PalaceSilhouette({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="w-full flex justify-center mt-12 mb-8"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg viewBox="0 0 900 280" className="w-full max-w-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Reflection / water ripple */}
        <motion.g
          animate={{ scaleY: [1, 1.04, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '450px 240px' }}
        >
          <rect x="0" y="240" width="900" height="40" fill="hsl(42 60% 40% / 0.12)" rx="2" />
          <rect x="60" y="246" width="780" height="8" fill="hsl(42 70% 50% / 0.08)" rx="4" />
          <rect x="120" y="258" width="660" height="5" fill="hsl(42 70% 50% / 0.06)" rx="4" />
        </motion.g>

        {/* Main palace body */}
        <motion.path
          d="M100,240 L100,160 L130,160 L130,120 L140,110 L150,120 L150,140 L170,140 L170,100 L180,90 L190,100 L190,140
             L220,140 L220,120 L240,80 L260,120 L260,140 L280,140 L280,160 L320,160 L320,180
             L350,180 L350,140 L360,120 L380,80 L400,60 L420,80 L440,120 L450,140 L450,180
             L480,180 L480,160 L520,160 L520,140 L540,140 L540,120 L560,80 L580,120 L580,140
             L600,140 L600,100 L610,90 L620,100 L620,140 L650,140 L650,120 L660,100 L670,120 L670,160
             L700,160 L700,120 L710,110 L720,100 L730,110 L740,120 L740,160 L760,160 L760,120 L770,110 L780,120 L780,240 Z"
          fill="hsl(42 40% 18% / 0.9)"
          stroke="hsl(42 75% 52%)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2.5, delay: 0.8, ease: 'easeInOut' }}
        />

        {/* Central dome */}
        <motion.ellipse
          cx="400" cy="58" rx="32" ry="18"
          fill="hsl(42 50% 22%)"
          stroke="hsl(42 80% 58%)"
          strokeWidth="0.8"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '400px 58px' }}
        />

        {/* Dome finial */}
        <motion.line
          x1="400" y1="40" x2="400" y2="20"
          stroke="hsl(42 85% 62%)"
          strokeWidth="1.5"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 2.8 }}
          style={{ transformOrigin: '400px 40px' }}
        />
        <motion.circle
          cx="400" cy="18" r="4"
          fill="hsl(42 90% 65%)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 3.0 }}
          style={{ transformOrigin: '400px 18px' }}
        />

        {/* Arched windows — row 1 */}
        {[200, 250, 340, 390, 450, 540, 590, 640].map((cx, i) => (
          <motion.path
            key={`arch-${i}`}
            d={`M${cx - 10},160 L${cx - 10},145 Q${cx},132 ${cx + 10},145 L${cx + 10},160 Z`}
            fill="hsl(42 70% 52% / 0.3)"
            stroke="hsl(42 80% 55% / 0.5)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 2.0 + i * 0.08 }}
          />
        ))}

        {/* Decorative battlements */}
        {[120, 150, 180, 300, 360, 420, 480, 540, 600, 660, 720, 760].map((x, i) => (
          <motion.rect
            key={`batt-${i}`}
            x={x} y={155} width="8" height="10"
            fill="hsl(42 50% 20%)"
            stroke="hsl(42 75% 50% / 0.4)"
            strokeWidth="0.4"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 2.6 + i * 0.04 }}
            style={{ transformOrigin: `${x + 4}px 160px` }}
          />
        ))}

        {/* Glow along the palace top */}
        <motion.path
          d="M100,160 L780,160"
          stroke="hsl(42 85% 55%)"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, delay: 1.8, ease: 'easeInOut' }}
        />

        {/* Water line */}
        <motion.line
          x1="50" y1="240" x2="850" y2="240"
          stroke="hsl(42 70% 50%)"
          strokeWidth="0.6"
          opacity="0.35"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 2.5 }}
          style={{ transformOrigin: '450px 240px' }}
        />
      </svg>
    </motion.div>
  );
}

/* ─── Animated shimmer banner ─── */
function ShimmerBand({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <motion.div
      className="relative overflow-hidden h-[1px] w-full my-2"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.2, delay, ease: 'easeInOut' }}
      style={{ transformOrigin: 'left' }}
    >
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, transparent, hsl(42 80% 55% / 0.7) 30%, hsl(42 90% 70%) 50%, hsl(42 80% 55% / 0.7) 70%, transparent)',
      }} />
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, transparent, hsl(42 100% 80% / 0.5), transparent)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 1 }}
      />
    </motion.div>
  );
}

export function DestinationSection({ description, facts, googleMapsUrl }: DestinationSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const particles = [
    { x: 5, y: 20, size: 4, delay: 0.2, duration: 4 },
    { x: 12, y: 65, size: 3, delay: 1.1, duration: 5 },
    { x: 88, y: 30, size: 5, delay: 0.6, duration: 4.5 },
    { x: 93, y: 70, size: 3, delay: 1.8, duration: 3.8 },
    { x: 50, y: 15, size: 4, delay: 0.9, duration: 5.2 },
    { x: 70, y: 80, size: 3, delay: 2.1, duration: 4.2 },
    { x: 30, y: 85, size: 4, delay: 0.4, duration: 4.8 },
    { x: 80, y: 10, size: 3, delay: 1.5, duration: 3.5 },
    { x: 20, y: 40, size: 2, delay: 0.7, duration: 6 },
    { x: 60, y: 90, size: 3, delay: 1.3, duration: 4.6 },
  ];

  return (
    <section
      ref={ref}
      id="destination"
      className="relative w-full overflow-hidden py-32 px-4"
      style={{ background: 'hsl(25 30% 5%)' }}
    >
      {/* ── Deep parallax backdrop ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 20%, hsl(42 60% 25% / 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 80%, hsl(350 40% 20% / 0.1) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 80% 80%, hsl(42 50% 20% / 0.1) 0%, transparent 55%)
          `,
        }}
      />

      {/* ── Corner vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, hsl(25 30% 3% / 0.8) 100%)',
      }} />

      {/* ── Gold particles ── */}
      {particles.map((p, i) => <GoldParticle key={i} {...p} />)}

      {/* ── Floating lotuses ── */}
      {[8, 22, 40, 60, 78, 92].map((x, i) => (
        <FloatingLotus key={i} x={x} delay={i * 0.7} />
      ))}

      {/* ── Animated corner ornaments ── */}
      {[
        { pos: 'top-6 left-6', rot: 0 },
        { pos: 'top-6 right-6', rot: 90 },
        { pos: 'bottom-16 left-6', rot: 270 },
        { pos: 'bottom-16 right-6', rot: 180 },
      ].map(({ pos, rot }, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-16 h-16`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
          style={{ transform: `rotate(${rot}deg)` }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2,2 L2,22 M2,2 L22,2" stroke="hsl(42 75% 52%)" strokeWidth="1.2" opacity="0.6" />
            <path d="M2,8 Q12,8 12,18" stroke="hsl(42 70% 50%)" strokeWidth="0.6" opacity="0.4" />
            <circle cx="2" cy="2" r="2" fill="hsl(42 80% 58%)" opacity="0.7" />
            <circle cx="14" cy="14" r="1.2" fill="hsl(42 80% 58%)" opacity="0.4" />
          </svg>
        </motion.div>
      ))}

      <motion.div className="relative z-10 max-w-5xl mx-auto" style={{ y: textY }}>

        {/* ── Top label ── */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="uppercase tracking-[0.55em] text-xs font-sans"
            style={{ color: 'hsl(42 70% 58% / 0.55)' }}
            initial={{ letterSpacing: '0.2em', opacity: 0 }}
            animate={isInView ? { letterSpacing: '0.55em', opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            The Venue
          </motion.p>
        </motion.div>

        <ShimmerBand isInView={isInView} delay={0.4} />

        {/* ── Main title ── */}
        <div className="text-center my-8">
          {'Udaipur, Rajasthan'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block font-serif text-5xl md:text-7xl"
              style={{ color: 'hsl(42 85% 68%)', textShadow: '0 0 40px hsl(42 85% 52% / 0.4)' }}
              initial={{ opacity: 0, y: 40, rotateX: 90 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* ── Gold subtitle tag ── */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <div className="flex items-center gap-3 px-5 py-2"
            style={{ border: '1px solid hsl(42 70% 50% / 0.35)', background: 'hsl(42 40% 12% / 0.6)' }}>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: 'hsl(42 80% 60%)' }}
            >✦</motion.span>
            <span className="font-sans text-xs uppercase tracking-[0.35em]"
              style={{ color: 'hsl(42 65% 62% / 0.7)' }}>
              City of Lakes · Rajasthan, India
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              style={{ color: 'hsl(42 80% 60%)' }}
            >✦</motion.span>
          </div>
        </motion.div>

        <ShimmerBand isInView={isInView} delay={1.0} />

        {/* ── Palace silhouette ── */}
        <PalaceSilhouette isInView={isInView} />

        {/* ── Description ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <OrnamentDivider variant="floral" color="hsl(42,75%,55%)" />
          <p className="font-serif text-lg md:text-xl italic leading-relaxed mt-8"
            style={{ color: 'hsl(42 55% 72% / 0.85)' }}>
            {description}
          </p>
        </motion.div>

        {/* ── Facts grid ── */}
        <div className="grid md:grid-cols-2 gap-4 mb-16 max-w-3xl mx-auto">
          {facts.map((fact, i) => (
            <motion.div
              key={i}
              className="relative flex items-start gap-4 p-5"
              style={{
                background: 'linear-gradient(135deg, hsl(42 30% 10% / 0.8) 0%, hsl(25 20% 8% / 0.8) 100%)',
                border: '1px solid hsl(42 65% 45% / 0.25)',
                borderRadius: '2px',
              }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, y: 20 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.8 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, borderColor: 'hsl(42 70% 50% / 0.5)', transition: { duration: 0.25 } }}
            >
              {/* Fact number */}
              <motion.div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-serif text-sm"
                style={{
                  background: 'hsl(42 40% 14%)',
                  border: '1px solid hsl(42 75% 50% / 0.4)',
                  color: 'hsl(42 85% 62%)',
                }}
                animate={{ boxShadow: ['0 0 0px hsl(42 80% 52% / 0)', '0 0 10px hsl(42 80% 52% / 0.3)', '0 0 0px hsl(42 80% 52% / 0)'] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              >
                {String(i + 1).padStart(2, '0')}
              </motion.div>

              <p className="font-serif text-base leading-relaxed"
                style={{ color: 'hsl(42 55% 70% / 0.85)' }}>
                {fact}
              </p>

              {/* Bottom shimmer */}
              <motion.div
                className="absolute bottom-0 left-0 h-[1px]"
                style={{ background: 'linear-gradient(to right, hsl(42 80% 55% / 0.4), transparent)' }}
                initial={{ width: 0 }}
                animate={isInView ? { width: '60%' } : {}}
                transition={{ duration: 1, delay: 2.2 + i * 0.12 }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Google Maps CTA ── */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.4 }}
        >
          <motion.a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-3 px-10 py-4 font-sans text-sm uppercase tracking-[0.3em] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(42 70% 36%) 0%, hsl(38 75% 30%) 100%)',
              border: '1px solid hsl(42 75% 52% / 0.6)',
              borderRadius: '2px',
              color: 'hsl(42 90% 88%)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(42 90% 75% / 0.2) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: '0 0 0px hsl(42 80% 52% / 0)' }}
              whileHover={{ boxShadow: '0 0 30px hsl(42 80% 52% / 0.4)' }}
              transition={{ duration: 0.3 }}
            />
            <MapPin size={16} />
            <span>View on Google Maps</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >→</motion.span>
          </motion.a>
        </motion.div>

      </motion.div>
    </section>
  );
}
