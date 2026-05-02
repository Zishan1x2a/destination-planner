import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { OrnamentDivider } from "@/components/OrnamentalElements";

const BLESSINGS = [
  {
    text: "May your love be like the stars — constant, radiant, and guiding each other through every night.",
    from: "With love from the family",
    icon: "✦",
    delay: 0.1,
  },
  {
    text: "Two hearts, one soul. May this union be the beginning of an eternal story written in gold.",
    from: "A heartfelt blessing",
    icon: "❦",
    delay: 0.3,
  },
  {
    text: "May Udaipur witness the beginning of a journey so beautiful that even the Lake Palace reflects its joy.",
    from: "With blessings & prayers",
    icon: "✦",
    delay: 0.5,
  },
];

/* ─── Floating diya ─── */
function FloatingDiya({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none select-none text-2xl"
      style={{ left: `${x}%` }}
      animate={{ y: [0, -40, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      🪔
    </motion.div>
  );
}

/* ─── Particle ring that floats around the mandala ─── */
function OrbitDot({ angle, radius, duration }: { angle: number; radius: number; duration: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ background: "hsl(42 85% 62%)", top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
      animate={{
        x: [
          Math.cos((angle * Math.PI) / 180) * radius,
          Math.cos(((angle + 360) * Math.PI) / 180) * radius,
        ],
        y: [
          Math.sin((angle * Math.PI) / 180) * radius,
          Math.sin(((angle + 360) * Math.PI) / 180) * radius,
        ],
        opacity: [0.2, 0.9, 0.2],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Center mandala ─── */
function CenterMandala() {
  return (
    <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
      {/* Orbit dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <OrbitDot key={i} angle={a} radius={70} duration={10 + i * 0.5} />
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((a, i) => (
        <OrbitDot key={`inner-${i}`} angle={a} radius={45} duration={7 + i * 0.3} />
      ))}

      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ boxShadow: [
          "0 0 30px hsl(42 85% 52% / 0.2)",
          "0 0 60px hsl(42 85% 52% / 0.45)",
          "0 0 30px hsl(42 85% 52% / 0.2)",
        ]}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mandala SVG */}
      <motion.svg
        viewBox="0 0 120 120"
        className="w-full h-full absolute inset-0"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <g key={i} transform={`rotate(${angle}, 60, 60)`}>
            <path d="M60,10 Q65,35 60,60 Q55,35 60,10" fill="hsl(42,80%,55%)" opacity="0.25" />
            <circle cx="60" cy="12" r="3" fill="hsl(42,85%,60%)" opacity="0.5" />
          </g>
        ))}
        <circle cx="60" cy="60" r="28" stroke="hsl(42,75%,52%)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="60" cy="60" r="20" stroke="hsl(42,75%,52%)" strokeWidth="0.5" opacity="0.2" />
      </motion.svg>

      {/* Inner rotating ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-3/4 h-3/4 absolute"
        fill="none"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <circle
            key={i}
            cx={50 + 32 * Math.cos((a * Math.PI) / 180)}
            cy={50 + 32 * Math.sin((a * Math.PI) / 180)}
            r="2.5"
            fill="hsl(42,85%,62%)"
            opacity="0.5"
          />
        ))}
        <circle cx="50" cy="50" r="30" stroke="hsl(42,70%,52%)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      </motion.svg>

      {/* Center symbol */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
          style={{ background: "hsl(42 40% 14%)", border: "1.5px solid hsl(42 80% 52% / 0.7)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xl md:text-2xl select-none">🪔</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Blessing card ─── */
function BlessingCard({ blessing, index, isInView }: {
  blessing: typeof BLESSINGS[0]; index: number; isInView: boolean;
}) {
  const fromLeft = index % 2 === 0;
  return (
    <motion.div
      className="relative p-6 md:p-8"
      style={{
        background: "linear-gradient(135deg, hsl(25 25% 11%) 0%, hsl(25 20% 8%) 100%)",
        border: "1px solid hsl(42 70% 45% / 0.35)",
        borderRadius: "2px",
      }}
      initial={{ opacity: 0, x: fromLeft ? -80 : 80, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.2 + blessing.delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      {/* Top quote mark */}
      <div className="absolute top-4 left-6 font-serif text-4xl leading-none opacity-30"
        style={{ color: "hsl(42 80% 58%)" }}>"</div>

      {/* Icon */}
      <motion.span
        className="block text-center text-2xl mb-4 select-none"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5 + index * 0.4, repeat: Infinity }}
      >
        {blessing.icon}
      </motion.span>

      <p className="font-serif text-base md:text-lg italic text-center leading-relaxed mb-4"
        style={{ color: "hsl(42 65% 72% / 0.9)" }}>
        {blessing.text}
      </p>

      <p className="text-xs uppercase tracking-[0.25em] text-center font-sans"
        style={{ color: "hsl(42 55% 55% / 0.55)" }}>
        — {blessing.from}
      </p>

      {/* Bottom shimmer line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] rounded-full"
        style={{ background: "linear-gradient(to right, transparent, hsl(42 80% 55% / 0.5), transparent)" }}
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.2, delay: 0.5 + blessing.delay }}
      />
    </motion.div>
  );
}

/* ─── Falling rose ─── */
function Rose({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div className="absolute top-0 pointer-events-none text-base select-none"
      style={{ left: `${x}%` }}
      animate={{ y: "100vh", opacity: [0, 0.7, 0.7, 0], rotate: [0, 90, 180, 270] }}
      transition={{ duration: 6 + delay * 2, delay, repeat: Infinity, repeatDelay: 2, ease: "linear" }}>
      🌹
    </motion.div>
  );
}

export function BlessingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={ref}
      id="blessings"
      className="relative w-full overflow-hidden py-28 px-4"
      style={{ position: "relative", background: "hsl(25 30% 5%)" }}
    >
      {/* Parallax background layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: bgY,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, hsl(42 70% 30% / 0.12) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 20% 80%, hsl(350 50% 25% / 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Falling roses */}
      {[8, 20, 35, 50, 65, 80, 92].map((x, i) => (
        <Rose key={i} x={x} delay={i * 0.8} />
      ))}

      {/* Diyas at bottom */}
      {[10, 25, 40, 60, 75, 90].map((x, i) => (
        <FloatingDiya key={i} x={x} delay={i * 0.6} />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
            style={{ color: "hsl(42 70% 58% / 0.6)" }}>
            Shubh Ashirwad
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic mb-6"
            style={{ color: "hsl(42 85% 68%)" }}>
            Blessings & Wishes
          </h2>
          <OrnamentDivider variant="floral" color="hsl(42,80%,58%)" />
        </motion.div>

        {/* Center mandala */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <CenterMandala />
        </motion.div>

        {/* Blessing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {BLESSINGS.map((b, i) => (
            <BlessingCard key={i} blessing={b} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Bottom Sanskrit shloka */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <p className="font-serif text-lg md:text-xl italic mb-2"
            style={{ color: "hsl(42 70% 62% / 0.7)" }}>
            "Dharme cha, Arthe cha, Kame cha, Moksha cha"
          </p>
          <p className="text-xs uppercase tracking-[0.25em] font-sans"
            style={{ color: "hsl(42 55% 52% / 0.45)" }}>
            In dharma, in wealth, in love, in liberation — together
          </p>
          <div className="mt-8">
            <OrnamentDivider variant="diamond" color="hsl(42,80%,55%)" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
