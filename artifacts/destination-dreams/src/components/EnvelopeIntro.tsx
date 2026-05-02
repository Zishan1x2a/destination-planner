import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface EnvelopeIntroProps {
  coupleName: string;
  weddingDate: string;
  destination: string;
  onComplete: () => void;
}

export function EnvelopeIntro({ coupleName, weddingDate, destination, onComplete }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<"idle" | "opening" | "rising" | "done">("idle");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 900);
    const t2 = setTimeout(() => setPhase("rising"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 3800);
    const t4 = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "hsl(25 30% 5%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          data-testid="envelope-intro"
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase !== "idle" ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 60%, hsl(42 85% 52% / 0.12) 0%, transparent 70%)"
            }}
          />

          {/* Envelope wrapper */}
          <div className="relative" style={{ width: 320, height: 220 }}>

            {/* ─── Invitation card (hidden inside, rises up) ─── */}
            <motion.div
              className="absolute left-1/2 bottom-0 origin-bottom overflow-hidden rounded-sm"
              style={{
                translateX: "-50%",
                width: 288,
                zIndex: phase === "rising" || phase === "done" ? 20 : 5,
              }}
              initial={{ y: 0, height: 0, opacity: 0 }}
              animate={
                phase === "rising" || phase === "done"
                  ? { y: -210, height: 200, opacity: 1 }
                  : phase === "opening"
                  ? { y: 0, height: 60, opacity: 0.6 }
                  : { y: 0, height: 0, opacity: 0 }
              }
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              data-testid="envelope-card"
            >
              {/* Card content */}
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3 px-6"
                style={{
                  background: "linear-gradient(160deg, hsl(40 55% 96%) 0%, hsl(42 40% 88%) 100%)",
                  borderTop: "3px solid hsl(42 85% 52%)",
                }}
              >
                {/* Ornament top */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={phase === "rising" || phase === "done" ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center gap-2 w-full justify-center"
                >
                  <div style={{ height: 1, flex: 1, background: "hsl(42 50% 65%)" }} />
                  <span style={{ color: "hsl(42 85% 45%)", fontSize: 14 }}>✦</span>
                  <div style={{ height: 1, flex: 1, background: "hsl(42 50% 65%)" }} />
                </motion.div>

                <motion.p
                  className="text-center uppercase tracking-[0.25em] text-xs"
                  style={{ color: "hsl(42 40% 45%)", fontFamily: "'Jost', sans-serif" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={phase === "rising" || phase === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  You are cordially invited
                </motion.p>

                <motion.h2
                  className="text-center leading-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28,
                    fontWeight: 400,
                    color: "hsl(25 35% 18%)",
                    letterSpacing: "0.02em",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={phase === "rising" || phase === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.65, duration: 0.6 }}
                >
                  {coupleName}
                </motion.h2>

                <motion.div
                  className="flex items-center gap-2 w-full justify-center"
                  initial={{ opacity: 0 }}
                  animate={phase === "rising" || phase === "done" ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div style={{ height: 1, flex: 1, background: "hsl(42 50% 65%)" }} />
                  <span style={{ color: "hsl(42 85% 45%)", fontSize: 12 }}>✦</span>
                  <div style={{ height: 1, flex: 1, background: "hsl(42 50% 65%)" }} />
                </motion.div>

                <motion.p
                  className="text-center text-xs uppercase tracking-[0.2em]"
                  style={{ color: "hsl(25 30% 40%)", fontFamily: "'Jost', sans-serif" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={phase === "rising" || phase === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {weddingDate}
                </motion.p>

                <motion.p
                  className="text-center text-xs"
                  style={{ color: "hsl(25 25% 50%)", fontFamily: "'Jost', sans-serif", letterSpacing: "0.12em" }}
                  initial={{ opacity: 0 }}
                  animate={phase === "rising" || phase === "done" ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  {destination}
                </motion.p>
              </div>
            </motion.div>

            {/* ─── Envelope body ─── */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-lg overflow-hidden"
              style={{
                height: 220,
                background: "linear-gradient(180deg, hsl(38 45% 82%) 0%, hsl(36 40% 76%) 100%)",
                boxShadow: "0 20px 60px hsl(25 30% 4% / 0.6), inset 0 1px 0 hsl(42 60% 90%)",
                zIndex: 10,
              }}
            >
              {/* Inner shadow / depth */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, hsl(36 30% 68% / 0.5) 0%, transparent 40%)",
                }}
              />

              {/* Bottom triangle fold lines */}
              <svg
                viewBox="0 0 320 220"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Left side triangle */}
                <polygon
                  points="0,0 0,220 160,120"
                  fill="hsl(36 38% 72%)"
                  stroke="hsl(36 30% 66%)"
                  strokeWidth="0.5"
                />
                {/* Right side triangle */}
                <polygon
                  points="320,0 320,220 160,120"
                  fill="hsl(38 42% 78%)"
                  stroke="hsl(36 30% 66%)"
                  strokeWidth="0.5"
                />
                {/* Bottom triangle */}
                <polygon
                  points="0,220 320,220 160,120"
                  fill="hsl(40 45% 85%)"
                  stroke="hsl(36 30% 70%)"
                  strokeWidth="0.5"
                />
              </svg>

              {/* Wax seal */}
              <motion.div
                className="absolute left-1/2 bottom-5"
                style={{ translateX: "-50%", zIndex: 15 }}
                initial={{ scale: 1, opacity: 1 }}
                animate={phase !== "idle" ? { scale: 0.85, opacity: 0.7 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                data-testid="wax-seal"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, hsl(350 70% 40%), hsl(350 60% 28%))",
                    boxShadow: "0 2px 8px hsl(350 60% 15% / 0.5), inset 0 1px 0 hsl(350 60% 50% / 0.3)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18,
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

            {/* ─── Envelope flap (top, opens via rotateX) ─── */}
            <motion.div
              className="absolute left-0 right-0 top-0 origin-top"
              style={{
                height: 130,
                zIndex: 25,
                transformStyle: "preserve-3d",
                perspective: 800,
              }}
              initial={{ rotateX: 0 }}
              animate={phase === "opening" || phase === "rising" || phase === "done" ? { rotateX: -175 } : { rotateX: 0 }}
              transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
              data-testid="envelope-flap"
            >
              <svg
                viewBox="0 0 320 130"
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 4px 12px hsl(25 30% 4% / 0.3))" }}
              >
                {/* Flap triangle pointing down */}
                <polygon
                  points="0,0 320,0 160,130"
                  fill="hsl(40 48% 86%)"
                  stroke="hsl(36 30% 70%)"
                  strokeWidth="0.5"
                />
                {/* Subtle gradient for 3D depth */}
                <defs>
                  <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(42 55% 92%)" />
                    <stop offset="100%" stopColor="hsl(38 42% 80%)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,0 320,0 160,130"
                  fill="url(#flapGrad)"
                />
                {/* Fold crease line */}
                <line x1="0" y1="1" x2="320" y2="1" stroke="hsl(36 25% 68%)" strokeWidth="1" />
              </svg>
            </motion.div>

            {/* ─── Envelope top edge (static, behind the flap) ─── */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: 10,
                background: "hsl(38 40% 78%)",
                borderRadius: "4px 4px 0 0",
                zIndex: 9,
              }}
            />
          </div>

          {/* Tap-to-open hint */}
          <motion.p
            className="absolute bottom-12 text-center text-xs tracking-[0.3em] uppercase"
            style={{ color: "hsl(35 25% 50%)", fontFamily: "'Jost', sans-serif" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: phase === "idle" ? 1 : 0, y: phase === "idle" ? 0 : -6 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Opening your invitation&hellip;
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
