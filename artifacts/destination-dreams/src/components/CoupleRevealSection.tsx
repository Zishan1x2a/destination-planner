import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { OrnamentDivider, CornerOrnament } from "@/components/OrnamentalElements";

interface CoupleRevealSectionProps {
  brideName: string;
  groomName: string;
}

/* ── Floating petal ── */
function Petal({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none select-none"
      style={{ left: `${x}%`, fontSize: size }}
      initial={{ y: -60, opacity: 0, rotate: 0 }}
      animate={{
        y: ["0%", "110vh"],
        opacity: [0, 0.85, 0.85, 0],
        rotate: [0, 180, 360],
        x: [0, 30, -20, 10],
      }}
      transition={{
        duration: 5 + Math.random() * 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4,
        ease: "linear",
      }}
    >
      🌸
    </motion.div>
  );
}

/* ── Sparkle dot ── */
function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1.4,
        delay,
        repeat: Infinity,
        repeatDelay: 2 + Math.random() * 3,
        ease: "easeInOut",
      }}
    />
  );
}

/* ── Ornate arch SVG in center ── */
function CenterArch() {
  return (
    <svg
      viewBox="0 0 200 320"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arch */}
      <path
        d="M30,320 L30,120 Q30,20 100,20 Q170,20 170,120 L170,320"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Inner arch */}
      <path
        d="M44,320 L44,126 Q44,38 100,38 Q156,38 156,126 L156,320"
        stroke="hsl(var(--primary))"
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Top floral cluster */}
      <circle cx="100" cy="22" r="6" fill="hsl(var(--primary))" opacity="0.8" />
      <circle cx="100" cy="22" r="10" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
      <circle cx="82" cy="32" r="4" fill="hsl(var(--primary))" opacity="0.5" />
      <circle cx="118" cy="32" r="4" fill="hsl(var(--primary))" opacity="0.5" />
      <circle cx="70" cy="50" r="3" fill="hsl(var(--primary))" opacity="0.4" />
      <circle cx="130" cy="50" r="3" fill="hsl(var(--primary))" opacity="0.4" />
      {/* Leaf sprigs on arch sides */}
      <path d="M30,160 Q10,150 15,135 Q25,145 30,160" fill="hsl(var(--primary))" opacity="0.35" />
      <path d="M170,160 Q190,150 185,135 Q175,145 170,160" fill="hsl(var(--primary))" opacity="0.35" />
      <path d="M30,200 Q8,190 12,172 Q24,184 30,200" fill="hsl(var(--primary))" opacity="0.25" />
      <path d="M170,200 Q192,190 188,172 Q176,184 170,200" fill="hsl(var(--primary))" opacity="0.25" />
      {/* Bottom pillars ornament */}
      <rect x="22" y="310" width="16" height="10" rx="2" fill="hsl(var(--primary))" opacity="0.3" />
      <rect x="162" y="310" width="16" height="10" rx="2" fill="hsl(var(--primary))" opacity="0.3" />
      {/* Center heart */}
      <path
        d="M100,175 C100,175 88,165 88,157 C88,150 94,146 100,152 C106,146 112,150 112,157 C112,165 100,175 100,175 Z"
        fill="hsl(var(--primary))"
        opacity="0.6"
      />
    </svg>
  );
}

/* ── Groom silhouette ── */
function GroomSilhouette() {
  return (
    <svg viewBox="0 0 220 480" className="w-full h-full" fill="none">
      {/* Head */}
      <ellipse cx="110" cy="68" rx="32" ry="36" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {/* Turban */}
      <path d="M78,58 Q80,28 110,26 Q140,28 142,58 Q130,50 110,50 Q90,50 78,58Z" fill="hsl(var(--primary) / 0.5)" />
      <path d="M78,56 Q88,48 110,47 Q132,48 142,56" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.8" />
      {/* Turban detail */}
      <path d="M142,52 Q155,36 150,28 Q140,24 132,34" fill="hsl(var(--primary) / 0.4)" />
      {/* Neck */}
      <rect x="100" y="102" width="20" height="18" rx="4" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Sherwani body */}
      <path d="M62,118 Q75,112 110,112 Q145,112 158,118 L168,280 Q140,290 110,290 Q80,290 52,280 Z"
        fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {/* Sherwani collar */}
      <path d="M95,112 L110,145 L125,112" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Sherwani buttons */}
      {[150,168,186,204].map((y, i) => (
        <circle key={i} cx="110" cy={y} r="3" fill="hsl(var(--primary))" opacity="0.5" />
      ))}
      {/* Dupatta / stole */}
      <path d="M62,120 Q40,160 38,220 Q40,240 60,250 Q70,200 70,160 Q68,140 62,120Z"
        fill="hsl(var(--primary) / 0.25)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
      {/* Arms */}
      <path d="M62,118 Q40,160 44,210 Q52,215 60,210 Q64,170 72,140Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <path d="M158,118 Q180,160 176,210 Q168,215 160,210 Q156,170 148,140Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Hands */}
      <ellipse cx="48" cy="218" rx="14" ry="10" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <ellipse cx="172" cy="218" rx="14" ry="10" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Legs */}
      <path d="M72,280 L65,420 Q75,428 90,420 L96,300 Z" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <path d="M148,280 L155,420 Q145,428 130,420 L124,300 Z" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Shoes */}
      <path d="M58,418 Q50,425 48,435 Q62,440 78,435 Q82,425 78,418Z" fill="hsl(var(--primary) / 0.35)" />
      <path d="M142,418 Q150,425 152,435 Q138,440 122,435 Q118,425 122,418Z" fill="hsl(var(--primary) / 0.35)" />
      {/* Sherwani lower detail */}
      <path d="M72,280 Q110,295 148,280 L145,320 Q110,335 75,320Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
    </svg>
  );
}

/* ── Bride silhouette ── */
function BrideSilhouette() {
  return (
    <svg viewBox="0 0 220 480" className="w-full h-full" fill="none">
      {/* Head */}
      <ellipse cx="110" cy="66" rx="28" ry="32" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {/* Hair top */}
      <path d="M82,52 Q85,30 110,28 Q135,30 138,52 Q125,44 110,44 Q95,44 82,52Z" fill="hsl(var(--primary) / 0.6)" />
      {/* Maang tikka */}
      <circle cx="110" cy="36" r="4" fill="hsl(var(--primary))" opacity="0.8" />
      <line x1="110" y1="36" x2="110" y2="28" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6" />
      {/* Dupatta over head */}
      <path d="M78,50 Q60,40 42,60 Q44,90 48,120 Q56,100 70,80 Q80,66 82,56Z"
        fill="hsl(var(--primary) / 0.3)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
      {/* Neck */}
      <rect x="100" y="96" width="20" height="16" rx="4" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Necklace */}
      <path d="M94,108 Q110,120 126,108" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="110" cy="120" r="3" fill="hsl(var(--primary))" opacity="0.6" />
      {/* Lehenga blouse */}
      <path d="M70,110 Q85,104 110,104 Q135,104 150,110 L155,175 Q135,182 110,182 Q85,182 65,175 Z"
        fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {/* Lehenga skirt — flared */}
      <path d="M66,175 Q50,200 36,310 Q38,330 110,330 Q182,330 184,310 Q170,200 154,175 Q135,182 110,182 Q85,182 66,175Z"
        fill="hsl(var(--primary) / 0.22)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {/* Skirt flare bottom */}
      <path d="M36,310 Q20,350 22,400 Q66,420 110,420 Q154,420 198,400 Q200,350 184,310 Q182,330 110,330 Q38,330 36,310Z"
        fill="hsl(var(--primary) / 0.3)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Lehenga embroidery lines */}
      <path d="M66,200 Q110,210 154,200" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M52,240 Q110,252 168,240" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M42,275 Q110,290 178,275" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none" opacity="0.25" />
      {/* Arms */}
      <path d="M70,112 Q46,150 48,195 Q56,200 65,195 Q68,158 76,132Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <path d="M150,112 Q174,150 172,195 Q164,200 155,195 Q152,158 144,132Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      {/* Bangles */}
      <ellipse cx="50" cy="192" rx="9" ry="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
      <ellipse cx="170" cy="192" rx="9" ry="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
      {/* Hands with mehndi hint */}
      <ellipse cx="46" cy="202" rx="12" ry="9" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <ellipse cx="174" cy="202" rx="12" ry="9" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1" />
    </svg>
  );
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  delay: i * 0.6,
  x: 5 + (i * 7) % 92,
  size: 14 + (i % 4) * 4,
}));

const SPARKLES = [
  { x: 48, y: 30, delay: 0.5 },
  { x: 52, y: 55, delay: 1.2 },
  { x: 46, y: 75, delay: 2.0 },
  { x: 54, y: 20, delay: 0.8 },
  { x: 50, y: 45, delay: 1.8 },
  { x: 44, y: 65, delay: 2.5 },
  { x: 56, y: 35, delay: 1.0 },
];

export function CoupleRevealSection({ brideName, groomName }: CoupleRevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [showNames, setShowNames] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setShowNames(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      id="couple"
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(180deg, hsl(25 30% 5%) 0%, hsl(25 28% 9%) 50%, hsl(25 30% 5%) 100%)" }}
    >
      {/* Falling petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {PETALS.map(p => <Petal key={p.id} delay={p.delay} x={p.x} size={p.size} />)}
      </div>

      {/* Sparkles near center */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {SPARKLES.map((s, i) => <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} />)}
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 70% at 50% 50%, hsl(42 85% 52% / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Main layout ── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">

        {/* Top label */}
        <motion.p
          className="text-center tracking-[0.35em] uppercase text-xs mb-8 text-primary/70 font-sans"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Together in love
        </motion.p>

        {/* Three-column: groom | arch | bride */}
        <div className="w-full flex items-end justify-center gap-0 md:gap-4">

          {/* ── Groom (slides from left) ── */}
          <motion.div
            className="flex flex-col items-center flex-1 max-w-[260px] md:max-w-[320px]"
            initial={{ x: -160, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Groom name */}
            <motion.div
              className="mb-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={showNames ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary/60 uppercase tracking-[0.25em] text-xs font-sans mb-1">The Groom</p>
              <h3 className="font-serif text-2xl md:text-3xl text-primary italic">{groomName.split(" ")[0]}</h3>
            </motion.div>

            {/* Groom portrait frame */}
            <div className="relative w-full aspect-[3/5]">
              {/* Ornate portrait frame */}
              <div
                className="absolute inset-0 rounded-t-full"
                style={{
                  border: "2px solid hsl(var(--primary) / 0.7)",
                  boxShadow: "0 0 30px hsl(42 85% 52% / 0.15), inset 0 0 20px hsl(42 85% 52% / 0.05)",
                  background: "linear-gradient(180deg, hsl(25 25% 11%) 0%, hsl(25 22% 8%) 100%)",
                }}
              />
              <div
                className="absolute inset-[6px] rounded-t-full pointer-events-none"
                style={{ border: "0.5px solid hsl(var(--primary) / 0.3)" }}
              />
              {/* Corner ornaments on frame */}
              <CornerOrnament position="bl" color="hsl(var(--primary))" size={36} />
              <CornerOrnament position="br" color="hsl(var(--primary))" size={36} />

              {/* Silhouette */}
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <div className="w-full h-full px-4 pt-6">
                  <GroomSilhouette />
                </div>
              </div>

              {/* Gold shimmer overlay */}
              <motion.div
                className="absolute inset-0 rounded-t-full pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, hsl(42 85% 52% / 0.06) 0%, transparent 60%)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* ── Center Arch ── */}
          <motion.div
            className="flex flex-col items-center justify-end shrink-0 z-30"
            style={{ width: "clamp(80px, 16vw, 160px)", marginBottom: 0 }}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ height: "clamp(200px, 40vw, 380px)", width: "100%" }}>
              <CenterArch />
            </div>
          </motion.div>

          {/* ── Bride (slides from right) ── */}
          <motion.div
            className="flex flex-col items-center flex-1 max-w-[260px] md:max-w-[320px]"
            initial={{ x: 160, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Bride name */}
            <motion.div
              className="mb-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={showNames ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              <p className="text-primary/60 uppercase tracking-[0.25em] text-xs font-sans mb-1">The Bride</p>
              <h3 className="font-serif text-2xl md:text-3xl text-primary italic">{brideName.split(" ")[0]}</h3>
            </motion.div>

            {/* Bride portrait frame */}
            <div className="relative w-full aspect-[3/5]">
              <div
                className="absolute inset-0 rounded-t-full"
                style={{
                  border: "2px solid hsl(var(--primary) / 0.7)",
                  boxShadow: "0 0 30px hsl(42 85% 52% / 0.15), inset 0 0 20px hsl(42 85% 52% / 0.05)",
                  background: "linear-gradient(180deg, hsl(25 25% 11%) 0%, hsl(25 22% 8%) 100%)",
                }}
              />
              <div
                className="absolute inset-[6px] rounded-t-full pointer-events-none"
                style={{ border: "0.5px solid hsl(var(--primary) / 0.3)" }}
              />
              <CornerOrnament position="bl" color="hsl(var(--primary))" size={36} />
              <CornerOrnament position="br" color="hsl(var(--primary))" size={36} />

              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <div className="w-full h-full px-4 pt-6">
                  <BrideSilhouette />
                </div>
              </div>

              <motion.div
                className="absolute inset-0 rounded-t-full pointer-events-none"
                style={{
                  background: "linear-gradient(225deg, hsl(42 85% 52% / 0.06) 0%, transparent 60%)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Center name reunion text ── */}
        <AnimatePresence>
          {showNames && (
            <motion.div
              className="mt-10 text-center flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <OrnamentDivider variant="floral" color="hsl(var(--primary))" />

              <motion.h2
                className="font-serif text-4xl md:text-6xl text-primary mt-4"
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.04em", opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {groomName.split(" ")[0]}
                <span className="mx-4 md:mx-6 text-primary/50">&</span>
                {brideName.split(" ")[0]}
              </motion.h2>

              <motion.p
                className="text-primary/60 uppercase tracking-[0.3em] text-xs font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Two souls, one journey
              </motion.p>

              <OrnamentDivider variant="diamond" color="hsl(var(--primary))" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll cue */}
        <motion.a
          href="#story"
          className="mt-10 flex flex-col items-center gap-2 text-primary/50 hover:text-primary transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="uppercase tracking-[0.3em] text-xs font-sans">Our Story</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3 L10 17 M4 11 L10 17 L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
