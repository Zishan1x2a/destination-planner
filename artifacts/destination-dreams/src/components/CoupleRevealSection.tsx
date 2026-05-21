import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { OrnamentDivider, CornerOrnament, BackgroundCornerOrnaments } from "@/components/OrnamentalElements";

interface CoupleRevealSectionProps {
  brideName: string;
  groomName: string;
}

/* ─── Falling petal ─── */
function Petal({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none select-none z-10"
      style={{ left: `${x}%`, fontSize: size }}
      initial={{ y: -80, opacity: 0, rotate: 0 }}
      animate={{
        y: "110vh",
        opacity: [0, 0.9, 0.9, 0],
        rotate: [0, 120, 240, 360],
        x: [0, 20, -15, 25, 0],
      }}
      transition={{
        duration: 6 + (delay % 3),
        delay,
        repeat: Infinity,
        repeatDelay: 1 + (delay % 2),
        ease: "linear",
      }}
    >
      🌸
    </motion.div>
  );
}

/* ─── Sparkle ─── */
function Sparkle({ x, y, delay, large }: { x: number; y: number; delay: number; large?: boolean }) {
  return (
    <motion.div
      className={`absolute rounded-full bg-primary pointer-events-none ${large ? "w-2 h-2" : "w-1 h-1"}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ scale: [0, 1.8, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 2 + delay % 2.5, ease: "easeInOut" }}
    />
  );
}

/* ─── Center mandap arch ─── */
function MandapArch() {
  return (
    <svg viewBox="0 0 180 400" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(42,85%,65%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(42,70%,42%)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Outer arch */}
      <path d="M18,400 L18,150 Q18,20 90,20 Q162,20 162,150 L162,400"
        stroke="url(#archGold)" strokeWidth="2.5" />
      {/* Inner arch */}
      <path d="M30,400 L30,155 Q30,38 90,38 Q150,38 150,155 L150,400"
        stroke="hsl(42,80%,60%)" strokeWidth="0.8" opacity="0.4" />
      {/* Crown top */}
      <circle cx="90" cy="20" r="7" fill="hsl(42,85%,55%)" opacity="0.9" />
      <circle cx="90" cy="20" r="12" stroke="hsl(42,80%,55%)" strokeWidth="1" opacity="0.5" fill="none" />
      <circle cx="90" cy="20" r="17" stroke="hsl(42,80%,55%)" strokeWidth="0.5" opacity="0.25" fill="none" />
      {/* Side top buds */}
      <circle cx="68" cy="32" r="5" fill="hsl(42,80%,52%)" opacity="0.6" />
      <circle cx="112" cy="32" r="5" fill="hsl(42,80%,52%)" opacity="0.6" />
      <circle cx="50" cy="55" r="4" fill="hsl(42,75%,50%)" opacity="0.45" />
      <circle cx="130" cy="55" r="4" fill="hsl(42,75%,50%)" opacity="0.45" />
      {/* Hanging chains left */}
      <path d="M18,160 Q5,172 8,188 Q18,180 18,168" fill="hsl(42,80%,52%)" opacity="0.4" />
      <path d="M18,195 Q4,208 7,224 Q18,216 18,204" fill="hsl(42,80%,52%)" opacity="0.3" />
      <path d="M18,230 Q3,244 6,260 Q18,252 18,240" fill="hsl(42,80%,52%)" opacity="0.22" />
      <path d="M18,265 Q2,280 5,296 Q18,288 18,276" fill="hsl(42,80%,52%)" opacity="0.15" />
      {/* Hanging chains right */}
      <path d="M162,160 Q175,172 172,188 Q162,180 162,168" fill="hsl(42,80%,52%)" opacity="0.4" />
      <path d="M162,195 Q176,208 173,224 Q162,216 162,204" fill="hsl(42,80%,52%)" opacity="0.3" />
      <path d="M162,230 Q177,244 174,260 Q162,252 162,240" fill="hsl(42,80%,52%)" opacity="0.22" />
      <path d="M162,265 Q178,280 175,296 Q162,288 162,276" fill="hsl(42,80%,52%)" opacity="0.15" />
      {/* Base pillars */}
      <rect x="6" y="385" width="24" height="15" rx="3" fill="hsl(42,80%,45%)" opacity="0.4" />
      <rect x="150" y="385" width="24" height="15" rx="3" fill="hsl(42,80%,45%)" opacity="0.4" />
      {/* Heart center */}
      <path d="M90,210 C90,210 76,198 76,188 C76,179 83,174 90,181 C97,174 104,179 104,188 C104,198 90,210 90,210Z"
        fill="hsl(42,85%,55%)" opacity="0.7" />
      {/* Decorative horizontal bars */}
      <line x1="18" y1="320" x2="162" y2="320" stroke="hsl(42,80%,52%)" strokeWidth="0.8" opacity="0.2" />
      <line x1="18" y1="350" x2="162" y2="350" stroke="hsl(42,80%,52%)" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

/* ─── Images ─── */
const GROOM_IMG = "/images/groom.png";
const BRIDE_IMG = "/images/bride.png";

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i, delay: i * 0.45, x: 3 + (i * 5.5) % 94, size: 13 + (i % 5) * 3,
}));

const SPARKLES = [
  { x: 47, y: 18, delay: 0.3, large: true },
  { x: 53, y: 38, delay: 1.1 },
  { x: 45, y: 58, delay: 1.9 },
  { x: 55, y: 72, delay: 0.7 },
  { x: 50, y: 28, delay: 2.3, large: true },
  { x: 42, y: 48, delay: 1.5 },
  { x: 58, y: 55, delay: 0.9 },
  { x: 49, y: 82, delay: 2.8 },
];

export function CoupleRevealSection({ brideName, groomName }: CoupleRevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [showNames, setShowNames] = useState(false);

  /* Parallax scroll — groom moves up, bride moves down slightly */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const groomY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const brideY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const archScale = useTransform(scrollYProgress, [0.2, 0.6], [0.96, 1.02]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isInView) {
      t = setTimeout(() => setShowNames(true), 1400);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      id="couple"
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        position: "relative",
        background:
          "linear-gradient(180deg, hsl(25 30% 4%) 0%, hsl(28 28% 9%) 40%, hsl(25 30% 6%) 100%)",
      }}
    >
      {/* ── Ambient radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 50%, hsl(42 85% 52% / 0.1) 0%, transparent 65%)",
        }}
      />

      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

      {/* ── Falling petals ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PETALS.map((p) => <Petal key={p.id} delay={p.delay} x={p.x} size={p.size} />)}
      </div>

      {/* ── Sparkles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {SPARKLES.map((s, i) => <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} large={s.large} />)}
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-20 pb-16 flex flex-col items-center">

        {/* Top eyebrow */}
        <motion.p
          className="text-center tracking-[0.4em] uppercase text-xs mb-10 font-sans"
          style={{ color: "hsl(42 80% 65% / 0.7)" }}
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Together in Love
        </motion.p>

        {/* ── Three-column: groom | arch | bride ── */}
        <div className="w-full flex items-end justify-center gap-2 md:gap-6">

          {/* ═══ GROOM (slides from left) ═══ */}
          <motion.div
            className="flex flex-col items-center flex-1"
            style={{ maxWidth: "clamp(140px, 28vw, 320px)" }}
            initial={{ x: -220, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name label */}
            <motion.div
              className="mb-5 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={showNames ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              <h3 className="font-serif text-2xl md:text-4xl italic"
                style={{ color: "hsl(42 85% 68%)" }}>
                {groomName.split(" ")[0]}
              </h3>
            </motion.div>

            {/* Portrait frame with parallax + float */}
            <motion.div
              className="relative w-full"
              style={{ aspectRatio: "3/5", y: groomY }}
            >
              {/* Floating loop */}
              <motion.div
                className="absolute inset-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-t-full"
                  animate={{ boxShadow: [
                    "0 0 20px hsl(42 85% 52% / 0.2), 0 0 60px hsl(42 85% 52% / 0.05)",
                    "0 0 35px hsl(42 85% 52% / 0.4), 0 0 80px hsl(42 85% 52% / 0.12)",
                    "0 0 20px hsl(42 85% 52% / 0.2), 0 0 60px hsl(42 85% 52% / 0.05)",
                  ]}}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Frame border */}
                <div
                  className="absolute inset-0 rounded-t-full overflow-hidden"
                  style={{
                    border: "2px solid hsl(42 80% 55% / 0.8)",
                  }}
                >
                  {/* Inner border */}
                  <div
                    className="absolute inset-[5px] rounded-t-full pointer-events-none z-10"
                    style={{ border: "0.8px solid hsl(42 70% 55% / 0.35)" }}
                  />

                  {/* Photo */}
                  <motion.img
                    src={GROOM_IMG}
                    alt="Groom"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    style={{ filter: "brightness(0.92) contrast(1.05) saturate(1.1)" }}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.05 }}
                  />

                  {/* Color grade overlay — warm golden tint */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, hsl(42 60% 30% / 0.25) 0%, transparent 50%, hsl(25 40% 8% / 0.55) 100%)",
                    }}
                  />

                  {/* Light sweep shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, hsl(42 90% 80% / 0.15) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3.5, delay: 1.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                  />
                </div>

                {/* Corner ornaments */}
                <CornerOrnament position="bl" color="hsl(42,80%,60%)" size={32} />
                <CornerOrnament position="br" color="hsl(42,80%,60%)" size={32} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ═══ CENTER ARCH ═══ */}
          <motion.div
            className="flex flex-col items-center justify-end shrink-0 z-30"
            style={{
              width: "clamp(72px, 14vw, 150px)",
              y: archScale as unknown as string,
            }}
            initial={{ opacity: 0, scale: 0.65, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Arch pulse glow */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                background: "radial-gradient(ellipse at 50% 30%, hsl(42 85% 52% / 0.18), transparent 65%)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div style={{ height: "clamp(210px, 42vw, 400px)", width: "100%", position: "relative" }}>
              <MandapArch />
            </div>
          </motion.div>

          {/* ═══ BRIDE (slides from right) ═══ */}
          <motion.div
            className="flex flex-col items-center flex-1"
            style={{ maxWidth: "clamp(140px, 28vw, 320px)" }}
            initial={{ x: 220, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name label */}
            <motion.div
              className="mb-5 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={showNames ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.18 }}
            >
              <h3 className="font-serif text-2xl md:text-4xl italic"
                style={{ color: "hsl(42 85% 68%)" }}>
                {brideName.split(" ")[0]}
              </h3>
            </motion.div>

            {/* Portrait frame with parallax + float */}
            <motion.div
              className="relative w-full"
              style={{ aspectRatio: "3/5", y: brideY }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-t-full"
                  animate={{ boxShadow: [
                    "0 0 20px hsl(42 85% 52% / 0.2), 0 0 60px hsl(42 85% 52% / 0.05)",
                    "0 0 35px hsl(42 85% 52% / 0.4), 0 0 80px hsl(42 85% 52% / 0.12)",
                    "0 0 20px hsl(42 85% 52% / 0.2), 0 0 60px hsl(42 85% 52% / 0.05)",
                  ]}}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                />

                <div
                  className="absolute inset-0 rounded-t-full overflow-hidden"
                  style={{ border: "2px solid hsl(42 80% 55% / 0.8)" }}
                >
                  <div
                    className="absolute inset-[5px] rounded-t-full pointer-events-none z-10"
                    style={{ border: "0.8px solid hsl(42 70% 55% / 0.35)" }}
                  />

                  {/* Photo */}
                  <motion.img
                    src={BRIDE_IMG}
                    alt="Bride"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    style={{ filter: "brightness(0.92) contrast(1.05) saturate(1.1)" }}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.05 }}
                  />

                  {/* Color grade — warm maroon tint */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, hsl(350 50% 20% / 0.2) 0%, transparent 50%, hsl(25 40% 8% / 0.55) 100%)",
                    }}
                  />

                  {/* Light sweep */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, hsl(42 90% 80% / 0.14) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3.5, delay: 3.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                  />
                </div>

                <CornerOrnament position="bl" color="hsl(42,80%,60%)" size={32} />
                <CornerOrnament position="br" color="hsl(42,80%,60%)" size={32} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Names reveal ── */}
        <AnimatePresence>
          {showNames && (
            <motion.div
              className="mt-12 text-center flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <OrnamentDivider variant="floral" color="hsl(42,82%,60%)" />

              <motion.h2
                className="font-serif text-4xl md:text-6xl mt-3"
                style={{ color: "hsl(42 85% 68%)" }}
                initial={{ letterSpacing: "0.55em", opacity: 0 }}
                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
              >
                {groomName.split(" ")[0]}
                <span className="mx-4 md:mx-8" style={{ color: "hsl(42 60% 55% / 0.6)" }}>&</span>
                {brideName.split(" ")[0]}
              </motion.h2>

              <motion.p
                className="uppercase tracking-[0.35em] text-xs font-sans"
                style={{ color: "hsl(42 65% 62% / 0.6)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.9 }}
              >
                Two souls, one eternal journey
              </motion.p>

              <OrnamentDivider variant="diamond" color="hsl(42,82%,60%)" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scroll cue ── */}
        <motion.a
          href="#story"
          className="mt-10 flex flex-col items-center gap-2 transition-colors"
          style={{ color: "hsl(42 65% 55% / 0.5)" }}
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ color: "hsl(42 85% 62%)" } as never}
        >
          <span className="uppercase tracking-[0.35em] text-xs font-sans">Our Story</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3L10 17M4 11L10 17L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
