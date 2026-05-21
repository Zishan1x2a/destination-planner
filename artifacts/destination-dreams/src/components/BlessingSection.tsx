import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { OrnamentDivider, BackgroundCornerOrnaments } from "@/components/OrnamentalElements";
import { useListBlessings, useCreateBlessing } from "@/lib/mock-api-hooks";

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

/* ─── Bursting leaves when message is sending ─── */
function BurstingLeaves() {
  const leavesCount = 20;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      {Array.from({ length: leavesCount }).map((_, i) => {
        const angle = (i * 360) / leavesCount + (Math.random() - 0.5) * 15;
        const radius = 130 + Math.random() * 180; // Travel range
        const duration = 2.0 + Math.random() * 1.5;
        const delay = Math.random() * 0.3;
        const startRotate = Math.random() * 360;
        const endRotate = startRotate + (Math.random() > 0.5 ? 360 : -360);
        
        return (
          <motion.div
            key={i}
            className="absolute text-2xl select-none"
            initial={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * radius,
              y: Math.sin((angle * Math.PI) / 180) * radius,
              scale: [0.1, 1.4, 0.7],
              opacity: [0, 1, 1, 0],
              rotate: [startRotate, endRotate]
            }}
            transition={{
              duration,
              ease: "easeOut",
              delay
            }}
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-16px",
              marginLeft: "-16px",
            }}
          >
            {/* Elegant mixture of fall and spring leaves for gold-green royal aesthetic */}
            {i % 3 === 0 ? "🍃" : i % 3 === 1 ? "🌿" : "🍁"}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Center mandala ─── */
function CenterMandala({ leafTrigger }: { leafTrigger: number }) {
  const [bursts, setBursts] = useState<{ id: number }[]>([]);

  useEffect(() => {
    if (leafTrigger === 0) return;
    const newId = Date.now();
    setBursts((prev) => [...prev, { id: newId }]);
    
    // Cleanup burst after animation completes (3.8s)
    const timeout = setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newId));
    }, 3800);
    
    return () => clearTimeout(timeout);
  }, [leafTrigger]);

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

      {/* Render active leaf bursts */}
      {bursts.map((b) => (
        <BurstingLeaves key={b.id} />
      ))}
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
interface BlessingItem {
  id: number;
  guestName: string;
  message: string;
}

function BlessingTicker({ blessings }: { blessings: BlessingItem[] }) {
  if (blessings.length === 0) return null;

  const doubled = [...blessings, ...blessings];

  return (
    <div className="relative w-full overflow-hidden mt-10" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, hsl(25 30% 5%), transparent)" }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(25 30% 5%), transparent)" }} />

      <motion.div
        className="flex gap-6 w-max py-2"
        animate={{ x: [0, `-${50}%`] }}
        transition={{ duration: Math.max(blessings.length * 10, 20), repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 flex items-stretch px-5 py-4"
            style={{
              background: "linear-gradient(135deg, hsl(42 35% 11%) 0%, hsl(25 25% 8%) 100%)",
              border: "1.5px solid hsl(42 70% 45% / 0.25)",
              borderRadius: "8px",
              width: "320px",
              minWidth: "320px",
              maxWidth: "320px",
            }}
          >
            {/* Left side: Guest Name in beautiful side-by-side design */}
            <div className="flex flex-col items-center justify-center pr-4 mr-2 border-r border-dashed border-primary/30 min-w-[80px] max-w-[80px] select-none overflow-hidden">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/50 font-sans mb-1">From</span>
              <p className="font-serif text-sm font-semibold text-primary gold-shimmer-text text-center break-words w-full leading-tight">
                {item.guestName || "Well Wisher"}
              </p>
              <span className="text-[10px] text-primary/40 mt-1">✦</span>
            </div>

            {/* Right side: Message */}
            <div className="flex-1 flex flex-col justify-center relative min-w-0 overflow-hidden">
              <div className="absolute top-0 left-0 font-serif text-3xl leading-none opacity-20 text-primary">“</div>
              <p className="font-serif text-[13px] md:text-sm italic leading-relaxed pl-4 pr-1 text-foreground/90 pt-2 break-words whitespace-normal max-h-[96px] overflow-y-auto no-scrollbar">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Message form ─── */
function BlessingForm({ onSuccess, onSendingChange }: { onSuccess: () => void; onSendingChange: (sending: boolean) => void }) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [detectedName, setDetectedName] = useState("Well Wisher");

  // Helper to dynamically read guest name from URL or RSVP localStorage on load/mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const getGuestName = () => {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("guest") || params.get("name");
      if (fromUrl) return fromUrl.trim();
      
      try {
        const fromStorage = localStorage.getItem("wedding_guest_name");
        if (fromStorage) return fromStorage.trim();
      } catch (e) {}
      
      return "Well Wisher";
    };

    setDetectedName(getGuestName());

    // Setup an interval or listener to watch localStorage changes
    const handleStorageChange = () => {
      setDetectedName(getGuestName());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { mutate, isPending } = useCreateBlessing({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setMessage("");
        onSuccess();
        onSendingChange(false);
        // Second celebration burst when successfully sent
        setTimeout(() => onSendingChange(true), 200);
        setTimeout(() => setSubmitted(false), 3500);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendingChange(true);
    mutate({ data: { guestName: detectedName, message: message.trim() } });
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
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
          {/* Blessing Message Input */}
          <div>
            <div className="flex justify-between items-center mb-2 gap-4">
              <label className="block text-xs uppercase tracking-[0.2em] font-sans"
                style={{ color: "hsl(42 60% 55% / 0.6)" }}>
                Your Blessing
              </label>
              {/* Creative design: shows who is sending this blessing automatically! */}
              <div className="text-xs italic font-serif" style={{ color: "hsl(42 50% 55% / 0.6)" }}>
                Sending as: <span className="text-primary gold-shimmer-text font-sans not-italic font-semibold">{detectedName}</span>
              </div>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt wishes for Myra & Aryan…"
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
            {isPending ? "Sending Blessing…" : "Send Blessing ✦"}
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

  const [leafTrigger, setLeafTrigger] = useState(0);

  const handleSendingChange = (sending: boolean) => {
    if (sending) {
      setLeafTrigger((prev) => prev + 1);
    }
  };

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

      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

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
          <CenterMandala leafTrigger={leafTrigger} />
        </motion.div>

        {/* Form */}
        <BlessingForm onSuccess={() => refetch()} onSendingChange={handleSendingChange} />

        {/* Scrolling ticker of submitted blessings */}
        {guestBlessings.length > 0 && (
          <BlessingTicker blessings={guestBlessings} />
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


