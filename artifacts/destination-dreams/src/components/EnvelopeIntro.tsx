import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeIntroProps {
  coupleName: string;
  weddingDate: string;
  destination: string;
  onComplete: () => void;
}

/* ─── Wax seal burst particle ─── */
function SealParticle({ angle, delay }: { angle: number; delay: number }) {
  const vx = Math.cos((angle * Math.PI) / 180) * (30 + Math.random() * 30);
  const vy = Math.sin((angle * Math.PI) / 180) * (30 + Math.random() * 30);
  const colors = ["hsl(42,90%,65%)", "hsl(42,80%,75%)", "hsl(350,65%,55%)", "hsl(42,95%,55%)"];
  const color = colors[Math.floor(angle / 60) % colors.length];
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ background: color, top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: vx, y: vy, opacity: 0, scale: 0 }}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
    />
  );
}

/* ─── Ambient floating gold particle ─── */
function GoldFloat({ x, delay, size }: { x: number; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, bottom: "-10px", width: size, height: size, background: "hsl(42 85% 62% / 0.6)" }}
      animate={{ y: [0, -80, -160], opacity: [0, 0.8, 0], scale: [0.5, 1, 0.3] }}
      transition={{ duration: 4 + delay, delay, repeat: Infinity, repeatDelay: Math.random() * 3, ease: "easeOut" }}
    />
  );
}

/* ─── Falling petal during reveal ─── */
function RevealPetal({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute top-0 select-none pointer-events-none text-sm"
      style={{ left: `${x}%` }}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: "110vh", opacity: [0, 0.9, 0.9, 0], rotate: [0, 180, 360] }}
      transition={{ duration: 5, delay, ease: "linear" }}
    >
      🌸
    </motion.div>
  );
}

/* ─── Corner ornament SVG ─── */
function EnvCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  const origin = { tl: "0 0", tr: "100% 0", bl: "0 100%", br: "100% 100%" }[pos];
  return (
    <svg
      width="48" height="48" viewBox="0 0 48 48" fill="none"
      className="absolute pointer-events-none"
      style={{
        top: pos.startsWith("t") ? 6 : "auto",
        bottom: pos.startsWith("b") ? 6 : "auto",
        left: pos.endsWith("l") ? 6 : "auto",
        right: pos.endsWith("r") ? 6 : "auto",
        transformOrigin: origin,
        transform: flip,
      }}
    >
      <path d="M4,4 L4,22 Q4,6 22,6 L4,6 Z" fill="hsl(42,82%,58%)" opacity="0.9" />
      <path d="M4,4 L4,28 Q4,4 28,4 L4,4 Z" fill="none" stroke="hsl(42,75%,55%)" strokeWidth="0.8" opacity="0.6" />
      <circle cx="4" cy="4" r="2.5" fill="hsl(42,85%,62%)" opacity="0.9" />
      <circle cx="14" cy="6" r="1.5" fill="hsl(42,80%,60%)" opacity="0.6" />
      <circle cx="6" cy="14" r="1.5" fill="hsl(42,80%,60%)" opacity="0.6" />
    </svg>
  );
}

/* ─── Damask tile pattern (SVG) ─── */
function DamaskPattern({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id="damask-env" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30,5 Q40,15 30,25 Q20,15 30,5Z" fill="hsl(42,80%,62%)" />
          <path d="M30,35 Q40,45 30,55 Q20,45 30,35Z" fill="hsl(42,80%,62%)" />
          <path d="M5,30 Q15,40 25,30 Q15,20 5,30Z" fill="hsl(42,80%,62%)" />
          <path d="M35,30 Q45,40 55,30 Q45,20 35,30Z" fill="hsl(42,80%,62%)" />
          <circle cx="30" cy="30" r="4" fill="hsl(42,82%,60%)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#damask-env)" />
    </svg>
  );
}

/* ─── Invitation card content ─── */
function InvitationCard({ phase, coupleName, weddingDate, destination }: {
  phase: string; coupleName: string; weddingDate: string; destination: string;
}) {
  const show = phase === "rising" || phase === "done";
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(155deg, hsl(40 65% 97%) 0%, hsl(38 45% 91%) 100%)" }}
    >
      {/* Damask watermark */}
      <DamaskPattern opacity={0.055} />

      {/* Double border inside card */}
      <div className="absolute inset-[10px] pointer-events-none"
        style={{ border: "1px solid hsl(42 55% 58% / 0.35)" }} />
      <div className="absolute inset-[14px] pointer-events-none"
        style={{ border: "0.5px solid hsl(42 50% 58% / 0.18)" }} />

      {/* Card corner ornaments */}
      <EnvCorner pos="tl" />
      <EnvCorner pos="tr" />
      <EnvCorner pos="bl" />
      <EnvCorner pos="br" />

      {/* Top gold line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(to right, transparent, hsl(42 85% 52%), transparent)" }}
        initial={{ scaleX: 0 }}
        animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-8 py-4 text-center">

        {/* Top ornament row */}
        <motion.div
          className="flex items-center gap-3 w-full justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={show ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
        >
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, hsl(42 55% 58%))" }} />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9,1 L10.4,6 L15.8,6 L11.4,9.5 L13,15 L9,12 L5,15 L6.6,9.5 L2.2,6 L7.6,6 Z"
              fill="hsl(42,82%,48%)" opacity="0.85" />
          </svg>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, hsl(42 55% 58%))" }} />
        </motion.div>

        {/* "You are cordially invited" */}
        <motion.p
          className="uppercase tracking-[0.28em] text-[9px]"
          style={{ color: "hsl(25 30% 38% / 0.75)", fontFamily: "'Jost', sans-serif" }}
          initial={{ opacity: 0, y: 6 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          You are cordially invited
        </motion.p>

        {/* Couple name */}
        <motion.h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30,
            fontWeight: 400,
            fontStyle: "italic",
            color: "hsl(25 35% 16%)",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
          initial={{ opacity: 0, y: 12, letterSpacing: "0.3em" }}
          animate={show ? { opacity: 1, y: 0, letterSpacing: "0.02em" } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.65, duration: 0.8, ease: "easeOut" }}
        >
          {coupleName}
        </motion.h2>

        {/* Diamond ornament */}
        <motion.div
          className="flex items-center gap-2 w-full justify-center"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, hsl(42 50% 55%))" }} />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5,1 L9,5 L5,9 L1,5 Z" fill="hsl(42,80%,50%)" opacity="0.8" />
          </svg>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, hsl(42 50% 55%))" }} />
        </motion.div>

        {/* Date */}
        <motion.p
          className="uppercase tracking-[0.22em] text-[9px]"
          style={{ color: "hsl(25 30% 35%)", fontFamily: "'Jost', sans-serif" }}
          initial={{ opacity: 0, y: 5 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {weddingDate}
        </motion.p>

        {/* Destination */}
        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 11,
            fontStyle: "italic",
            color: "hsl(25 25% 42%)",
            letterSpacing: "0.1em",
          }}
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
        >
          {destination}
        </motion.p>

        {/* Bottom ornament row */}
        <motion.div
          className="flex items-center gap-3 w-full justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={show ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
        >
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, hsl(42 55% 58%))" }} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7,2 Q9,5 7,7 Q5,5 7,2Z" fill="hsl(42,78%,52%)" opacity="0.7" />
            <path d="M7,7 Q9,9 7,12 Q5,9 7,7Z" fill="hsl(42,78%,52%)" opacity="0.7" />
            <circle cx="7" cy="7" r="1.5" fill="hsl(42,82%,55%)" />
          </svg>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, hsl(42 55% 58%))" }} />
        </motion.div>
      </div>

      {/* Bottom gold line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(to right, transparent, hsl(42 85% 52%), transparent)" }}
        initial={{ scaleX: 0 }}
        animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </div>
  );
}

const SEAL_BURST_ANGLES = Array.from({ length: 20 }, (_, i) => i * 18);
const GOLD_FLOATS = Array.from({ length: 12 }, (_, i) => ({
  x: 5 + (i * 8.3) % 90, delay: i * 0.4, size: 3 + (i % 3) * 2,
}));
const REVEAL_PETALS = Array.from({ length: 16 }, (_, i) => ({
  x: 3 + (i * 6.2) % 94, delay: 0.1 + i * 0.15,
}));

export function EnvelopeIntro({ coupleName, weddingDate, destination, onComplete }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<"idle" | "breaking" | "opening" | "rising" | "done">("idle");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("breaking"), 800);
    const t2 = setTimeout(() => setPhase("opening"), 1400);
    const t3 = setTimeout(() => setPhase("rising"), 2600);
    const t4 = setTimeout(() => setPhase("done"), 4200);
    const t5 = setTimeout(() => { setVisible(false); onComplete(); }, 5200);
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout); };
  }, [onComplete]);

  const W = 380; // envelope width
  const H = 260; // envelope height
  const CARD_W = W - 30;
  const CARD_H = 260;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(160deg, hsl(25 35% 4%) 0%, hsl(28 30% 7%) 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          {/* Subtle damask bg */}
          <DamaskPattern opacity={0.025} />

          {/* Ambient radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: phase !== "idle" ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            style={{ background: "radial-gradient(ellipse 55% 55% at 50% 55%, hsl(42 80% 40% / 0.14) 0%, transparent 70%)" }}
          />

          {/* Gold floating orbs */}
          {GOLD_FLOATS.map((f, i) => <GoldFloat key={i} x={f.x} delay={f.delay} size={f.size} />)}

          {/* Petals during rising */}
          {(phase === "rising" || phase === "done") &&
            REVEAL_PETALS.map((p, i) => <RevealPetal key={i} x={p.x} delay={p.delay} />)}

          {/* ── Envelope wrapper ── */}
          <motion.div
            className="relative"
            style={{ width: W, height: H }}
            initial={{ scale: 0.82, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* ── Invitation card (rises from within) ── */}
            <motion.div
              className="absolute left-1/2 bottom-0 overflow-hidden"
              style={{
                translateX: "-50%",
                width: CARD_W,
                zIndex: phase === "rising" || phase === "done" ? 20 : 4,
              }}
              initial={{ y: 0, height: 0, opacity: 0 }}
              animate={
                phase === "rising" || phase === "done"
                  ? { y: -CARD_H - 10, height: CARD_H, opacity: 1 }
                  : phase === "opening"
                  ? { y: 0, height: 55, opacity: 0.5 }
                  : { y: 0, height: 0, opacity: 0 }
              }
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ width: "100%", height: CARD_H }}>
                <InvitationCard phase={phase} coupleName={coupleName} weddingDate={weddingDate} destination={destination} />
              </div>
            </motion.div>

            {/* ── Envelope body ── */}
            <div
              className="absolute bottom-0 left-0 right-0 overflow-hidden"
              style={{
                height: H,
                background: "linear-gradient(160deg, hsl(350 35% 14%) 0%, hsl(350 28% 10%) 100%)",
                border: "1.5px solid hsl(42 70% 45% / 0.55)",
                boxShadow: "0 28px 70px hsl(25 30% 3% / 0.8), 0 0 60px hsl(42 80% 40% / 0.1)",
                zIndex: 10,
              }}
            >
              {/* Envelope body damask */}
              <DamaskPattern opacity={0.07} />

              {/* Gold double border inside */}
              <div className="absolute inset-[6px] pointer-events-none"
                style={{ border: "0.5px solid hsl(42 65% 50% / 0.3)" }} />
              <div className="absolute inset-[10px] pointer-events-none"
                style={{ border: "0.5px solid hsl(42 60% 48% / 0.15)" }} />

              {/* Envelope corner ornaments */}
              <EnvCorner pos="tl" />
              <EnvCorner pos="tr" />
              <EnvCorner pos="bl" />
              <EnvCorner pos="br" />

              {/* Interior fold lines */}
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="leftFold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(350,30%,18%)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="hsl(350,28%,12%)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="rightFold" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(350,32%,20%)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="hsl(350,28%,12%)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="bottomFold" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(350,30%,16%)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="hsl(350,25%,12%)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                {/* Left triangle */}
                <polygon points={`0,0 0,${H} ${W/2},${H*0.55}`}
                  fill="url(#leftFold)" stroke="hsl(42,60%,45%)" strokeWidth="0.5" opacity="0.4" />
                {/* Right triangle */}
                <polygon points={`${W},0 ${W},${H} ${W/2},${H*0.55}`}
                  fill="url(#rightFold)" stroke="hsl(42,60%,45%)" strokeWidth="0.5" opacity="0.4" />
                {/* Bottom triangle */}
                <polygon points={`0,${H} ${W},${H} ${W/2},${H*0.55}`}
                  fill="url(#bottomFold)" stroke="hsl(42,65%,48%)" strokeWidth="0.5" opacity="0.5" />
              </svg>

              {/* Center horizontal gold rule */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: "15%", right: "15%",
                  top: "58%",
                  height: 1,
                  background: "linear-gradient(to right, transparent, hsl(42 70% 52% / 0.3), transparent)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* ── Wax seal ── */}
              <motion.div
                className="absolute left-1/2 bottom-5"
                style={{ translateX: "-50%", zIndex: 15 }}
              >
                {/* Seal burst when breaking */}
                {phase === "breaking" && (
                  <div className="relative">
                    {SEAL_BURST_ANGLES.map((a, i) => (
                      <SealParticle key={i} angle={a} delay={i * 0.01} />
                    ))}
                  </div>
                )}

                <motion.div
                  animate={
                    phase === "breaking"
                      ? { scale: [1, 1.25, 0.6], rotate: [0, -8, 12] }
                      : phase === "opening" || phase === "rising" || phase === "done"
                      ? { scale: 0.7, opacity: 0.5 }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {/* Outer decorative ring */}
                  <motion.div
                    className="absolute inset-[-8px] rounded-full"
                    style={{ border: "1px solid hsl(42 75% 52% / 0.5)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-[-14px] rounded-full"
                    style={{ border: "0.5px dashed hsl(42 65% 50% / 0.25)" }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Seal body */}
                  <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 35% 32%, hsl(350 75% 40%), hsl(350 65% 24%))",
                      boxShadow: "0 3px 16px hsl(350 60% 10% / 0.7), inset 0 1px 0 hsl(350 60% 50% / 0.3), 0 0 20px hsl(42 80% 40% / 0.2)",
                      border: "1.5px solid hsl(42 70% 48% / 0.6)",
                    }}
                  >
                    {/* Inner ring */}
                    <div className="absolute inset-[3px] rounded-full"
                      style={{ border: "0.5px solid hsl(42 60% 55% / 0.3)" }} />

                    {/* Monogram */}
                    <div className="flex flex-col items-center">
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "hsl(42 85% 75%)",
                          letterSpacing: "0.05em",
                          lineHeight: 1,
                        }}
                      >
                        P&A
                      </span>
                      <span style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 7,
                        letterSpacing: "0.2em",
                        color: "hsl(42 70% 62% / 0.7)",
                      }}>2026</span>
                    </div>
                  </div>

                  {/* Glow pulse on seal */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    animate={{ boxShadow: [
                      "0 0 10px hsl(42 80% 50% / 0.3)",
                      "0 0 25px hsl(42 80% 50% / 0.6)",
                      "0 0 10px hsl(42 80% 50% / 0.3)",
                    ]}}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ── Envelope flap (opens with rotateX) ── */}
            <motion.div
              className="absolute left-0 right-0 top-0 origin-top"
              style={{
                height: 150,
                zIndex: 25,
                transformStyle: "preserve-3d",
                perspective: 900,
              }}
              initial={{ rotateX: 0 }}
              animate={
                phase === "opening" || phase === "rising" || phase === "done"
                  ? { rotateX: -178 }
                  : { rotateX: 0 }
              }
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <svg viewBox={`0 0 ${W} 150`} className="w-full h-full" style={{ filter: "drop-shadow(0 6px 16px hsl(25 30% 3% / 0.5))" }}>
                <defs>
                  <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(350 32% 16%)" />
                    <stop offset="100%" stopColor="hsl(350 26% 12%)" />
                  </linearGradient>
                  <linearGradient id="flapLining" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(42 55% 90%)" />
                    <stop offset="100%" stopColor="hsl(38 40% 82%)" />
                  </linearGradient>
                </defs>
                {/* Flap outer */}
                <polygon points={`0,0 ${W},0 ${W/2},150`} fill="url(#flapGrad)" />
                {/* Gold border on flap edges */}
                <line x1="0" y1="1" x2={W} y2="1" stroke="hsl(42,70%,50%)" strokeWidth="1.5" opacity="0.7" />
                <line x1="0" y1="1" x2={W/2} y2="150" stroke="hsl(42,65%,48%)" strokeWidth="0.8" opacity="0.4" />
                <line x1={W} y1="1" x2={W/2} y2="150" stroke="hsl(42,65%,48%)" strokeWidth="0.8" opacity="0.4" />
                {/* Gold flap lining (cream inside) */}
                <polygon points={`8,0 ${W-8},0 ${W/2},138`} fill="url(#flapLining)" opacity="0.15" />
                {/* Center flap ornament */}
                <circle cx={W/2} cy="28" r="5" fill="hsl(42,82%,58%)" opacity="0.7" />
                <circle cx={W/2} cy="28" r="9" stroke="hsl(42,75%,55%)" strokeWidth="0.8" opacity="0.35" fill="none" />
              </svg>
            </motion.div>

            {/* ── Top edge strip ── */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: 6,
                background: "linear-gradient(to right, hsl(350 30% 14%), hsl(350 35% 18%), hsl(350 30% 14%))",
                borderTop: "1px solid hsl(42 65% 48% / 0.5)",
                zIndex: 9,
              }}
            />
          </motion.div>

          {/* ── Status hint ── */}
          <motion.p
            className="absolute bottom-10 text-center text-xs tracking-[0.35em] uppercase select-none"
            style={{ color: "hsl(42 55% 55% / 0.55)", fontFamily: "'Jost', sans-serif" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase === "idle" ? 1 : 0, y: phase === "idle" ? 0 : -8 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Opening your invitation&hellip;
          </motion.p>

          {/* ── "With love" tagline while card is rising ── */}
          <AnimatePresence>
            {(phase === "rising" || phase === "done") && (
              <motion.p
                className="absolute bottom-10 text-center font-serif italic text-sm select-none"
                style={{ color: "hsl(42 65% 62% / 0.7)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                With love from Priya &amp; Arjun
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
