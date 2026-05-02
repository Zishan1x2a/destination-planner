import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface EnvelopeIntroProps {
  coupleName: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  destination: string;
  tagline: string;
  onComplete: () => void;
}

type Phase = "idle" | "opening" | "rising" | "welcome";

export function EnvelopeIntro({
  coupleName,
  brideName,
  groomName,
  weddingDate,
  destination,
  tagline,
  onComplete,
}: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [envelopeGone, setEnvelopeGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1000);
    const t2 = setTimeout(() => setPhase("rising"), 2400);
    const t3 = setTimeout(() => {
      setPhase("welcome");
      setTimeout(() => setEnvelopeGone(true), 800);
    }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleBegin = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const isWelcome = phase === "welcome";

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" data-testid="envelope-intro">

      {/* ── Dark backdrop ─────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "hsl(25 30% 5%)" }}
        animate={{ opacity: isWelcome ? 0 : 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />

      {/* ── Welcome full-screen page ───────────────────────────── */}
      <AnimatePresence>
        {isWelcome && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Udaipur Palace"
                className="w-full h-full object-cover object-center"
              />
              {/* Layered overlays for depth */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(25 30% 5% / 0.65) 0%, hsl(25 30% 8% / 0.45) 40%, hsl(25 30% 5% / 0.75) 100%)",
                }}
              />
              {/* Vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, hsl(25 30% 5% / 0.7) 100%)",
                }}
              />
            </div>

            {/* Floating light particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  background: i % 2 === 0 ? "hsl(42 85% 70%)" : "hsl(42 60% 85%)",
                  left: `${8 + i * 7.5}%`,
                  top: `${15 + (i % 5) * 14}%`,
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 0.7, 0],
                  y: [0, -30, -60],
                  x: [0, (i % 2 === 0 ? 8 : -8)],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  delay: 0.3 + i * 0.25,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

              {/* Top ornament line */}
              <motion.div
                className="flex items-center gap-3 w-full mb-8"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
              >
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 60% 55%))" }} />
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z" fill="hsl(42 85% 55%)" />
                </svg>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 60% 55%))" }} />
              </motion.div>

              {/* "You are cordially invited" */}
              <motion.p
                className="uppercase tracking-[0.35em] text-xs mb-6"
                style={{ color: "hsl(42 70% 65%)", fontFamily: "'Jost', sans-serif" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
              >
                You are cordially invited to the wedding of
              </motion.p>

              {/* Bride name */}
              <motion.h2
                className="leading-none mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
                  fontWeight: 300,
                  color: "hsl(40 60% 94%)",
                  letterSpacing: "0.02em",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {brideName}
              </motion.h2>

              {/* "&" divider */}
              <motion.div
                className="flex items-center gap-4 w-full justify-center my-3"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.5 }}
              >
                <div className="flex-1 h-px max-w-[80px]" style={{ background: "hsl(42 50% 55% / 0.5)" }} />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
                    color: "hsl(42 85% 55%)",
                    fontStyle: "italic",
                    lineHeight: 1,
                  }}
                >
                  &amp;
                </span>
                <div className="flex-1 h-px max-w-[80px]" style={{ background: "hsl(42 50% 55% / 0.5)" }} />
              </motion.div>

              {/* Groom name */}
              <motion.h2
                className="leading-none mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.8rem, 10vw, 5.5rem)",
                  fontWeight: 300,
                  color: "hsl(40 60% 94%)",
                  letterSpacing: "0.02em",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {groomName}
              </motion.h2>

              {/* Date & Destination row */}
              <motion.div
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.6 }}
              >
                <span
                  className="uppercase tracking-[0.2em] text-sm"
                  style={{ color: "hsl(40 45% 78%)", fontFamily: "'Jost', sans-serif" }}
                >
                  {weddingDate}
                </span>
                <span
                  className="hidden sm:block w-1 h-1 rounded-full"
                  style={{ background: "hsl(42 85% 55%)" }}
                />
                <span
                  className="uppercase tracking-[0.2em] text-sm"
                  style={{ color: "hsl(40 45% 78%)", fontFamily: "'Jost', sans-serif" }}
                >
                  {destination}
                </span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                className="text-sm italic mb-10"
                style={{
                  color: "hsl(40 30% 65%)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.15rem",
                  letterSpacing: "0.04em",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                {tagline}
              </motion.p>

              {/* Bottom ornament */}
              <motion.div
                className="flex items-center gap-3 w-full mb-10"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 60% 55% / 0.6))" }} />
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z" fill="hsl(42 75% 60%)" />
                </svg>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 60% 55% / 0.6))" }} />
              </motion.div>

              {/* Begin button */}
              <motion.button
                onClick={handleBegin}
                className="group relative px-10 py-3.5 uppercase tracking-[0.3em] text-xs overflow-hidden"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  color: "hsl(40 60% 94%)",
                  border: "1px solid hsl(42 60% 50% / 0.6)",
                  background: "hsl(42 50% 50% / 0.08)",
                  backdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.45, duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-testid="begin-button"
              >
                {/* Button shimmer on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(42 80% 60% / 0.15), transparent)" }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Begin the Journey
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Envelope (hidden after welcome appears) ──────────── */}
      <AnimatePresence>
        {!envelopeGone && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
          >
            {/* Ambient glow */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== "idle" ? 1 : 0 }}
              transition={{ duration: 1.0 }}
              style={{
                background:
                  "radial-gradient(ellipse 50% 40% at 50% 55%, hsl(42 85% 52% / 0.1) 0%, transparent 70%)",
              }}
            />

            {/* Envelope container */}
            <div className="relative" style={{ width: 320, height: 220 }}>

              {/* Invitation card — rises out */}
              <motion.div
                className="absolute left-1/2 bottom-0 overflow-hidden rounded-sm"
                style={{
                  translateX: "-50%",
                  width: 290,
                  zIndex: phase === "rising" ? 20 : 5,
                }}
                initial={{ y: 0, height: 0, opacity: 0 }}
                animate={
                  phase === "rising"
                    ? { y: -200, height: 190, opacity: 1 }
                    : phase === "opening"
                    ? { y: 0, height: 50, opacity: 0.5 }
                    : { y: 0, height: 0, opacity: 0 }
                }
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2 px-5"
                  style={{
                    background:
                      "linear-gradient(155deg, hsl(40 55% 96%) 0%, hsl(42 40% 88%) 100%)",
                    borderTop: "2px solid hsl(42 85% 52%)",
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-px" style={{ background: "hsl(42 40% 70%)" }} />
                    <span style={{ color: "hsl(42 80% 50%)", fontSize: 12 }}>✦</span>
                    <div className="flex-1 h-px" style={{ background: "hsl(42 40% 70%)" }} />
                  </div>
                  <p
                    className="text-center uppercase tracking-[0.2em]"
                    style={{
                      fontSize: 9,
                      color: "hsl(42 35% 45%)",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  >
                    You are cordially invited
                  </p>
                  <p
                    className="text-center leading-tight"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22,
                      fontWeight: 400,
                      color: "hsl(25 35% 18%)",
                    }}
                  >
                    {coupleName}
                  </p>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-px" style={{ background: "hsl(42 40% 70%)" }} />
                    <span style={{ color: "hsl(42 80% 50%)", fontSize: 10 }}>✦</span>
                    <div className="flex-1 h-px" style={{ background: "hsl(42 40% 70%)" }} />
                  </div>
                  <p
                    className="text-center uppercase tracking-widest"
                    style={{ fontSize: 8, color: "hsl(25 25% 45%)", fontFamily: "'Jost', sans-serif" }}
                  >
                    {weddingDate} · {destination}
                  </p>
                </div>
              </motion.div>

              {/* Envelope body */}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-lg overflow-hidden"
                style={{
                  height: 220,
                  background:
                    "linear-gradient(180deg, hsl(38 45% 82%) 0%, hsl(36 40% 76%) 100%)",
                  boxShadow:
                    "0 24px 64px hsl(25 30% 4% / 0.7), inset 0 1px 0 hsl(42 60% 90%)",
                  zIndex: 10,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, hsl(36 30% 68% / 0.5) 0%, transparent 40%)" }}
                />
                <svg viewBox="0 0 320 220" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <polygon points="0,0 0,220 160,120" fill="hsl(36 38% 72%)" stroke="hsl(36 30% 66%)" strokeWidth="0.5" />
                  <polygon points="320,0 320,220 160,120" fill="hsl(38 42% 78%)" stroke="hsl(36 30% 66%)" strokeWidth="0.5" />
                  <polygon points="0,220 320,220 160,120" fill="hsl(40 45% 85%)" stroke="hsl(36 30% 70%)" strokeWidth="0.5" />
                </svg>
                {/* Wax seal */}
                <motion.div
                  className="absolute left-1/2 bottom-5"
                  style={{ translateX: "-50%", zIndex: 15 }}
                  animate={phase !== "idle" ? { scale: 0.82, opacity: 0.6 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, hsl(350 70% 40%), hsl(350 60% 25%))",
                      boxShadow: "0 2px 10px hsl(350 60% 12% / 0.6), inset 0 1px 0 hsl(350 60% 48% / 0.3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 17,
                        color: "hsl(42 80% 70%)",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      PA
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Envelope flap */}
              <motion.div
                className="absolute left-0 right-0 top-0 origin-top"
                style={{ height: 130, zIndex: 25, transformStyle: "preserve-3d" }}
                initial={{ rotateX: 0 }}
                animate={
                  phase === "opening" || phase === "rising" || phase === "welcome"
                    ? { rotateX: -176 }
                    : { rotateX: 0 }
                }
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <svg viewBox="0 0 320 130" className="w-full h-full" style={{ filter: "drop-shadow(0 4px 12px hsl(25 30% 4% / 0.3))" }}>
                  <defs>
                    <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(42 55% 92%)" />
                      <stop offset="100%" stopColor="hsl(38 42% 80%)" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,0 320,0 160,130" fill="url(#flapGrad)" />
                  <line x1="0" y1="1" x2="320" y2="1" stroke="hsl(36 25% 68%)" strokeWidth="1" />
                </svg>
              </motion.div>

              {/* Envelope top edge */}
              <div
                className="absolute left-0 right-0 top-0"
                style={{ height: 10, background: "hsl(38 40% 78%)", borderRadius: "4px 4px 0 0", zIndex: 9 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Opening your invitation..." hint */}
      <motion.p
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-xs tracking-[0.3em] uppercase pointer-events-none"
        style={{ color: "hsl(35 25% 48%)", fontFamily: "'Jost', sans-serif" }}
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: phase === "idle" ? 1 : 0,
          y: phase === "idle" ? 0 : -8,
        }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Opening your invitation&hellip;
      </motion.p>
    </div>
  );
}
