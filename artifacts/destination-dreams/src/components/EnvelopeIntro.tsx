import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeIntroProps {
  coupleName: string;
  weddingDate: string;
  destination: string;
  onComplete: () => void;
}

/* ─── Phases ─── */
type Phase = "idle" | "glow" | "breaking" | "opening" | "rising" | "reveal" | "done";

/* ─── Seal burst particle ─── */
function SealParticle({ angle, dist, delay, color }: { angle: number; dist: number; delay: number; color: string }) {
  const rad = (angle * Math.PI) / 180;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 6, height: 6, background: color, top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ 
        x: Math.cos(rad) * dist, 
        y: Math.sin(rad) * dist, 
        scale: [1, 1.5, 0], 
        opacity: [1, 0.8, 0],
        rotate: angle * 2
      }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/* ─── Seal Shockwave ─── */
function SealShockwave({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border-2 pointer-events-none"
      style={{ 
        borderColor: "hsl(42, 85%, 60%)", 
        width: 40, height: 40, 
        top: "50%", left: "50%", 
        marginTop: -20, marginLeft: -20 
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 4, opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  );
}

/* ─── Gold sparkle ─── */
function GoldSparkle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], rotate: [0, 45] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 2 + (delay % 2.5) }}
    >
      <svg viewBox="0 0 10 10" fill="none" width={size} height={size}>
        <path d="M5,0 L5.8,4.2 L10,5 L5.8,5.8 L5,10 L4.2,5.8 L0,5 L4.2,4.2 Z" fill="hsl(42,88%,65%)" opacity="0.9" />
      </svg>
    </motion.div>
  );
}

/* ─── Floating petal ─── */
function Petal({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute top-[-30px] select-none pointer-events-none text-base"
      style={{ left: `${x}%` }}
      animate={{ y: ["0vh", "105vh"], x: [0, 30, -20, 10], opacity: [0, 0.85, 0.85, 0], rotate: [0, 270] }}
      transition={{ duration: 6 + (delay % 2), delay, ease: "linear", repeat: Infinity, repeatDelay: 3 }}
    >
      {["🌸", "🌺", "✿"][Math.floor(x / 34)]}
    </motion.div>
  );
}

/* ─── Ambient rising orb ─── */
function RisingOrb({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none rounded-full"
      style={{ left: `${x}%`, width: 4 + (delay % 3), height: 4 + (delay % 3), background: "hsl(42 85% 60% / 0.5)" }}
      animate={{ y: [0, -120], opacity: [0, 0.7, 0] }}
      transition={{ duration: 3 + delay, delay, repeat: Infinity, repeatDelay: 1.5 + delay * 0.4, ease: "easeOut" }}
    />
  );
}

/* ─── Envelope corner ornament ─── */
function CornerOrnament({ pos, size = 56 }: { pos: "tl" | "tr" | "bl" | "br"; size?: number }) {
  const style: React.CSSProperties = {
    position: "absolute",
    ...(pos.startsWith("t") ? { top: 8 } : { bottom: 8 }),
    ...(pos.endsWith("l") ? { left: 8 } : { right: 8 }),
    transform: pos === "tr" ? "scaleX(-1)" : pos === "bl" ? "scaleY(-1)" : pos === "br" ? "scale(-1,-1)" : undefined,
    transformOrigin: pos === "tr" ? "right top" : pos === "bl" ? "left bottom" : pos === "br" ? "right bottom" : undefined,
    pointerEvents: "none",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={style}>
      <path d="M2,2 L2,26 Q2,4 26,4 L4,4 L4,2 Z" fill="url(#royalGold)" opacity="0.95" />
      <path d="M2,2 L2,34 Q2,2 34,2" fill="none" stroke="url(#royalGold)" strokeWidth="1" opacity="0.7" />
      <path d="M2,2 L2,20 Q2,8 20,8 L8,8 L8,2 Z" fill="none" stroke="url(#royalGold)" strokeWidth="0.8" opacity="0.6" />
      <circle cx="2" cy="2" r="3" fill="url(#royalGold)" />
      <circle cx="12" cy="3" r="1.5" fill="url(#royalGold)" opacity="0.8" />
      <circle cx="3" cy="12" r="1.5" fill="url(#royalGold)" opacity="0.8" />
      <circle cx="20" cy="4" r="1" fill="url(#royalGold)" opacity="0.6" />
      <circle cx="4" cy="20" r="1" fill="url(#royalGold)" opacity="0.6" />
    </svg>
  );
}

/* ─── Damask repeating background ─── */
function DamaskBg({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id="env-damask" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M36,4 Q46,18 36,28 Q26,18 36,4Z" fill="#BF953F" />
          <path d="M36,44 Q46,58 36,68 Q26,58 36,44Z" fill="#BF953F" />
          <path d="M4,36 Q18,46 28,36 Q18,26 4,36Z" fill="#BF953F" />
          <path d="M44,36 Q58,46 68,36 Q58,26 44,36Z" fill="#BF953F" />
          <circle cx="36" cy="36" r="5" fill="#FCF6BA" />
          <circle cx="36" cy="36" r="2" fill="#FFF" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#env-damask)" />
    </svg>
  );
}

/* ─── Lotus SVG center for wax seal ─── */
function LotusIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20,32 Q14,28 12,20 Q16,24 20,22 Q24,24 28,20 Q26,28 20,32Z" fill="hsl(42,85%,72%)" opacity="0.9" />
      <path d="M20,30 Q10,22 10,14 Q15,20 20,18 Q25,20 30,14 Q30,22 20,30Z" fill="hsl(42,82%,68%)" opacity="0.8" />
      <path d="M20,28 Q8,16 12,8 Q16,16 20,14 Q24,16 28,8 Q32,16 20,28Z" fill="hsl(42,80%,65%)" opacity="0.75" />
      <circle cx="20" cy="20" r="5" fill="hsl(42,90%,75%)" opacity="0.95" />
      <circle cx="20" cy="20" r="2.5" fill="hsl(25,35%,12%)" />
    </svg>
  );
}

/* ─── Full invitation card ─── */
function InvitationCard({ show, coupleName, weddingDate, destination }: {
  show: boolean; coupleName: string; weddingDate: string; destination: string;
}) {
  const goldText = {
    background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at top, #7A0A14 0%, #4A0005 60%, #2A0000 100%)", boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)" }}>

      {/* Texture watermark */}
      <DamaskBg opacity={0.06} />

      {/* Outer gold border */}
      <div className="absolute inset-[10px] pointer-events-none"
        style={{ border: "1.5px solid #BF953F", boxShadow: "0 0 15px rgba(191,149,63,0.3), inset 0 0 15px rgba(191,149,63,0.2)" }} />
      {/* Inner gold border */}
      <div className="absolute inset-[16px] pointer-events-none"
        style={{ border: "1px dashed rgba(252,246,186,0.3)" }} />

      {/* Corner ornaments on card */}
      <CornerOrnament pos="tl" size={44} />
      <CornerOrnament pos="tr" size={44} />
      <CornerOrnament pos="bl" size={44} />
      <CornerOrnament pos="br" size={44} />

      {/* Top gold sweep line */}
      <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(to right, transparent 5%, #BF953F 40%, #FCF6BA 50%, #BF953F 60%, transparent 95%)" }}
        initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }} />

      {/* Bottom gold sweep line */}
      <motion.div className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(to right, transparent 5%, #BF953F 40%, #FCF6BA 50%, #BF953F 60%, transparent 95%)" }}
        initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.0, delay: 0.35, ease: "easeOut" }} />

      {/* Card text content */}
      <div className="relative z-10 flex flex-col items-center px-10 py-6 text-center gap-2">
        {/* Dynamic Shadow Overlay — darkens when inside envelope */}
        <motion.div 
          className="absolute inset-0 z-[5] pointer-events-none"
          initial={{ background: "rgba(0,0,0,0.8)" }}
          animate={show ? { background: "rgba(0,0,0,0)" } : { background: "rgba(0,0,0,0.8)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Sanskrit blessing */}
        <motion.p
          className="font-serif italic text-[11px] tracking-[0.15em]"
          style={{ color: "#FCF6BA", opacity: 0.75 }}
          initial={{ opacity: 0, y: -8 }} animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}>
          ॐ श्री गणेशाय नमः
        </motion.p>

        {/* Top ornament rule */}
        <motion.div className="flex items-center gap-3 w-full"
          initial={{ opacity: 0, scaleX: 0 }} animate={show ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #BF953F)" }} />
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8,1 L9.5,6 L15,6 L10.5,9.5 L12,14.5 L8,11.5 L4,14.5 L5.5,9.5 L1,6 L6.5,6 Z" fill="url(#royalGold)" opacity="0.9" /></svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #BF953F)" }} />
        </motion.div>

        {/* Dear Guest & Cordially invited */}
        <motion.div className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 6 }} animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.52, duration: 0.5 }}>
          <p className="font-serif italic text-[15px] font-medium" style={{ color: "#FCF6BA", letterSpacing: "0.08em", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            Dear Guest,
          </p>
          <p className="uppercase tracking-[0.25em] text-[8px] font-sans" style={{ color: "#FBF5B7", opacity: 0.85 }}>
            you are cordially invited to celebrate
          </p>
        </motion.div>

        {/* "The wedding of" */}
        <motion.p className="font-serif italic text-sm"
          style={{ color: "#BF953F", letterSpacing: "0.06em" }}
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 0.62, duration: 0.5 }}>
          the wedding of
        </motion.p>

        {/* Couple name */}
        <motion.h2
          style={{ 
            fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 500, fontStyle: "italic", 
            lineHeight: 1.05, letterSpacing: "0.02em",
            ...goldText, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
          }}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={show ? { opacity: 1, y: 0, filter: "blur(0px) drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" } : {}}
          transition={{ delay: 0.72, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          {coupleName}
        </motion.h2>

        {/* Diamond divider */}
        <motion.div className="flex items-center gap-2.5 w-full"
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 0.92, duration: 0.5 }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #BF953F)" }} />
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6,0 L12,6 L6,12 L0,6 Z" fill="url(#royalGold)" opacity="0.85" /></svg>
          <svg width="7" height="7" viewBox="0 0 7 7"><path d="M3.5,0 L7,3.5 L3.5,7 L0,3.5 Z" fill="#FCF6BA" opacity="0.6" /></svg>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6,0 L12,6 L6,12 L0,6 Z" fill="url(#royalGold)" opacity="0.85" /></svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #BF953F)" }} />
        </motion.div>

        {/* Date */}
        <motion.p className="uppercase tracking-[0.25em] text-[10px] font-sans font-medium"
          style={{ color: "#FCF6BA", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0, y: 5 }} animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.02, duration: 0.5 }}>
          {weddingDate}
        </motion.p>

        {/* Destination */}
        <motion.p
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "#BF953F", letterSpacing: "0.08em" }}
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.12, duration: 0.5 }}>
          {destination}
        </motion.p>

        {/* Bottom ornament rule */}
        <motion.div className="flex items-center gap-3 w-full"
          initial={{ opacity: 0, scaleX: 0 }} animate={show ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 1.22, duration: 0.7 }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #BF953F)" }} />
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M11,1 Q14,7 22,7 Q14,7 11,13 Q8,7 0,7 Q8,7 11,1Z" fill="url(#royalGold)" opacity="0.85" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #BF953F)" }} />
        </motion.div>

        {/* "With love" footer */}
        <motion.p className="font-serif italic text-[10px]"
          style={{ color: "#FBF5B7", opacity: 0.65, letterSpacing: "0.12em" }}
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.35, duration: 0.5 }}>
          With love & joy — Myra and Aryan
        </motion.p>
      </div>
    </div>
  );
}

/* ─── Static data ─── */
const SPARKLES = [
  { x: 5, y: 10, delay: 0.3, size: 8 }, { x: 92, y: 15, delay: 1.1, size: 6 },
  { x: 8, y: 45, delay: 1.8, size: 7 }, { x: 94, y: 50, delay: 0.6, size: 9 },
  { x: 4, y: 80, delay: 2.2, size: 6 }, { x: 96, y: 75, delay: 1.5, size: 8 },
  { x: 50, y: 4, delay: 0.8, size: 7 }, { x: 50, y: 94, delay: 2.0, size: 6 },
  { x: 20, y: 5, delay: 1.3, size: 5 }, { x: 80, y: 5, delay: 0.5, size: 5 },
  { x: 18, y: 92, delay: 2.5, size: 6 }, { x: 78, y: 90, delay: 1.0, size: 7 },
];
const ORBS = [3, 10, 18, 27, 36, 46, 55, 63, 72, 80, 88, 95].map((x, i) => ({ x, delay: i * 0.28 }));
const PETALS = [5, 12, 22, 32, 42, 52, 60, 70, 80, 88, 95].map((x, i) => ({ x, delay: i * 0.22 }));
const SEAL_ANGLES = Array.from({ length: 36 }, (_, i) => i * (360 / 36));
const SEAL_COLORS = ["hsl(42,95%,65%)", "hsl(42,85%,75%)", "hsl(350,80%,55%)", "hsl(42,100%,70%)", "hsl(38,90%,65%)", "hsl(0,0%,100%)"];

/* ─── Main component ─── */
export function EnvelopeIntro({ coupleName, weddingDate, destination, onComplete }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [winWidth, setWinWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Pulse the seal automatically to hint interactivity
    const hintTimer = setTimeout(() => {
      if (phase === "idle") setPhase("glow");
    }, 1500);
    return () => clearTimeout(hintTimer);
  }, [phase]);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    setPhase("breaking");
    
    // Trigger the rest of the sequence manually
    setTimeout(() => setPhase("opening"),  800);
    setTimeout(() => setPhase("rising"),   2000);
    setTimeout(() => setPhase("reveal"),   3100);
    setTimeout(() => setPhase("done"),     4500);
    setTimeout(() => { setVisible(false); onComplete(); }, 5500);
  };

  const W = 480;
  const H = 320;
  const CARD_W = W - 24;
  const CARD_H = 320;

  // Responsive scaling to prevent cutoff on mobile screens
  const baseScale = Math.min(1, (winWidth - 32) / W);
  const revealScale = Math.min(1.5, (winWidth - 24) / (CARD_W * baseScale));

  const isOpen   = phase === "opening" || phase === "rising" || phase === "reveal" || phase === "done";
  const isRising = phase === "rising" || phase === "reveal" || phase === "done";
  const showCard = phase === "reveal" || phase === "done";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(145deg, hsl(350 45% 10%) 0%, hsl(350 50% 6%) 50%, hsl(350 60% 4%) 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          {/* Global SVG Defs for Royal Gold */}
          <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
              <linearGradient id="royalGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#BF953F" />
                <stop offset="25%" stopColor="#FCF6BA" />
                <stop offset="50%" stopColor="#B38728" />
                <stop offset="75%" stopColor="#FBF5B7" />
                <stop offset="100%" stopColor="#AA771C" />
              </linearGradient>
            </defs>
          </svg>

          {/* Full-screen damask watermark */}
          <DamaskBg opacity={0.025} />

          {/* Deep ambient glow — grows as phases progress */}
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ opacity: isOpen ? 1 : phase === "glow" ? 0.6 : 0.2 }}
            transition={{ duration: 1.5 }}
            style={{ background: "radial-gradient(ellipse 65% 55% at 50% 55%, hsl(42 80% 42% / 0.16) 0%, transparent 70%)" }} />

          {/* Screen-edge vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, hsl(25 35% 3% / 0.85) 100%)" }} />

          {/* Gold sparkles around the scene */}
          {SPARKLES.map((s, i) => <GoldSparkle key={i} x={s.x} y={s.y} delay={s.delay} size={s.size} />)}

          {/* Rising orbs */}
          {ORBS.map((o, i) => <RisingOrb key={i} x={o.x} delay={o.delay} />)}

          {/* Falling petals — only during rising & reveal */}
          {isRising && PETALS.map((p, i) => <Petal key={i} x={p.x} delay={p.delay} />)}

          {/* ═══════════════════════════════════════════
              ENVELOPE WRAPPER
          ═══════════════════════════════════════════ */}
          <motion.div
            className="relative"
            style={{ width: W, height: H }}
            initial={{ scale: baseScale * 0.8, opacity: 0, y: 50 }}
            animate={{ scale: baseScale, opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Divine Aura Behind Envelope ── */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              animate={
                isOpen ? { opacity: 0 } : {
                  boxShadow: [
                    "0 0 50px 10px hsl(42 85% 60% / 0.15), 0 0 120px 40px hsl(42 85% 60% / 0.05)",
                    "0 0 80px 25px hsl(42 95% 65% / 0.4), 0 0 180px 70px hsl(42 95% 65% / 0.2)",
                    "0 0 50px 10px hsl(42 85% 60% / 0.15), 0 0 120px 40px hsl(42 85% 60% / 0.05)"
                  ]
                }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ zIndex: 1, borderRadius: 4 }}
            />
            {/* ── Invitation card (hidden inside, rises) ── */}
            <motion.div
              className="absolute left-1/2 bottom-0 overflow-hidden rounded-sm"
              style={{ translateX: "-50%", width: CARD_W, zIndex: showCard ? 50 : isRising ? 20 : 4 }}
              initial={{ y: 0, height: 0, opacity: 0, scale: 1, rotateX: 0, rotateY: 0 }}
              animate={
                showCard
                  ? { y: 0, height: CARD_H, opacity: 1, scale: revealScale, rotateX: 0, rotateY: 0, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.7)" }
                  : isRising
                  ? { y: 0, height: CARD_H, opacity: 1, scale: revealScale * 0.85, rotateX: 4, rotateY: -2, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }
                  : isOpen
                  ? { y: -5, height: 80, opacity: 0.6, scale: 1, rotateX: 0, rotateY: 0 }
                  : { y: 0, height: 0, opacity: 0, scale: 1, rotateX: 0, rotateY: 0 }
              }
              transition={{ 
                duration: showCard ? 1.4 : 1.6, 
                delay: isRising && !showCard ? 0.2 : 0,
                ease: showCard ? [0.16, 1, 0.3, 1] : [0.34, 1.56, 0.64, 1] // Smooth cinematic ease out for showCard
              }}
            >
              {/* Card glow/bloom on reveal */}
              <AnimatePresence>
                {showCard && (
                  <motion.div 
                    className="absolute inset-0 pointer-events-none z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.3, 1.6] }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    style={{ background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)" }}
                  />
                )}
              </AnimatePresence>

              {/* Divine Edge highlight glow */}
              <motion.div className="absolute inset-0 pointer-events-none z-10"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsl(42 85% 55% / 0.3), inset 0 0 15px hsl(42 80% 55% / 0.2)", 
                    "0 0 50px hsl(42 95% 65% / 0.6), inset 0 0 35px hsl(42 85% 65% / 0.4)", 
                    "0 0 20px hsl(42 85% 55% / 0.3), inset 0 0 15px hsl(42 80% 55% / 0.2)"
                  ] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
              <div style={{ width: "100%", height: CARD_H }}>
                <InvitationCard show={showCard} coupleName={coupleName} weddingDate={weddingDate} destination={destination} />
              </div>
            </motion.div>

            {/* ── Envelope body ── */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 overflow-hidden"
              style={{
                height: H,
                background: "radial-gradient(ellipse at center, #9B111E 0%, #5C0002 60%, #300000 100%)",
                border: "1.5px solid #AA771C",
                zIndex: 10,
              }}
              animate={isRising ? { y: 120, opacity: 0, scale: 0.85, rotateX: -10 } : { 
                y: 0, opacity: 1, scale: 1, rotateX: 0,
                boxShadow: [
                  "0 32px 80px hsl(25 30% 3% / 0.9), 0 0 0 1px rgba(191,149,63,0.3), inset 0 0 20px rgba(191,149,63,0.3)",
                  "0 32px 80px hsl(25 30% 3% / 0.9), 0 0 0 2px rgba(252,246,186,0.7), inset 0 0 40px rgba(252,246,186,0.6)",
                  "0 32px 80px hsl(25 30% 3% / 0.9), 0 0 0 1px rgba(191,149,63,0.3), inset 0 0 20px rgba(191,149,63,0.3)"
                ]
              }}
              transition={isRising ? { duration: 1.2, ease: [0.4, 0, 0.2, 1] } : { boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              {/* Shimmer Sweep */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 20%, rgba(255, 235, 180, 0.15) 45%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 235, 180, 0.15) 55%, transparent 80%)",
                  backgroundSize: "200% 200%",
                  zIndex: 20,
                  mixBlendMode: "overlay"
                }}
                animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              {/* Sliding Glow Border */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 30 }}>
                <defs>
                  <filter id="slide-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="50%" stopColor="#FCF6BA" />
                    <stop offset="100%" stopColor="#AA771C" />
                  </linearGradient>
                </defs>
                {/* Fast main slider */}
                <rect 
                  x="2" y="2" width={W - 4} height={H - 4} 
                  fill="none" 
                  stroke="url(#glowLine)" 
                  strokeWidth="2.5" 
                  strokeDasharray="180 1404" 
                  strokeLinecap="round"
                  filter="url(#slide-glow)"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="1584" 
                    to="0" 
                    dur="3s" 
                    repeatCount="indefinite" 
                  />
                </rect>
                {/* Secondary reverse slider */}
                <rect 
                  x="2" y="2" width={W - 4} height={H - 4} 
                  fill="none" 
                  stroke="url(#glowLine)" 
                  strokeWidth="1.5" 
                  strokeDasharray="80 1504" 
                  strokeLinecap="round"
                  filter="url(#slide-glow)"
                  opacity="0.8"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="0" 
                    to="1584" 
                    dur="4.5s" 
                    repeatCount="indefinite" 
                  />
                </rect>
              </svg>

              {/* Damask inside envelope */}
              <DamaskBg opacity={0.09} />

              {/* Double inner border */}
              <div className="absolute inset-[7px] pointer-events-none" style={{ border: "0.75px solid hsl(42 65% 50% / 0.35)" }} />
              <div className="absolute inset-[12px] pointer-events-none" style={{ border: "0.5px solid hsl(42 55% 48% / 0.15)" }} />

              {/* Corner ornaments */}
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />

              {/* Fold lines SVG */}
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lFold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5C0002" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#300000" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="rFold" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#6E0B14" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#300000" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="bFold" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#5C0002" stopOpacity="0.98" />
                    <stop offset="100%" stopColor="#2A0000" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <polygon points={`0,0 0,${H} ${W/2},${H*0.56}`}
                  fill="url(#lFold)" stroke="url(#royalGold)" strokeWidth="1.5" opacity="0.9" />
                <polygon points={`${W},0 ${W},${H} ${W/2},${H*0.56}`}
                  fill="url(#rFold)" stroke="url(#royalGold)" strokeWidth="1.5" opacity="0.9" />
                <polygon points={`0,${H} ${W},${H} ${W/2},${H*0.56}`}
                  fill="url(#bFold)" stroke="url(#royalGold)" strokeWidth="2" opacity="1" />
              </svg>

              {/* Center gold rule */}
              <motion.div className="absolute pointer-events-none"
                style={{ left: "10%", right: "10%", top: "60%", height: 1.5, background: "linear-gradient(to right, transparent, #FCF6BA, transparent)" }}
                animate={{ opacity: [0.3, 0.8, 0.3], boxShadow: ["0 0 10px #BF953F", "0 0 30px #FCF6BA", "0 0 10px #BF953F"] }}
                transition={{ duration: 3.5, repeat: Infinity }} />

              {/* ── WAX SEAL ── */}
              <motion.div
                className={`absolute left-1/2 bottom-6 ${!isOpened ? "cursor-pointer" : ""}`}
                style={{ translateX: "-50%", zIndex: 15 }}
                animate={isRising ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.6 }}
                onClick={handleOpen}
                whileHover={!isOpened ? { scale: 1.08 } : {}}
                whileTap={!isOpened ? { scale: 0.95 } : {}}
              >
                {/* Burst particles and shockwave on breaking */}
                {phase === "breaking" && (
                  <div className="relative">
                    <SealShockwave delay={0} />
                    <SealShockwave delay={0.15} />
                    {SEAL_ANGLES.map((a, i) => (
                      <SealParticle key={i} angle={a}
                        dist={60 + (i % 4) * 25}
                        delay={i * 0.008}
                        color={SEAL_COLORS[i % SEAL_COLORS.length]} />
                    ))}
                  </div>
                )}

                <motion.div
                  animate={
                    phase === "glow"
                      ? { scale: [1, 1.06, 1] }
                      : phase === "breaking"
                      ? { scale: [1, 1.3, 0.5], rotate: [0, -12, 18], opacity: [1, 1, 0.4] }
                      : isOpen
                      ? { scale: 0.7, opacity: 0.4 }
                      : {}
                  }
                  transition={{ duration: phase === "glow" ? 1 : 0.55 }}
                >
                  {/* Outer slow-spin dashed ring */}
                  <motion.div className="absolute rounded-full" style={{ inset: -20, border: "1.5px dashed #BF953F", borderRadius: "50%" }}
                    animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} />
                  {/* Medium spin ring */}
                  <motion.div className="absolute rounded-full" style={{ inset: -12, border: "1px solid #FCF6BA", borderRadius: "50%", boxShadow: "0 0 10px #BF953F, inset 0 0 10px #BF953F" }}
                    animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                  {/* Glow pulse */}
                  <motion.div className="absolute rounded-full pointer-events-none" style={{ inset: -6 }}
                    animate={{ boxShadow: ["0 0 15px #BF953F", "0 0 45px #FCF6BA", "0 0 15px #BF953F"] }}
                    transition={{ duration: phase === "glow" ? 1.2 : 2.5, repeat: Infinity }} />

                  {/* Seal body */}
                  <div className="relative w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 35% 25%, #E63946, #9B111E 40%, #5C0002)",
                      border: "1.5px solid #FF7B7B",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.8), inset -4px -4px 12px rgba(0,0,0,0.6), inset 4px 4px 10px rgba(255,255,255,0.4)",
                    }}>
                    <div className="absolute inset-[4px] rounded-full" style={{ border: "1px solid rgba(252,246,186,0.5)" }} />
                    
                    {/* Lotus moved up slightly to make room */}
                    <div style={{ marginTop: "-8px" }}>
                      <LotusIcon size={34} />
                    </div>

                    {/* OPEN text perfectly balanced at the bottom of the seal */}
                    <span className="absolute bottom-[10px]" style={{ fontFamily: "'Jost', sans-serif", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.3em", color: "#FCF6BA", textShadow: "0 1px 3px rgba(0,0,0,0.9)", marginLeft: "2px" }}>
                      OPEN
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ── ENVELOPE FLAP ── */}
            <motion.div
              className="absolute left-0 right-0 top-0 origin-top"
              style={{ height: 180, zIndex: 25, transformStyle: "preserve-3d" }}
              initial={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
              animate={
                isRising 
                  ? { rotateX: -180, y: 120, opacity: 0, scale: 0.85 } 
                  : isOpen 
                  ? { rotateX: -180, y: 0, opacity: 1, scale: 1 } 
                  : { rotateX: 0, y: 0, opacity: 1, scale: 1 }
              }
              transition={{ 
                duration: isRising ? 1.2 : 1.5, 
                ease: [0.4, 0, 0.2, 1],
                delay: phase === "opening" ? 0 : 0.1
              }}
            >
              {/* Outer Flap (Visible when closed) */}
              <div 
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", zIndex: 2 }}
              >
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 20%, rgba(255, 235, 180, 0.15) 45%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 235, 180, 0.15) 55%, transparent 80%)",
                    backgroundSize: "200% 200%",
                    zIndex: 20,
                    clipPath: `polygon(0 0, ${W}px 0, ${W/2}px 180px)`,
                    mixBlendMode: "overlay"
                  }}
                  animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                <svg viewBox={`0 0 ${W} 180`} className="w-full h-full"
                  style={{ filter: "drop-shadow(0 8px 20px hsl(25 30% 3% / 0.55))" }}>
                  <defs>
                    <linearGradient id="flapBody" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7A0A14" />
                      <stop offset="100%" stopColor="#4A0005" />
                    </linearGradient>
                  </defs>
                  <polygon points={`0,0 ${W},0 ${W/2},180`} fill="url(#flapBody)" />
                  <line x1="0" y1="1" x2={W} y2="1" stroke="url(#royalGold)" strokeWidth="3" opacity="0.9" />
                  <line x1="0" y1="1" x2={W/2} y2="180" stroke="url(#royalGold)" strokeWidth="1.5" opacity="0.8" />
                  <line x1={W} y1="1" x2={W/2} y2="180" stroke="url(#royalGold)" strokeWidth="1.5" opacity="0.8" />
                  <circle cx={W/2} cy="30" r="7" fill="url(#royalGold)" opacity="0.9" />
                  <circle cx={W/2} cy="30" r="12" stroke="url(#royalGold)" strokeWidth="1.5" opacity="0.6" fill="none" />
                </svg>
              </div>

              {/* Inner Flap (Visible when open) */}
              <div 
                className="absolute inset-0"
                style={{ 
                  backfaceVisibility: "hidden", 
                  transform: "rotateX(180deg)",
                  zIndex: 1
                }}
              >
                <svg viewBox={`0 0 ${W} 180`} className="w-full h-full">
                  <defs>
                    <linearGradient id="flapLining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(42 55% 92%)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(38 42% 82%)" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="flapInnerBody" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#300000" />
                      <stop offset="100%" stopColor="#5C0002" />
                    </linearGradient>
                  </defs>
                  <polygon points={`0,0 ${W},0 ${W/2},180`} fill="url(#flapInnerBody)" />
                  <polygon points={`12,0 ${W-12},0 ${W/2},165`} fill="url(#flapLining)" />
                  <DamaskBg opacity={0.05} />
                  <line x1="12" y1="0" x2={W/2} y2="165" stroke="hsl(42,60%,50%)" strokeWidth="0.5" opacity="0.3" />
                  <line x1={W-12} y1="0" x2={W/2} y2="165" stroke="hsl(42,60%,50%)" strokeWidth="0.5" opacity="0.3" />
                </svg>
                {/* Shadow cast as it opens */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  animate={isOpen ? { opacity: [0, 0.4, 0] } : { opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}
                />
              </div>
            </motion.div>

            {/* ── Top edge strip ── */}
            <motion.div className="absolute left-0 right-0 top-0"
              style={{ height: 7, background: "linear-gradient(to right, #4A0005, #6E0B14, #4A0005)", borderTop: "2px solid #BF953F", boxShadow: "0 2px 10px rgba(0,0,0,0.5)", zIndex: 9 }}
              animate={isRising ? { y: 120, opacity: 0, scale: 0.85 } : { y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>

          {/* ── Status text ── */}
          <AnimatePresence mode="wait">
            {phase === "idle" || phase === "glow" || (isOpened && !showCard) ? (
              <motion.p key="hint"
                className="absolute bottom-10 text-center text-xs tracking-[0.38em] uppercase select-none pointer-events-none"
                style={{ color: "hsl(42 52% 52% / 0.7)", fontFamily: "'Jost', sans-serif" }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ delay: 0.5, duration: 0.7 }}>
                {isOpened ? "Opening your invitation\u2026" : "Tap the seal to open"}
              </motion.p>
            ) : showCard ? (
              <motion.p key="love"
                className="absolute bottom-10 text-center font-serif italic text-sm select-none"
                style={{ color: "hsl(42 65% 62% / 0.65)" }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}>
                With love from Myra &amp; Aryan ✦
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

