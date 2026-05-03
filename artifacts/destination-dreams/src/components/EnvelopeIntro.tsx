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
      style={{ width: 5, height: 5, background: color, top: "50%", left: "50%", marginTop: -2.5, marginLeft: -2.5 }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: 0, opacity: 0 }}
      transition={{ duration: 1.0, delay, ease: "easeOut" }}
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
      <path d="M2,2 L2,26 Q2,4 26,4 L4,4 L4,2 Z" fill="hsl(42,82%,58%)" opacity="0.9" />
      <path d="M2,2 L2,34 Q2,2 34,2" fill="none" stroke="hsl(42,72%,54%)" strokeWidth="0.8" opacity="0.5" />
      <path d="M2,2 L2,20 Q2,8 20,8 L8,8 L8,2 Z" fill="none" stroke="hsl(42,75%,60%)" strokeWidth="0.6" opacity="0.4" />
      <circle cx="2" cy="2" r="3" fill="hsl(42,88%,65%)" />
      <circle cx="12" cy="3" r="1.5" fill="hsl(42,80%,60%)" opacity="0.6" />
      <circle cx="3" cy="12" r="1.5" fill="hsl(42,80%,60%)" opacity="0.6" />
      <circle cx="20" cy="4" r="1" fill="hsl(42,78%,58%)" opacity="0.4" />
      <circle cx="4" cy="20" r="1" fill="hsl(42,78%,58%)" opacity="0.4" />
    </svg>
  );
}

/* ─── Damask repeating background ─── */
function DamaskBg({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id="env-damask" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M36,4 Q46,18 36,28 Q26,18 36,4Z" fill="hsl(42,78%,60%)" />
          <path d="M36,44 Q46,58 36,68 Q26,58 36,44Z" fill="hsl(42,78%,60%)" />
          <path d="M4,36 Q18,46 28,36 Q18,26 4,36Z" fill="hsl(42,78%,60%)" />
          <path d="M44,36 Q58,46 68,36 Q58,26 44,36Z" fill="hsl(42,78%,60%)" />
          <circle cx="36" cy="36" r="5" fill="hsl(42,80%,58%)" />
          <circle cx="36" cy="36" r="2" fill="hsl(42,90%,70%)" />
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
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, hsl(40 68% 97%) 0%, hsl(38 48% 92%) 50%, hsl(40 55% 95%) 100%)" }}>

      {/* Texture watermark */}
      <DamaskBg opacity={0.045} />

      {/* Outer gold border */}
      <div className="absolute inset-[10px] pointer-events-none"
        style={{ border: "1.5px solid hsl(42 68% 55% / 0.55)" }} />
      {/* Inner gold border */}
      <div className="absolute inset-[16px] pointer-events-none"
        style={{ border: "0.75px solid hsl(42 60% 55% / 0.25)" }} />

      {/* Corner ornaments on card */}
      <CornerOrnament pos="tl" size={44} />
      <CornerOrnament pos="tr" size={44} />
      <CornerOrnament pos="bl" size={44} />
      <CornerOrnament pos="br" size={44} />

      {/* Top gold sweep line */}
      <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(to right, transparent 5%, hsl(42 85% 52%) 40%, hsl(42 90% 68%) 50%, hsl(42 85% 52%) 60%, transparent 95%)" }}
        initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }} />

      {/* Bottom gold sweep line */}
      <motion.div className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(to right, transparent 5%, hsl(42 85% 52%) 40%, hsl(42 90% 68%) 50%, hsl(42 85% 52%) 60%, transparent 95%)" }}
        initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.0, delay: 0.35, ease: "easeOut" }} />

      {/* Card text content */}
      <div className="relative z-10 flex flex-col items-center px-10 py-6 text-center gap-3">

        {/* Sanskrit blessing */}
        <motion.p
          className="font-serif italic text-[11px] tracking-[0.15em]"
          style={{ color: "hsl(25 30% 40% / 0.6)" }}
          initial={{ opacity: 0, y: -8 }} animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}>
          ॐ श्री गणेशाय नमः
        </motion.p>

        {/* Top ornament rule */}
        <motion.div className="flex items-center gap-3 w-full"
          initial={{ opacity: 0, scaleX: 0 }} animate={show ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 62% 55%))" }} />
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8,1 L9.5,6 L15,6 L10.5,9.5 L12,14.5 L8,11.5 L4,14.5 L5.5,9.5 L1,6 L6.5,6 Z" fill="hsl(42,80%,50%)" opacity="0.85" /></svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 62% 55%))" }} />
        </motion.div>

        {/* "Cordially invited" */}
        <motion.p className="uppercase tracking-[0.3em] text-[9px] font-sans"
          style={{ color: "hsl(25 28% 42% / 0.7)" }}
          initial={{ opacity: 0, y: 6 }} animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.52, duration: 0.5 }}>
          You are cordially invited to celebrate
        </motion.p>

        {/* "The wedding of" */}
        <motion.p className="font-serif italic text-sm"
          style={{ color: "hsl(25 30% 35% / 0.65)", letterSpacing: "0.06em" }}
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 0.62, duration: 0.5 }}>
          the wedding of
        </motion.p>

        {/* Couple name */}
        <motion.h2
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 400, fontStyle: "italic", color: "hsl(25 38% 14%)", lineHeight: 1.05, letterSpacing: "0.01em" }}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: 0.72, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          {coupleName}
        </motion.h2>

        {/* Diamond divider */}
        <motion.div className="flex items-center gap-2.5 w-full"
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 0.92, duration: 0.5 }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 58% 52%))" }} />
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6,0 L12,6 L6,12 L0,6 Z" fill="hsl(42,78%,52%)" opacity="0.75" /></svg>
          <svg width="7" height="7" viewBox="0 0 7 7"><path d="M3.5,0 L7,3.5 L3.5,7 L0,3.5 Z" fill="hsl(42,75%,55%)" opacity="0.5" /></svg>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6,0 L12,6 L6,12 L0,6 Z" fill="hsl(42,78%,52%)" opacity="0.75" /></svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 58% 52%))" }} />
        </motion.div>

        {/* Date */}
        <motion.p className="uppercase tracking-[0.25em] text-[10px] font-sans"
          style={{ color: "hsl(25 30% 32%)" }}
          initial={{ opacity: 0, y: 5 }} animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.02, duration: 0.5 }}>
          {weddingDate}
        </motion.p>

        {/* Destination */}
        <motion.p
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "hsl(25 28% 42%)", letterSpacing: "0.08em" }}
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.12, duration: 0.5 }}>
          {destination}
        </motion.p>

        {/* Bottom ornament rule */}
        <motion.div className="flex items-center gap-3 w-full"
          initial={{ opacity: 0, scaleX: 0 }} animate={show ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 1.22, duration: 0.7 }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 62% 55%))" }} />
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M11,1 Q14,7 22,7 Q14,7 11,13 Q8,7 0,7 Q8,7 11,1Z" fill="hsl(42,78%,52%)" opacity="0.7" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 62% 55%))" }} />
        </motion.div>

        {/* "With love" footer */}
        <motion.p className="font-serif italic text-[10px]"
          style={{ color: "hsl(25 25% 45% / 0.55)", letterSpacing: "0.12em" }}
          initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.35, duration: 0.5 }}>
          With love & joy — Priya and Arjun
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
const SEAL_ANGLES = Array.from({ length: 28 }, (_, i) => i * (360 / 28));
const SEAL_COLORS = ["hsl(42,90%,65%)", "hsl(42,80%,75%)", "hsl(350,70%,55%)", "hsl(42,95%,55%)", "hsl(38,85%,60%)"];

/* ─── Main component ─── */
export function EnvelopeIntro({ coupleName, weddingDate, destination, onComplete }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("glow"),     700),
      setTimeout(() => setPhase("breaking"), 1600),
      setTimeout(() => setPhase("opening"),  2300),
      setTimeout(() => setPhase("rising"),   3500),
      setTimeout(() => setPhase("reveal"),   4600),
      setTimeout(() => setPhase("done"),     6000),
      setTimeout(() => { setVisible(false); onComplete(); }, 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const W = 480;
  const H = 320;
  const CARD_W = W - 24;
  const CARD_H = 320;

  const isOpen   = phase === "opening" || phase === "rising" || phase === "reveal" || phase === "done";
  const isRising = phase === "rising" || phase === "reveal" || phase === "done";
  const showCard = phase === "reveal" || phase === "done";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(145deg, hsl(25 38% 4%) 0%, hsl(350 20% 7%) 50%, hsl(25 32% 5%) 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          {/* Full-screen damask watermark */}
          <DamaskBg opacity={0.022} />

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
            initial={{ scale: 0.75, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Invitation card (hidden inside, rises) ── */}
            <motion.div
              className="absolute left-1/2 bottom-0 overflow-hidden"
              style={{ translateX: "-50%", width: CARD_W, zIndex: isRising ? 20 : 4 }}
              initial={{ y: 0, height: 0, opacity: 0 }}
              animate={
                isRising
                  ? { y: -(CARD_H + 16), height: CARD_H, opacity: 1 }
                  : isOpen
                  ? { y: 0, height: 70, opacity: 0.5 }
                  : { y: 0, height: 0, opacity: 0 }
              }
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Card glow on edges */}
              <motion.div className="absolute inset-0 pointer-events-none z-10"
                animate={{ boxShadow: ["0 0 20px hsl(42 80% 52% / 0.15)", "0 0 50px hsl(42 80% 52% / 0.35)", "0 0 20px hsl(42 80% 52% / 0.15)"] }}
                transition={{ duration: 3, repeat: Infinity }} />
              <div style={{ width: "100%", height: CARD_H }}>
                <InvitationCard show={showCard} coupleName={coupleName} weddingDate={weddingDate} destination={destination} />
              </div>
            </motion.div>

            {/* ── Envelope body ── */}
            <div
              className="absolute bottom-0 left-0 right-0 overflow-hidden"
              style={{
                height: H,
                background: "linear-gradient(160deg, hsl(350 40% 13%) 0%, hsl(350 32% 9%) 100%)",
                border: "1.5px solid hsl(42 72% 48% / 0.6)",
                boxShadow: [
                  "0 32px 80px hsl(25 30% 3% / 0.9)",
                  "0 0 0 1px hsl(42 60% 42% / 0.15)",
                  "inset 0 1px 0 hsl(42 70% 55% / 0.12)",
                ].join(", "),
                zIndex: 10,
              }}
            >
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
                    <stop offset="0%" stopColor="hsl(350,32%,18%)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="hsl(350,26%,11%)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="rFold" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(350,34%,20%)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="hsl(350,26%,11%)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="bFold" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(350,32%,16%)" stopOpacity="0.98" />
                    <stop offset="100%" stopColor="hsl(350,24%,11%)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <polygon points={`0,0 0,${H} ${W/2},${H*0.56}`}
                  fill="url(#lFold)" stroke="hsl(42,62%,46%)" strokeWidth="0.6" opacity="0.45" />
                <polygon points={`${W},0 ${W},${H} ${W/2},${H*0.56}`}
                  fill="url(#rFold)" stroke="hsl(42,62%,46%)" strokeWidth="0.6" opacity="0.45" />
                <polygon points={`0,${H} ${W},${H} ${W/2},${H*0.56}`}
                  fill="url(#bFold)" stroke="hsl(42,65%,50%)" strokeWidth="0.6" opacity="0.55" />
              </svg>

              {/* Center gold rule */}
              <motion.div className="absolute pointer-events-none"
                style={{ left: "12%", right: "12%", top: "60%", height: 1, background: "linear-gradient(to right, transparent, hsl(42 68% 50% / 0.28), transparent)" }}
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity }} />

              {/* ── WAX SEAL ── */}
              <motion.div
                className="absolute left-1/2 bottom-6"
                style={{ translateX: "-50%", zIndex: 15 }}
              >
                {/* Burst particles on breaking */}
                {phase === "breaking" && (
                  <div className="relative">
                    {SEAL_ANGLES.map((a, i) => (
                      <SealParticle key={i} angle={a}
                        dist={55 + (i % 3) * 20}
                        delay={i * 0.012}
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
                  <motion.div className="absolute rounded-full" style={{ inset: -18, border: "1px dashed hsl(42 68% 50% / 0.3)", borderRadius: "50%" }}
                    animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} />
                  {/* Medium spin ring */}
                  <motion.div className="absolute rounded-full" style={{ inset: -12, border: "0.8px solid hsl(42 75% 52% / 0.45)", borderRadius: "50%" }}
                    animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                  {/* Glow pulse */}
                  <motion.div className="absolute rounded-full pointer-events-none" style={{ inset: -6 }}
                    animate={{ boxShadow: ["0 0 12px hsl(42 85% 52% / 0.3)", "0 0 36px hsl(42 85% 52% / 0.65)", "0 0 12px hsl(42 85% 52% / 0.3)"] }}
                    transition={{ duration: phase === "glow" ? 1.2 : 2.5, repeat: Infinity }} />

                  {/* Seal body */}
                  <div className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 33% 30%, hsl(350 80% 42%), hsl(350 68% 22%))",
                      border: "1.5px solid hsl(42 75% 50% / 0.65)",
                      boxShadow: "0 4px 20px hsl(350 60% 10% / 0.8), inset 0 1px 0 hsl(350 65% 55% / 0.25)",
                    }}>
                    <div className="absolute inset-[4px] rounded-full" style={{ border: "0.75px solid hsl(42 60% 55% / 0.3)" }} />
                    <LotusIcon size={40} />
                  </div>

                  {/* Monogram below lotus */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-1.5 pointer-events-none">
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, letterSpacing: "0.22em", color: "hsl(42 72% 68% / 0.75)" }}>
                      P & A · 2026
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* ── ENVELOPE FLAP ── */}
            <motion.div
              className="absolute left-0 right-0 top-0 origin-top"
              style={{ height: 180, zIndex: 25, transformStyle: "preserve-3d", perspective: 1100 }}
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: -178 } : { rotateX: 0 }}
              transition={{ duration: 1.3, ease: [0.42, 0, 0.2, 1] }}
            >
              <svg viewBox={`0 0 ${W} 180`} className="w-full h-full"
                style={{ filter: "drop-shadow(0 8px 20px hsl(25 30% 3% / 0.55))" }}>
                <defs>
                  <linearGradient id="flapBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(350 38% 15%)" />
                    <stop offset="100%" stopColor="hsl(350 28% 10%)" />
                  </linearGradient>
                  <linearGradient id="flapLining" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(42 55% 92%)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="hsl(38 42% 82%)" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                {/* Main flap triangle */}
                <polygon points={`0,0 ${W},0 ${W/2},180`} fill="url(#flapBody)" />
                {/* Cream lining inside */}
                <polygon points={`12,0 ${W-12},0 ${W/2},165`} fill="url(#flapLining)" />
                {/* Gold top edge */}
                <line x1="0" y1="1" x2={W} y2="1" stroke="hsl(42,75%,52%)" strokeWidth="2" opacity="0.75" />
                {/* Gold side edges */}
                <line x1="0" y1="1" x2={W/2} y2="180" stroke="hsl(42,68%,48%)" strokeWidth="0.8" opacity="0.4" />
                <line x1={W} y1="1" x2={W/2} y2="180" stroke="hsl(42,68%,48%)" strokeWidth="0.8" opacity="0.4" />
                {/* Inner parallel edge lines */}
                <line x1="20" y1="0" x2={W/2} y2="158" stroke="hsl(42,60%,50%)" strokeWidth="0.5" opacity="0.2" />
                <line x1={W-20} y1="0" x2={W/2} y2="158" stroke="hsl(42,60%,50%)" strokeWidth="0.5" opacity="0.2" />
                {/* Center ornament on flap */}
                <circle cx={W/2} cy="30" r="7" fill="hsl(42,82%,58%)" opacity="0.8" />
                <circle cx={W/2} cy="30" r="12" stroke="hsl(42,75%,55%)" strokeWidth="0.8" opacity="0.35" fill="none" />
                <circle cx={W/2} cy="30" r="4" fill="hsl(25,35%,10%)" opacity="0.9" />
                <circle cx={W/2} cy="30" r="2" fill="hsl(42,88%,68%)" opacity="0.9" />
                {/* Small dots near center */}
                <circle cx={W/2 - 22} cy="18" r="2" fill="hsl(42,80%,58%)" opacity="0.5" />
                <circle cx={W/2 + 22} cy="18" r="2" fill="hsl(42,80%,58%)" opacity="0.5" />
              </svg>
            </motion.div>

            {/* ── Top edge strip ── */}
            <div className="absolute left-0 right-0 top-0"
              style={{ height: 7, background: "linear-gradient(to right, hsl(350 32% 13%), hsl(350 38% 18%), hsl(350 32% 13%))", borderTop: "1.5px solid hsl(42 68% 48% / 0.55)", zIndex: 9 }} />
          </motion.div>

          {/* ── Status text ── */}
          <AnimatePresence mode="wait">
            {phase === "idle" || phase === "glow" ? (
              <motion.p key="hint"
                className="absolute bottom-10 text-center text-xs tracking-[0.38em] uppercase select-none"
                style={{ color: "hsl(42 52% 52% / 0.5)", fontFamily: "'Jost', sans-serif" }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ delay: 0.5, duration: 0.7 }}>
                Opening your invitation&hellip;
              </motion.p>
            ) : showCard ? (
              <motion.p key="love"
                className="absolute bottom-10 text-center font-serif italic text-sm select-none"
                style={{ color: "hsl(42 65% 62% / 0.65)" }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}>
                With love from Priya &amp; Arjun ✦
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
