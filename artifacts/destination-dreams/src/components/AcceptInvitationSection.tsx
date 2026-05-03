import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CornerOrnament, OrnamentDivider } from "@/components/OrnamentalElements";

/* ─── Burst particle ─── */
interface ParticleData {
  id: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

function BurstParticle({ p }: { p: ParticleData }) {
  const vx = Math.cos((p.angle * Math.PI) / 180) * p.speed;
  const vy = Math.sin((p.angle * Math.PI) / 180) * p.speed;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: p.size,
        height: p.size,
        background: p.color,
        top: "50%",
        left: "50%",
        marginTop: -p.size / 2,
        marginLeft: -p.size / 2,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: vx, y: vy, opacity: 0, scale: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

function generateBurst(): ParticleData[] {
  const colors = [
    "hsl(42,90%,65%)", "hsl(42,85%,75%)", "hsl(45,95%,60%)",
    "hsl(350,70%,60%)", "hsl(320,60%,65%)", "hsl(60,90%,65%)",
  ];
  return Array.from({ length: 48 }, (_, i) => ({
    id: i,
    angle: (i / 48) * 360 + Math.random() * 12,
    speed: 60 + Math.random() * 80,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
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
        border: "1px solid hsl(42 80% 55% / 0.4)",
        top: "50%", left: "50%",
        marginTop: -size / 2, marginLeft: -size / 2,
      }}
      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
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
    setTimeout(() => {
      setAccepted(true);
      setBurst([]);
    }, 1200);
  }, [accepted]);

  return (
    <section
      ref={ref}
      id="accept"
      className="relative w-full overflow-hidden flex items-center justify-center py-28 px-4"
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(180deg, hsl(25 30% 5%) 0%, hsl(28 25% 8%) 50%, hsl(25 30% 4%) 100%)",
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, hsl(42 80% 40% / 0.12) 0%, transparent 65%)" }} />

      {/* Background sparkles */}
      {BG_SPARKLES.map((s, i) => <BgSparkle key={i} x={s.x} y={s.y} delay={s.delay} />)}

      {/* Confetti (shown after accept) */}
      <AnimatePresence>
        {showConfetti && CONFETTI_DATA.map((c, i) => <Confetti key={i} delay={c.delay} x={c.x} />)}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto">

        {/* Section eyebrow */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
            style={{ color: "hsl(42 70% 58% / 0.6)" }}>
            You are cordially invited
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic"
            style={{ color: "hsl(42 85% 68%)" }}>
            Join Our Celebration
          </h2>
        </motion.div>

        {/* Main invitation card */}
        <motion.div
          className="relative"
          style={{ y: cardY }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Card glow */}
          <motion.div
            className="absolute -inset-4 rounded-sm pointer-events-none"
            animate={{ boxShadow: [
              "0 0 40px hsl(42 85% 52% / 0.12)",
              "0 0 80px hsl(42 85% 52% / 0.28)",
              "0 0 40px hsl(42 85% 52% / 0.12)",
            ]}}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Card body */}
          <div
            className="relative overflow-hidden p-8 md:p-12"
            style={{
              background: "linear-gradient(145deg, hsl(40 60% 96%) 0%, hsl(38 40% 92%) 100%)",
              border: "1.5px solid hsl(42 70% 58% / 0.9)",
            }}
          >
            {/* Corner ornaments */}
            <CornerOrnament position="tl" color="hsl(42,75%,40%)" size={50} />
            <CornerOrnament position="tr" color="hsl(42,75%,40%)" size={50} />
            <CornerOrnament position="bl" color="hsl(42,75%,40%)" size={50} />
            <CornerOrnament position="br" color="hsl(42,75%,40%)" size={50} />

            {/* Inner border */}
            <div className="absolute inset-[10px] pointer-events-none"
              style={{ border: "0.5px solid hsl(42 60% 40% / 0.3)" }} />

            {/* Card content */}
            <div className="text-center py-4">
              <motion.p
                className="uppercase tracking-[0.4em] text-xs font-sans mb-6"
                style={{ color: "hsl(25 30% 30% / 0.6)" }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                Request the pleasure of your company
              </motion.p>

              <motion.h1
                className="font-serif text-5xl md:text-6xl mb-4"
                style={{ color: "hsl(25 35% 18%)" }}
                initial={{ letterSpacing: "0.3em", opacity: 0 }}
                animate={isInView ? { letterSpacing: "0.05em", opacity: 1 } : {}}
                transition={{ duration: 1.3, delay: 0.4, ease: "easeOut" }}
              >
                Priya & Arjun
              </motion.h1>

              <OrnamentDivider variant="floral" color="hsl(42,75%,40%)" />

              <motion.div
                className="mt-6 space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <p className="font-serif text-lg italic" style={{ color: "hsl(25 30% 28%)" }}>
                  February 14 – 17, 2026
                </p>
                <p className="font-serif text-base" style={{ color: "hsl(25 25% 38%)" }}>
                  The Oberoi Udaivilas, Udaipur, Rajasthan
                </p>
              </motion.div>

              <motion.p
                className="mt-6 text-sm font-sans leading-relaxed max-w-sm mx-auto"
                style={{ color: "hsl(25 20% 35% / 0.75)" }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 }}
              >
                Celebrate love, togetherness & the beginning of forever at the most beautiful destination wedding of the year.
              </motion.p>

              <div className="mt-8">
                <OrnamentDivider variant="diamond" color="hsl(42,75%,40%)" />
              </div>

              {/* ─── Accept button area ─── */}
              <div className="mt-10 relative flex justify-center">
                {/* Burst particles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {burst.map(p => <BurstParticle key={p.id} p={p} />)}
                </div>

                {/* Pulse rings */}
                {!accepted && isInView && (
                  <>
                    <PulseRing size={120} delay={0} />
                    <PulseRing size={120} delay={0.7} />
                    <PulseRing size={120} delay={1.4} />
                  </>
                )}

                <AnimatePresence mode="wait">
                  {!accepted ? (
                    <motion.button
                      key="accept-btn"
                      onClick={handleAccept}
                      className="relative group cursor-pointer"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ delay: 1.0, duration: 0.7 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button glow */}
                      <motion.div
                        className="absolute inset-[-3px] rounded-sm pointer-events-none"
                        animate={{ boxShadow: [
                          "0 0 15px hsl(42 85% 52% / 0.3)",
                          "0 0 35px hsl(42 85% 52% / 0.6)",
                          "0 0 15px hsl(42 85% 52% / 0.3)",
                        ]}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      <div
                        className="relative px-10 py-4 overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, hsl(42 80% 38%) 0%, hsl(42 85% 28%) 100%)",
                          border: "1.5px solid hsl(42 80% 52%)",
                        }}
                      >
                        {/* Shimmer sweep */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 85% / 0.25) 50%, transparent 70%)" }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
                        />

                        <span className="relative font-serif text-lg italic tracking-widest"
                          style={{ color: "hsl(42 90% 88%)" }}>
                          Accept Invitation
                        </span>
                      </div>

                      {/* Hover arrow */}
                      <motion.div
                        className="absolute right-[-30px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      >
                        <span style={{ color: "hsl(42 80% 52%)" }}>→</span>
                      </motion.div>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="accepted-msg"
                      className="text-center py-4"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: "hsl(130 50% 40%)", border: "2px solid hsl(130 60% 55%)" }}
                        animate={{ scale: [0.8, 1.15, 1] }}
                        transition={{ duration: 0.7 }}
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M5 14L11 20L23 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                      <p className="font-serif text-xl italic" style={{ color: "hsl(25 30% 22%)" }}>
                        We'll see you there!
                      </p>
                      <p className="text-xs uppercase tracking-[0.3em] mt-2 font-sans"
                        style={{ color: "hsl(25 20% 38% / 0.7)" }}>
                        Udaipur awaits
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {accepted && (
                <motion.p
                  className="mt-6 text-xs font-sans"
                  style={{ color: "hsl(25 20% 38% / 0.6)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Please also fill in your RSVP details below to help us plan
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Scroll down to Contact hint */}
        {!accepted && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <motion.a
              href="#contact"
              className="flex flex-col items-center gap-2"
              style={{ color: "hsl(42 65% 55% / 0.5)" }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              <span className="uppercase tracking-[0.3em] text-xs font-sans">Have questions? Contact us</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3L10 17M4 11L10 17L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
