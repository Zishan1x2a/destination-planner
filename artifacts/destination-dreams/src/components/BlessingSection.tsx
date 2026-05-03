import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { OrnamentDivider } from "@/components/OrnamentalElements";
import { useListBlessings, useCreateBlessing } from "@workspace/api-client-react";

const STATIC_BLESSINGS = [
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
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <OrbitDot key={i} angle={a} radius={70} duration={10 + i * 0.5} />
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((a, i) => (
        <OrbitDot key={`inner-${i}`} angle={a} radius={45} duration={7 + i * 0.3} />
      ))}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ boxShadow: [
          "0 0 30px hsl(42 85% 52% / 0.2)",
          "0 0 60px hsl(42 85% 52% / 0.45)",
          "0 0 30px hsl(42 85% 52% / 0.2)",
        ]}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
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

/* ─── Static blessing card ─── */
function BlessingCard({ blessing, index, isInView }: {
  blessing: typeof STATIC_BLESSINGS[0]; index: number; isInView: boolean;
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
      <div className="absolute top-4 left-6 font-serif text-4xl leading-none opacity-30"
        style={{ color: "hsl(42 80% 58%)" }}>"</div>
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

/* ─── Guest blessing card ─── */
function GuestBlessingCard({ name, message, index }: { name: string; message: string; index: number }) {
  return (
    <motion.div
      className="relative p-5 md:p-6"
      style={{
        background: "linear-gradient(135deg, hsl(42 30% 10%) 0%, hsl(25 20% 8%) 100%)",
        border: "1px solid hsl(42 70% 45% / 0.25)",
        borderRadius: "2px",
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      <div className="absolute top-3 left-4 font-serif text-3xl leading-none opacity-20"
        style={{ color: "hsl(42 80% 58%)" }}>"</div>
      <p className="font-serif text-sm md:text-base italic leading-relaxed mb-3 pt-2"
        style={{ color: "hsl(42 55% 68% / 0.85)" }}>
        {message}
      </p>
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "hsl(42 60% 45% / 0.2)" }} />
        <p className="text-xs uppercase tracking-[0.2em] font-sans"
          style={{ color: "hsl(42 55% 55% / 0.5)" }}>
          {name}
        </p>
        <div className="h-px flex-1" style={{ background: "hsl(42 60% 45% / 0.2)" }} />
      </div>
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

/* ─── Message submission form ─── */
function BlessingForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending } = useCreateBlessing({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setName("");
        setMessage("");
        onSuccess();
        setTimeout(() => setSubmitted(false), 4000);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    mutate({ data: { guestName: name.trim(), message: message.trim() } });
  };

  const inputStyle = {
    background: "hsl(25 25% 9%)",
    border: "1px solid hsl(42 65% 42% / 0.35)",
    borderRadius: "2px",
    color: "hsl(42 60% 82%)",
    outline: "none",
    width: "100%",
    padding: "0.75rem 1rem",
    fontFamily: "inherit",
    fontSize: "0.95rem",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  return (
    <motion.div
      className="relative mt-16"
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

      {/* Top shimmer */}
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
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
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
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meera Sharma"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "hsl(42 75% 52% / 0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "hsl(42 65% 42% / 0.35)")}
              required
            />
          </div>

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
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => (e.target.style.borderColor = "hsl(42 75% 52% / 0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "hsl(42 65% 42% / 0.35)")}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isPending || !name.trim() || !message.trim()}
            className="relative w-full py-3 font-sans text-sm uppercase tracking-[0.25em] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(42 75% 40%) 0%, hsl(38 80% 35%) 100%)",
              border: "1px solid hsl(42 75% 52% / 0.5)",
              borderRadius: "2px",
              color: "hsl(42 90% 88%)",
              cursor: isPending ? "wait" : "pointer",
              opacity: (!name.trim() || !message.trim()) ? 0.5 : 1,
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

        {/* Static blessing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {STATIC_BLESSINGS.map((b, i) => (
            <BlessingCard key={i} blessing={b} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Message submission form */}
        <BlessingForm onSuccess={() => refetch()} />

        {/* Guest blessings */}
        {guestBlessings.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <p className="uppercase tracking-[0.35em] text-xs font-sans mb-2"
                style={{ color: "hsl(42 65% 55% / 0.5)" }}>
                Blessings from Our Loved Ones
              </p>
              <OrnamentDivider variant="diamond" color="hsl(42,70%,52%)" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {guestBlessings.map((b, i) => (
                <GuestBlessingCard key={b.id} name={b.guestName} message={b.message} index={i} />
              ))}
            </div>
          </motion.div>
        )}

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
