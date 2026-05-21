import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CornerOrnament, OrnamentDivider, BackgroundCornerOrnaments } from "@/components/OrnamentalElements";

/* ─── Burst particle (Fireworks + Flowers) ─── */
interface ParticleData {
  id: number;
  type: "firework" | "petal";
  angle: number;
  speed: number;
  size: number;
  color: string;
  emoji?: string;
  spin?: number;
}

function BurstParticle({ p }: { p: ParticleData }) {
  const vx = Math.cos((p.angle * Math.PI) / 180) * p.speed;
  const vy = Math.sin((p.angle * Math.PI) / 180) * p.speed;
  
  if (p.type === "petal") {
    return (
      <motion.div
        className="absolute pointer-events-none select-none font-sans"
        style={{
          fontSize: p.size,
          top: "50%",
          left: "50%",
          marginTop: -p.size / 2,
          marginLeft: -p.size / 2,
          zIndex: 50,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
        animate={{ 
          x: [0, vx * 0.7, vx * 1.0, vx * 1.1 + Math.sin(p.id) * 30],
          y: [0, vy * 0.5, vy * 0.9 + 80, vy * 1.2 + 220],
          opacity: [1, 1, 0.8, 0],
          scale: [0.5, 1.2, 1.0, 0.4],
          rotate: [0, p.spin ? p.spin : 180, p.spin ? p.spin * 2.5 : 360],
        }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      >
        {p.emoji}
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: p.size,
          height: p.size,
          background: p.color,
          boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
          top: "50%",
          left: "50%",
          marginTop: -p.size / 2,
          marginLeft: -p.size / 2,
          zIndex: 60,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{ 
          x: [0, vx * 0.6, vx * 1.0, vx * 1.2],
          y: [0, vy * 0.6, vy * 1.0 + 30, vy * 1.2 + 80],
          opacity: [1, 0.9, 0.4, 0],
          scale: [1, 1.3, 0.7, 0]
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    );
  }
}

function generateBurst(): ParticleData[] {
  const fireworkColors = [
    "hsl(42, 100%, 65%)",
    "hsl(350, 95%, 60%)",
    "hsl(190, 95%, 60%)",
    "hsl(130, 95%, 60%)",
    "hsl(280, 100%, 65%)",
    "hsl(45, 100%, 75%)",
  ];
  const flowerEmojis = ["🌸", "🌹", "🏵️", "🌻", "🌺", "🌼"];
  
  const particles: ParticleData[] = [];
  
  for (let i = 0; i < 48; i++) {
    particles.push({
      id: i,
      type: "firework",
      angle: (i / 48) * 360 + Math.random() * 10,
      speed: 80 + Math.random() * 110,
      size: 3 + Math.random() * 5,
      color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
    });
  }
  
  for (let i = 0; i < 24; i++) {
    particles.push({
      id: 100 + i,
      type: "petal",
      angle: (i / 24) * 360 + Math.random() * 15,
      speed: 40 + Math.random() * 50,
      size: 14 + Math.random() * 12,
      color: "",
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 180),
    });
  }
  
  return particles;
}

/* ─── Floating sparkle in background ─── */
function BgSparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, background: "hsl(42 85% 65%)" }}
      animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 2 + delay % 3 }}
    />
  );
}

/* ─── Confetti piece ─── */
function Confetti({ delay, x }: { delay: number; x: number }) {
  const colors = ["hsl(42,90%,65%)", "hsl(350,70%,60%)", "hsl(200,80%,65%)", "hsl(130,60%,60%)", "hsl(280,70%,65%)"];
  const color = colors[Math.floor(delay * 7) % colors.length];
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: "-20px", width: 8, height: 8, background: color, borderRadius: 1 }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [0, 360, 720],
        x: [0, 20 * Math.sin(delay), -15 * Math.cos(delay)],
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: 3.5 + delay * 0.5, delay, repeat: Infinity, repeatDelay: 1 + delay % 2, ease: "linear" }}
    />
  );
}

const BG_SPARKLES = Array.from({ length: 20 }, (_, i) => ({
  x: 5 + (i * 4.7) % 90, y: 10 + (i * 8.3) % 80, delay: i * 0.4,
}));

const CONFETTI_DATA = Array.from({ length: 30 }, (_, i) => ({
  delay: i * 0.25, x: 2 + (i * 3.3) % 96,
}));

/* ─── Pulsing ring ─── */
function PulseRing({ size, delay }: { size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        border: "1.5px solid hsl(42 85% 55% / 0.45)",
        boxShadow: "0 0 20px hsl(42 85% 55% / 0.25)",
        top: "50%", left: "50%",
        marginTop: -size / 2, marginLeft: -size / 2,
      }}
      animate={{ scale: [1, 1.65], opacity: [0.65, 0] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

export function AcceptInvitationSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [accepted, setAccepted] = useState(false);
  const [burst, setBurst] = useState<ParticleData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  const handleAccept = useCallback(() => {
    if (accepted) return;
    setBurst(generateBurst());
    setShowConfetti(true);
    setAccepted(true);
    setTimeout(() => {
      setBurst([]);
    }, 3000);
  }, [accepted]);

  return (
    <section
      ref={ref}
      id="rsvp"
      className="relative w-full overflow-hidden py-28 px-4"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, hsl(25 30% 5%) 0%, hsl(28 25% 8%) 50%, hsl(25 30% 4%) 100%)",
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, hsl(42 80% 40% / 0.12) 0%, transparent 65%)" }} />

      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

      {/* Background sparkles */}
      {BG_SPARKLES.map((s, i) => <BgSparkle key={i} x={s.x} y={s.y} delay={s.delay} />)}

      {/* Confetti (shown after accept) */}
      <AnimatePresence>
        {showConfetti && CONFETTI_DATA.map((c, i) => <Confetti key={i} delay={c.delay} x={c.x} />)}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto">

        {/* Header */}
        <AnimatePresence>
          {!accepted && (
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: -20 }} 
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              transition={{ duration: 0.9 }}
            >
              <p 
                className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
                style={{ color: "hsl(42 70% 58% / 0.6)" }}
              >
                RSVP
              </p>
              <h2 
                className="font-serif text-4xl md:text-5xl italic mb-6"
                style={{ color: "hsl(42 85% 68%)" }}
              >
                Accept Invitation
              </h2>
              <OrnamentDivider variant="floral" color="hsl(42,80%,58%)" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main invitation card */}
        <motion.div
          className="relative flex flex-col items-center justify-center text-center py-12"
          style={{ y: cardY }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ─── Accept button area ─── */}
          <div className="relative flex justify-center w-full">
                {/* Burst particles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {burst.map(p => <BurstParticle key={p.id} p={p} />)}
                </div>

                {/* Pulse rings */}
                {!accepted && isInView && (
                  <>
                    <PulseRing size={260} delay={0} />
                    <PulseRing size={320} delay={0.8} />
                    <PulseRing size={380} delay={1.6} />
                  </>
                )}

                <AnimatePresence mode="wait">
                  {!accepted ? (
                    <motion.button
                      key="accept-btn"
                      onClick={handleAccept}
                      className="relative group cursor-pointer p-[12px] flex items-center justify-center"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {/* 1. Golden Aura Glow behind the button */}
                      <motion.div
                        className="absolute -inset-1 rounded-md opacity-50 blur-md pointer-events-none transition duration-500 group-hover:opacity-100 group-hover:blur-lg"
                        style={{
                          background: "linear-gradient(90deg, hsl(42 95% 55%), hsl(45 95% 68%), hsl(42 95% 55%))",
                        }}
                      />

                      {/* 2. Majestic Royal Mandala Aura & Sunburst Rings */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        {/* Layered Pulsing Sun Halos */}
                        <motion.div
                          className="absolute w-[220px] h-[220px] rounded-full pointer-events-none"
                          style={{
                            border: "1px solid hsl(42 95% 65% / 0.25)",
                            background: "radial-gradient(circle, hsl(42 95% 60% / 0.12) 0%, transparent 70%)",
                          }}
                          animate={{
                            scale: [0.85, 1.25],
                            opacity: [0.6, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                        <motion.div
                          className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
                          style={{
                            border: "1px dashed hsl(42 95% 65% / 0.15)",
                          }}
                          animate={{
                            scale: [0.95, 1.4],
                            opacity: [0.4, 0],
                          }}
                          transition={{
                            duration: 4.5,
                            delay: 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />

                        {/* Intricate Rotating Sacred Gold Mandala */}
                        <motion.div
                          className="absolute w-[270px] h-[270px] flex items-center justify-center opacity-45 group-hover:opacity-85 transition-all duration-700"
                          initial={{ scale: 0.9, rotate: 0 }}
                          animate={{ 
                            rotate: 360,
                            scale: [0.96, 1.04, 0.96]
                          }}
                          transition={{ 
                            rotate: { duration: 28, repeat: Infinity, ease: "linear" },
                            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
                            {/* Central geometric lattices */}
                            <circle cx="100" cy="100" r="25" stroke="url(#mandalaGold)" strokeWidth="0.75" strokeDasharray="2 2" />
                            <circle cx="100" cy="100" r="45" stroke="url(#mandalaGold)" strokeWidth="1.2" />
                            <circle cx="100" cy="100" r="75" stroke="url(#mandalaGold)" strokeWidth="0.8" strokeDasharray="1 3" />

                            {/* 12 Traditional Indian Scallop Petals */}
                            {Array.from({ length: 12 }).map((_, i) => {
                              const angle = (i * 360) / 12;
                              return (
                                <g key={i} transform={`rotate(${angle} 100 100)`}>
                                  <path d="M100,52 C95,62 92,72 100,77 C108,72 105,62 100,52 Z" fill="url(#mandalaGold)" opacity="0.45" />
                                  <circle cx="100" cy="46" r="1.5" fill="url(#mandalaGold)" />
                                </g>
                              );
                            })}

                            {/* 24 Outer Starburst points */}
                            {Array.from({ length: 24 }).map((_, i) => {
                              const angle = (i * 360) / 24;
                              return (
                                <g key={i} transform={`rotate(${angle} 100 100)`}>
                                  <path d="M100,20 L102,26 L98,26 Z" fill="url(#mandalaGold)" />
                                  <circle cx="100" cy="12" r="1" fill="url(#mandalaGold)" opacity="0.7" />
                                </g>
                              );
                            })}

                            <defs>
                              <linearGradient id="mandalaGold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                                <stop offset="50%" stopColor="hsl(45, 95%, 60%)" />
                                <stop offset="100%" stopColor="hsl(38, 85%, 45%)" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>
                      </div>

                      {/* 3. Deep Velvet Royal Crimson Plate */}
                      <div
                        className="relative px-12 py-5 overflow-hidden flex items-center justify-center gap-3 rounded-[4px]"
                        style={{
                          background: "linear-gradient(135deg, hsl(345 75% 16%) 0%, hsl(345 85% 8%) 100%)",
                          border: "1px solid hsl(42 85% 50% / 0.4)",
                          boxShadow: "inset 0 0 15px hsl(42 80% 50% / 0.5), 0 6px 20px hsl(0 0% 0% / 0.4)",
                        }}
                      >
                        {/* 4. Luxury Zari Embroidery Pattern Overlay */}
                        <svg className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="royalZari" width="60" height="60" patternUnits="userSpaceOnUse">
                              <path d="M0 30 L30 0 L60 30 L30 60 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                              <circle cx="30" cy="30" r="3" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="1" />
                              <path d="M30 25 L30 35 M25 30 L35 30 M26.5 26.5 L33.5 33.5 M26.5 33.5 L33.5 26.5" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                              <path d="M0 0 C 4 8, 8 4, 12 12 C 8 8, 4 4, 0 0 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                              <path d="M60 0 C 56 8, 52 4, 48 12 C 52 8, 56 4, 60 0 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                              <path d="M0 60 C 4 52, 8 56, 12 48 C 8 52, 4 56, 0 60 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                              <path d="M60 60 C 56 52, 52 56, 48 48 C 52 52, 56 56, 60 60 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#royalZari)" />
                        </svg>

                        {/* 5. Luxury Shimmer sweep across the velvet plate */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 85% / 0.3) 50%, transparent 70%)",
                          }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                        />

                        {/* 6. Continuous Rising Gold Dust particles (magical sparkles) */}
                        {Array.from({ length: 6 }).map((_, i) => {
                          const left = `${15 + i * 14}%`;
                          const delay = i * 0.35;
                          const duration = 2.2 + Math.random() * 1.2;
                          const scale = 0.5 + Math.random() * 0.7;
                          return (
                            <motion.div
                              key={i}
                              className="absolute pointer-events-none rounded-full"
                              style={{
                                left,
                                bottom: "0%",
                                width: "5px",
                                height: "5px",
                                background: "radial-gradient(circle, hsl(42, 100%, 75%) 0%, transparent 80%)",
                                boxShadow: "0 0 8px hsl(42 100% 70%)",
                                zIndex: 1,
                              }}
                              animate={{
                                y: ["0px", "-45px"],
                                opacity: [0, 0.9, 0],
                                scale: [0.4, scale, 0],
                              }}
                              transition={{
                                duration,
                                delay,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                            />
                          );
                        })}

                        {/* 7. Left pulsing golden royal star ornament */}
                        <motion.svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="relative z-10"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <path d="M12 21 C12 21 8 16 12 10 C16 16 12 21 12 21 Z" fill="url(#starGoldGradient)" />
                          <path d="M12 21 C12 21 5 18 8 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                          <path d="M12 21 C12 21 19 18 16 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                          <path d="M12 21 C12 21 2 20 5 16 C9 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                          <path d="M12 21 C12 21 22 20 19 16 C15 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                          <defs>
                            <linearGradient id="starGoldGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                              <stop offset="100%" stopColor="hsl(42, 85%, 45%)" />
                            </linearGradient>
                          </defs>
                        </motion.svg>

                        {/* 8. Button Text with gold shimmer style */}
                        <span
                          className="relative z-10 font-serif text-lg tracking-[0.2em] font-medium"
                          style={{
                            color: "hsl(42 90% 88%)",
                            textShadow: "0 2px 4px hsl(345 85% 4% / 0.5)",
                          }}
                        >
                          Accept Invitation
                        </span>

                        {/* 9. Right pulsing golden royal star ornament */}
                        <motion.svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="relative z-10"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                          <path d="M12 21 C12 21 8 16 12 10 C16 16 12 21 12 21 Z" fill="url(#starGoldGradient)" />
                          <path d="M12 21 C12 21 5 18 8 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                          <path d="M12 21 C12 21 19 18 16 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                          <path d="M12 21 C12 21 2 20 5 16 C9 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                          <path d="M12 21 C12 21 22 20 19 16 C15 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                        </motion.svg>
                      </div>

                      {/* 10. Architectural Rajasthani Mehrab Gate Frame Overlay */}
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <svg width="100%" height="100%" viewBox="0 0 360 108" preserveAspectRatio="none" fill="none" className="opacity-75 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500">
                          {/* Inner decorative dotted arch */}
                          <path d="M21,90 L21,48 C21,33 48,27 135,27 C152,27 167,20 180,11 C193,20 208,27 225,27 C312,27 339,33 339,48 L339,90" stroke="url(#goldGradientArch)" strokeWidth="1" strokeDasharray="3 3" />
                          
                          {/* Outer solid royal arch */}
                          <path d="M15,90 L15,45 C15,28 45,22 135,22 C155,22 170,14 180,4 C190,14 205,22 225,22 C315,22 345,28 345,45 L345,90" stroke="url(#goldGradientArch)" strokeWidth="1.5" />
                          
                          {/* Left and Right ornate pillar caps / minarets */}
                          <path d="M10,90 L26,90 L18,84 Z" fill="url(#goldGradientArch)" />
                          <path d="M334,90 L350,90 L342,84 Z" fill="url(#goldGradientArch)" />

                          {/* Top center beautiful Lotus Mandala Crest */}
                          <g transform="translate(168, -8)">
                            <path d="M12,18 C12,18 7,12 12,4 C17,12 12,18 12,18 Z" fill="url(#goldGradientArch)" />
                            <path d="M12,18 C12,18 4,14 6,7 C12,11 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.8" />
                            <path d="M12,18 C12,18 20,14 18,7 C12,11 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.8" />
                            <path d="M12,18 C12,18 1,17 2,12 C8,13 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.6" />
                            <path d="M12,18 C12,18 23,17 22,12 C16,13 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.6" />
                          </g>

                          <defs>
                            <linearGradient id="goldGradientArch" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                              <stop offset="35%" stopColor="hsl(45, 95%, 65%)" />
                              <stop offset="70%" stopColor="hsl(42, 85%, 45%)" />
                              <stop offset="100%" stopColor="hsl(42, 95%, 70%)" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="accepted-msg"
                      className="text-center py-8 flex flex-col items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Luxury Serif Thank You Banner */}
                      <motion.h2
                        className="font-serif text-5xl md:text-6xl tracking-widest mb-1 italic"
                        style={{
                          color: "transparent",
                          background: "linear-gradient(90deg, hsl(42 95% 72%), hsl(45 95% 85%), hsl(42 95% 72%))",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          textShadow: "0 4px 15px rgba(251,191,36,0.25)",
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                      >
                        Thank You
                      </motion.h2>

                      <motion.p
                        className="text-[10px] uppercase tracking-[0.35em] mb-6"
                        style={{ color: "hsl(42 60% 70% / 0.8)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                      >
                        Your presence is our greatest blessing
                      </motion.p>

                      {/* 1. Immersive Udaipur Lake Palace Illustration */}
                      <div className="relative w-full max-w-[280px] mx-auto mb-6 flex justify-center items-center">
                        <svg width="240" height="100" viewBox="0 0 240 100" fill="none" className="relative z-10 filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.15)]">
                          {/* Pulsing Sun behind the palace */}
                          <motion.circle
                            cx="120"
                            cy="50"
                            r="32"
                            fill="url(#goldSunGradient)"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.15, opacity: [0.2, 0.45, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          {/* Radial Mandala Rays */}
                          <motion.path
                            d="M120,10 L120,18 M120,82 L120,90 M80,50 L88,50 M152,50 L160,50 M92,22 L98,28 M148,22 L142,28 M92,78 L98,72 M148,78 L142,72"
                            stroke="hsl(42 85% 65% / 0.5)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            style={{ transformOrigin: "120px 50px" }}
                          />

                          {/* Lake Palace Silhouette (Jag Niwas) */}
                          <motion.path
                            d="M 15,65
                               L 30,65 L 30,50 L 42,50 L 42,65
                               L 65,65 L 65,42 L 72,42 L 72,36 C 72,30 77,27 81,27 C 85,27 90,30 90,36 L 90,42 L 98,42 L 98,65
                               L 108,65 L 108,32 L 112,32 L 112,25 C 112,16 119,12 124,12 C 129,12 136,16 136,25 L 136,32 L 140,32 L 140,65
                               L 150,65 L 150,42 L 158,42 L 158,36 C 158,30 163,27 167,27 C 171,27 176,30 176,36 L 176,42 L 182,42 L 182,65
                               L 210,65 L 210,50 L 222,50 L 222,65 L 235,65
                               L 235,70 L 15,70 Z"
                            fill="url(#goldPalaceGradient)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />

                          {/* Water waves ripples of Lake Pichola */}
                          <motion.path
                            d="M10,74 C30,71 50,77 70,74 C90,71 110,77 130,74 C150,71 170,77 190,74 C210,71 230,77 230,74"
                            stroke="url(#lakeRipplesGradient)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            animate={{ x: [-4, 4, -4] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.path
                            d="M15,80 C35,78 55,82 75,80 C95,78 115,82 135,80 C155,78 175,82 195,80 C215,78 225,80 225,80"
                            stroke="url(#lakeRipplesGradient)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity="0.6"
                            animate={{ x: [4, -4, 4] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          <defs>
                            <linearGradient id="goldSunGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                              <stop offset="100%" stopColor="hsl(42, 85%, 45% / 0)" />
                            </linearGradient>
                            <linearGradient id="goldPalaceGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                              <stop offset="50%" stopColor="hsl(42, 85%, 55%)" />
                              <stop offset="100%" stopColor="hsl(38, 80%, 40%)" />
                            </linearGradient>
                            <linearGradient id="lakeRipplesGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="hsl(42 85% 65% / 0.1)" />
                              <stop offset="50%" stopColor="hsl(42 85% 65% / 0.6)" />
                              <stop offset="100%" stopColor="hsl(42 85% 65% / 0.1)" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Sparkly Rising Gold Dust from the Lake */}
                        {Array.from({ length: 8 }).map((_, i) => {
                          const left = `${20 + i * 8.5}%`;
                          const delay = i * 0.45;
                          const duration = 2.5 + Math.random() * 1.5;
                          const scale = 0.4 + Math.random() * 0.6;
                          return (
                            <motion.div
                              key={i}
                              className="absolute pointer-events-none rounded-full"
                              style={{
                                left,
                                bottom: "25%",
                                width: "4px",
                                height: "4px",
                                background: "radial-gradient(circle, hsl(42, 100%, 75%) 0%, transparent 80%)",
                                boxShadow: "0 0 6px hsl(42 100% 70%)",
                                zIndex: 5,
                              }}
                              animate={{
                                y: ["0px", "-60px"],
                                opacity: [0, 0.85, 0],
                                scale: [0.3, scale, 0],
                              }}
                              transition={{
                                duration,
                                delay,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* 2. Success message headers */}
                      <motion.h3
                        className="font-serif text-3xl italic tracking-wide mb-2"
                        style={{
                          color: "hsl(42 90% 72%)",
                          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      >
                        We'll see you there!
                      </motion.h3>
                      
                      <motion.p
                        className="text-xs uppercase tracking-[0.35em] font-sans"
                        style={{ color: "hsl(42 70% 58% / 0.85)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                      >
                        Udaipur awaits your presence
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
        </motion.div>
      </div>
    </section>
  );
}

