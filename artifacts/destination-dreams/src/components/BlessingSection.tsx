import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { OrnamentDivider } from "@/components/OrnamentalElements";
import { useListBlessings, useCreateBlessing } from "@workspace/api-client-react";

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

/* ─── Orbit dot ─── */
function OrbitDot({ angle, radius, duration }: { angle: number; radius: number; duration: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ background: "hsl(42 85% 62%)", top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
      animate={{
        x: [Math.cos((angle * Math.PI) / 180) * radius, Math.cos(((angle + 360) * Math.PI) / 180) * radius],
        y: [Math.sin((angle * Math.PI) / 180) * radius, Math.sin(((angle + 360) * Math.PI) / 180) * radius],
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
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <OrbitDot key={i} angle={a} radius={70} duration={10 + i * 0.5} />
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((a, i) => (
        <OrbitDot key={`inner-${i}`} angle={a} radius={45} duration={7 + i * 0.3} />
      ))}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ boxShadow: ["0 0 30px hsl(42 85% 52% / 0.2)", "0 0 60px hsl(42 85% 52% / 0.45)", "0 0 30px hsl(42 85% 52% / 0.2)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.svg viewBox="0 0 120 120" className="w-full h-full absolute inset-0" fill="none"
        animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <g key={i} transform={`rotate(${angle}, 60, 60)`}>
            <path d="M60,10 Q65,35 60,60 Q55,35 60,10" fill="hsl(42,80%,55%)" opacity="0.25" />
            <circle cx="60" cy="12" r="3" fill="hsl(42,85%,60%)" opacity="0.5" />
          </g>
        ))}
        <circle cx="60" cy="60" r="28" stroke="hsl(42,75%,52%)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="60" cy="60" r="20" stroke="hsl(42,75%,52%)" strokeWidth="0.5" opacity="0.2" />
      </motion.svg>
      <motion.svg viewBox="0 0 100 100" className="w-3/4 h-3/4 absolute" fill="none"
        animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <circle key={i} cx={50 + 32 * Math.cos((a * Math.PI) / 180)} cy={50 + 32 * Math.sin((a * Math.PI) / 180)}
            r="2.5" fill="hsl(42,85%,62%)" opacity="0.5" />
        ))}
        <circle cx="50" cy="50" r="30" stroke="hsl(42,70%,52%)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      </motion.svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
          style={{ background: "hsl(42 40% 14%)", border: "1.5px solid hsl(42 80% 52% / 0.7)" }}
          animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <span className="text-xl md:text-2xl select-none">🪔</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Falling rose ─── */
function Rose({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div className="absolute top-0 pointer-events-none text-base select-none" style={{ left: `${x}%` }}
      animate={{ y: "100vh", opacity: [0, 0.7, 0.7, 0], rotate: [0, 90, 180, 270] }}
      transition={{ duration: 6 + delay * 2, delay, repeat: Infinity, repeatDelay: 2, ease: "linear" }}>
      🌹
    </motion.div>
  );
}

/* ─── Infinite scroll ticker ─── */
function BlessingTicker({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  const doubled = [...messages, ...messages];

  return (
    <div className="relative w-full overflow-hidden mt-10" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, hsl(25 30% 5%), transparent)" }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(25 30% 5%), transparent)" }} />

      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: [0, `-${50}%`] }}
        transition={{ duration: Math.max(messages.length * 8, 20), repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((msg, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 px-6 py-4 max-w-xs"
            style={{
              background: "linear-gradient(135deg, hsl(42 30% 10%) 0%, hsl(25 20% 8%) 100%)",
              border: "1px solid hsl(42 70% 45% / 0.25)",
              borderRadius: "2px",
              minWidth: "220px",
            }}
          >
            <div className="absolute top-2 left-3 font-serif text-2xl leading-none opacity-20"
              style={{ color: "hsl(42 80% 58%)" }}>"</div>
            <p className="font-serif text-sm italic leading-relaxed pt-1"
              style={{ color: "hsl(42 60% 70% / 0.85)" }}>
              {msg}
            </p>
            <div className="mt-2 flex justify-center">
              <span className="text-xs" style={{ color: "hsl(42 70% 52% / 0.4)" }}>✦</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Message form ─── */
function BlessingForm({ onSuccess }: { onSuccess: () => void }) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending } = useCreateBlessing({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setMessage("");
        onSuccess();
        setTimeout(() => setSubmitted(false), 3500);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    mutate({ data: { guestName: "Guest", message: message.trim() } });
  };

  return (
    <motion.div
      className="relative"
      style={{
        background: "linear-gradient(135deg, hsl(25 28% 10%) 0%, hsl(25 20% 7%) 100%)",
        border: "1px solid hsl(42 70% 45% / 0.3)",
        borderRadius: "2px",
        padding: "2.5rem 2rem",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Corner accents */}
      {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"],
        ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]].map(([pos, borders], i) => (
        <div key={i} className={`absolute ${pos} w-6 h-6 ${borders}`}
          style={{ borderColor: "hsl(42 75% 52% / 0.5)" }} />
      ))}

      {/* Shimmer line */}
      <motion.div
        className="absolute top-0 left-0 h-[1px] rounded-full"
        style={{ background: "linear-gradient(to right, transparent, hsl(42 80% 55% / 0.6), transparent)" }}
        animate={{ width: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="text-center mb-8">
        <p className="uppercase tracking-[0.35em] text-xs font-sans mb-3"
          style={{ color: "hsl(42 70% 55% / 0.6)" }}>
          Leave a Message
        </p>
        <h3 className="font-serif text-2xl md:text-3xl italic"
          style={{ color: "hsl(42 80% 65%)" }}>
          Share Your Blessings
        </h3>
        <p className="text-sm mt-2 font-sans"
          style={{ color: "hsl(42 40% 60% / 0.5)" }}>
          Your words of love will be cherished forever
        </p>
      </div>

      {submitted ? (
        <motion.div className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
          <div className="text-4xl mb-4 select-none">🪔</div>
          <p className="font-serif text-xl italic mb-2" style={{ color: "hsl(42 80% 65%)" }}>
            Dhanyavaad!
          </p>
          <p className="text-sm font-sans" style={{ color: "hsl(42 50% 55% / 0.6)" }}>
            Your blessing has been received with love.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-sans"
              style={{ color: "hsl(42 60% 55% / 0.6)" }}>
              Your Blessing
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt wishes for Priya & Arjun…"
              rows={4}
              style={{
                background: "hsl(25 25% 9%)",
                border: "1px solid hsl(42 65% 42% / 0.35)",
                borderRadius: "2px",
                color: "hsl(42 60% 82%)",
                outline: "none",
                width: "100%",
                padding: "0.75rem 1rem",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                resize: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "hsl(42 75% 52% / 0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "hsl(42 65% 42% / 0.35)")}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isPending || !message.trim()}
            className="relative w-full py-3 font-sans text-sm uppercase tracking-[0.25em] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(42 75% 40%) 0%, hsl(38 80% 35%) 100%)",
              border: "1px solid hsl(42 75% 52% / 0.5)",
              borderRadius: "2px",
              color: "hsl(42 90% 88%)",
              cursor: isPending ? "wait" : "pointer",
              opacity: !message.trim() ? 0.5 : 1,
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent 0%, hsl(42 90% 70% / 0.15) 50%, transparent 100%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {isPending ? "Sending…" : "Send Blessing ✦"}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}

export function BlessingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const { data: guestBlessings = [], refetch } = useListBlessings();

  return (
    <section
      ref={ref}
      id="blessings"
      className="relative w-full overflow-hidden py-28 px-4"
      style={{ position: "relative", background: "hsl(25 30% 5%)" }}
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{
        y: bgY,
        background: "radial-gradient(ellipse 70% 60% at 50% 40%, hsl(42 70% 30% / 0.12) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 20% 80%, hsl(350 50% 25% / 0.08) 0%, transparent 60%)",
      }} />

      {/* Falling roses */}
      {[8, 20, 35, 50, 65, 80, 92].map((x, i) => <Rose key={i} x={x} delay={i * 0.8} />)}

      {/* Diyas */}
      {[10, 25, 40, 60, 75, 90].map((x, i) => <FloatingDiya key={i} x={x} delay={i * 0.6} />)}

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}>
          <p className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
            style={{ color: "hsl(42 70% 58% / 0.6)" }}>Shubh Ashirwad</p>
          <h2 className="font-serif text-4xl md:text-5xl italic mb-6"
            style={{ color: "hsl(42 85% 68%)" }}>Blessings & Wishes</h2>
          <OrnamentDivider variant="floral" color="hsl(42,80%,58%)" />
        </motion.div>

        {/* Mandala */}
        <motion.div className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <CenterMandala />
        </motion.div>

        {/* Form */}
        <BlessingForm onSuccess={() => refetch()} />

        {/* Scrolling ticker of submitted blessings */}
        {guestBlessings.length > 0 && (
          <BlessingTicker messages={guestBlessings.map((b) => b.message)} />
        )}

        {/* Bottom shloka */}
        <motion.div className="mt-16 text-center"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}>
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
