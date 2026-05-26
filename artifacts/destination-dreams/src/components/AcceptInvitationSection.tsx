import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CornerOrnament, OrnamentDivider, BackgroundCornerOrnaments } from "@/components/OrnamentalElements";
import { MOCK_WEDDING_CONFIG } from "@/constants/mockConfig";
import { useToast } from "@/hooks/use-toast";
import { X, Edit, Check } from "lucide-react";

/* ─── Burst particle (Fireworks + Flowers) ─── */
interface ParticleData {
  id: number;
  type: "firework" | "petal";
  angle: number;
  speed: number;
  size: number;
  color: string;
  emoji?: string;
  spin?: number;
}

function BurstParticle({ p }: { p: ParticleData }) {
  const vx = Math.cos((p.angle * Math.PI) / 180) * p.speed;
  const vy = Math.sin((p.angle * Math.PI) / 180) * p.speed;
  
  if (p.type === "petal") {
    return (
      <motion.div
        className="absolute pointer-events-none select-none font-sans"
        style={{
          fontSize: p.size,
          top: "50%",
          left: "50%",
          marginTop: -p.size / 2,
          marginLeft: -p.size / 2,
          zIndex: 50,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
        animate={{ 
          x: [0, vx * 0.7, vx * 1.0, vx * 1.1 + Math.sin(p.id) * 30],
          y: [0, vy * 0.5, vy * 0.9 + 80, vy * 1.2 + 220],
          opacity: [1, 1, 0.8, 0],
          scale: [0.5, 1.2, 1.0, 0.4],
          rotate: [0, p.spin ? p.spin : 180, p.spin ? p.spin * 2.5 : 360],
        }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      >
        {p.emoji}
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: p.size,
          height: p.size,
          background: p.color,
          boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
          top: "50%",
          left: "50%",
          marginTop: -p.size / 2,
          marginLeft: -p.size / 2,
          zIndex: 60,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{ 
          x: [0, vx * 0.6, vx * 1.0, vx * 1.2],
          y: [0, vy * 0.6, vy * 1.0 + 30, vy * 1.2 + 80],
          opacity: [1, 0.9, 0.4, 0],
          scale: [1, 1.3, 0.7, 0]
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    );
  }
}

function generateBurst(): ParticleData[] {
  const fireworkColors = [
    "hsl(42, 100%, 65%)",
    "hsl(350, 95%, 60%)",
    "hsl(190, 95%, 60%)",
    "hsl(130, 95%, 60%)",
    "hsl(280, 100%, 65%)",
    "hsl(45, 100%, 75%)",
  ];
  const flowerEmojis = ["🌸", "🌹", "🏵️", "🌻", "🌺", "🌼"];
  
  const particles: ParticleData[] = [];
  
  for (let i = 0; i < 48; i++) {
    particles.push({
      id: i,
      type: "firework",
      angle: (i / 48) * 360 + Math.random() * 10,
      speed: 80 + Math.random() * 110,
      size: 3 + Math.random() * 5,
      color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
    });
  }
  
  for (let i = 0; i < 24; i++) {
    particles.push({
      id: 100 + i,
      type: "petal",
      angle: (i / 24) * 360 + Math.random() * 15,
      speed: 40 + Math.random() * 50,
      size: 14 + Math.random() * 12,
      color: "",
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 180),
    });
  }
  
  return particles;
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
        border: "1.5px solid hsl(42 85% 55% / 0.45)",
        boxShadow: "0 0 20px hsl(42 85% 55% / 0.25)",
        top: "50%", left: "50%",
        marginTop: -size / 2, marginLeft: -size / 2,
      }}
      animate={{ scale: [1, 1.65], opacity: [0.65, 0] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

interface FormFieldConfig {
  id: string;
  type: 'short text' | 'long text' | 'number' | 'time' | 'date' | 'select' | 'multi-select' | 'phone' | 'email' | 'yes/no toggle';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export function AcceptInvitationSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { toast } = useToast();

  // Check if we need to reset the preview state
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "true") {
      localStorage.removeItem("rsvp_status");
      localStorage.removeItem("rsvp_answers");
    }
  }

  const [burst, setBurst] = useState<ParticleData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  // 1. Settings state (Load and parse parameters)
  const [config] = useState(() => {
    const baseRsvp = MOCK_WEDDING_CONFIG.rsvp;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const rsvpType = params.get("rsvp");
      const edit = params.get("edit");
      
      const type = rsvpType === "simple" ? "simple" : rsvpType === "detailed" ? "detailed" : baseRsvp.rsvpType;
      const allowEdit = edit === "off" ? false : edit === "on" ? true : baseRsvp.allowEditRsvp;
      
      return {
        rsvpType: type,
        allowEditRsvp: allowEdit,
        form: baseRsvp.form
      };
    }
    return baseRsvp;
  });

  // 2. RSVP State Flow
  const [status, setStatus] = useState<"not_responded" | "accepted" | "submitted">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const screen = params.get("screen");
      if (screen === "accepted") return "accepted";
      if (screen === "submitted") return "submitted";
      
      const savedStatus = localStorage.getItem("rsvp_status");
      if (savedStatus) return savedStatus as any;
    }
    return "not_responded";
  });

  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const screen = params.get("screen");
      
      const savedAnswers = localStorage.getItem("rsvp_answers");
      if (savedAnswers) {
        try {
          return JSON.parse(savedAnswers);
        } catch (e) {}
      }
      
      // Seed details if testing submitted screen directly
      if (screen === "submitted") {
        return {
          guestCount: 2,
          arrivalTime: "18:30",
          mealPreference: "Veg"
        };
      }
    }
    return {};
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("rsvp_status", status);
  }, [status]);

  useEffect(() => {
    localStorage.setItem("rsvp_answers", JSON.stringify(answers));
  }, [answers]);

  // Handle Invitation Acceptance (Stage 1 -> Stage 2)
  const handleAccept = useCallback(() => {
    setBurst(generateBurst());
    setShowConfetti(true);

    const isDetailed = config.rsvpType === "detailed";
    const nextStatus = isDetailed ? "accepted" : "submitted";
    setStatus(nextStatus);

    setTimeout(() => {
      setBurst([]);
    }, 3000);

    toast({
      title: "Invitation Accepted!",
      description: isDetailed 
        ? "Please share your travel & stay preferences."
        : "Thank you for confirming. We look forward to celebrating with you!",
      className: "bg-card text-card-foreground border-primary font-serif text-lg",
    });
  }, [config.rsvpType, toast]);

  // Handle Form field update
  const updateAnswer = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    // Clear validation error when editing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // Form Submission Validator & Logic
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    config.form.fields.forEach((field) => {
      const val = answers[field.id];
      if (field.required && (val === undefined || val === null || val === "")) {
        nextErrors[field.id] = "Required field";
      }
      if (field.type === "email" && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          nextErrors[field.id] = "Invalid email";
        }
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast({
        variant: "destructive",
        title: "Incomplete Details",
        description: "Please fill out all required fields correctly.",
        className: "bg-destructive text-destructive-foreground font-serif",
      });
      return;
    }

    // Success -> Transition to stage 3
    setStatus("submitted");
    setIsModalOpen(false);
    setShowConfetti(true);

    toast({
      title: "Preferences Saved!",
      description: "We have recorded your details. Udaipur awaits!",
      className: "bg-card text-card-foreground border-primary font-serif text-lg",
    });
  };

  // Dynamically render input elements based on field type config
  const renderField = (field: FormFieldConfig) => {
    const value = answers[field.id];
    const error = errors[field.id];

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-primary uppercase tracking-widest text-[10px] block font-sans font-semibold">
            {field.label} {field.required && <span className="text-red-400 font-bold">*</span>}
          </label>
          {error && <span className="text-red-400 text-[10px] font-sans font-medium uppercase tracking-wider">{error}</span>}
        </div>

        {field.type === 'short text' && (
          <input
            type="text"
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none italic transition-all duration-300`}
          />
        )}

        {field.type === 'long text' && (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            rows={3}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none italic transition-all duration-300 resize-none`}
          />
        )}

        {field.type === 'number' && (
          <input
            type="number"
            placeholder={field.placeholder || 'e.g. 1'}
            value={value !== undefined ? value : ''}
            onChange={(e) => updateAnswer(field.id, e.target.value === '' ? '' : Number(e.target.value))}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none italic transition-all duration-300`}
          />
        )}

        {field.type === 'phone' && (
          <input
            type="tel"
            placeholder={field.placeholder || 'e.g. +91 99999 99999'}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none italic transition-all duration-300`}
          />
        )}

        {field.type === 'email' && (
          <input
            type="email"
            placeholder={field.placeholder || 'john@example.com'}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none italic transition-all duration-300`}
          />
        )}

        {field.type === 'time' && (
          <input
            type="time"
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none transition-all duration-300`}
          />
        )}

        {field.type === 'date' && (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            className={`w-full bg-black/20 border-0 border-b ${
              error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
            } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none transition-all duration-300`}
          />
        )}

        {field.type === 'select' && (
          <div className="relative">
            <select
              value={value || ''}
              onChange={(e) => updateAnswer(field.id, e.target.value)}
              className={`w-full bg-black/20 border-0 border-b ${
                error ? 'border-red-400' : 'border-primary/40 focus:border-primary'
              } rounded-none px-0 py-2 text-card-foreground font-serif text-lg focus:outline-none focus:ring-0 shadow-none italic transition-all duration-300 appearance-none cursor-pointer`}
            >
              <option value="" className="bg-card text-card-foreground/50">Select option...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="bg-card text-card-foreground">{opt}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary text-[8px]">▼</div>
          </div>
        )}

        {field.type === 'multi-select' && (
          <div className="flex flex-wrap gap-2 pt-1">
            {field.options?.map((opt) => {
              const currentSelections = (value as string[]) || [];
              const isSelected = currentSelections.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const nextSelections = isSelected
                      ? currentSelections.filter((s) => s !== opt)
                      : [...currentSelections, opt];
                    updateAnswer(field.id, nextSelections);
                  }}
                  className={`px-3 py-1.5 font-serif italic text-xs transition-all duration-300 border ${
                    isSelected
                      ? 'bg-primary/25 border-primary text-primary shadow-[inset_0_0_6px_hsl(var(--primary)/0.25)] font-semibold'
                      : 'border-primary/20 bg-black/10 text-card-foreground/70 hover:border-primary/50'
                  }`}
                >
                  {opt} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        )}

        {field.type === 'yes/no toggle' && (
          <div className="flex gap-4 pt-1">
            {[
              { val: true, lbl: 'Yes' },
              { val: false, lbl: 'No' },
            ].map((opt) => {
              const isSelected = value === opt.val;
              return (
                <button
                  key={opt.lbl}
                  type="button"
                  onClick={() => updateAnswer(field.id, opt.val)}
                  className={`flex-1 py-2 font-serif italic text-sm transition-all duration-300 border text-center ${
                    isSelected
                      ? 'bg-primary/25 border-primary text-primary shadow-[inset_0_0_8px_hsl(var(--primary)/0.3)] font-bold'
                      : 'border-primary/20 bg-black/10 text-card-foreground/70 hover:border-primary/50'
                  }`}
                >
                  {opt.lbl}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      ref={ref}
      id="rsvp"
      className="relative w-full overflow-hidden py-28 px-4"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, hsl(25 30% 5%) 0%, hsl(28 25% 8%) 50%, hsl(25 30% 4%) 100%)",
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, hsl(42 80% 40% / 0.12) 0%, transparent 65%)" }} />

      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

      {/* Background sparkles */}
      {BG_SPARKLES.map((s, i) => <BgSparkle key={i} x={s.x} y={s.y} delay={s.delay} />)}

      {/* Confetti (shown after accept) */}
      <AnimatePresence>
        {showConfetti && CONFETTI_DATA.map((c, i) => <Confetti key={i} delay={c.delay} x={c.x} />)}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto">

        {/* Header */}
        <AnimatePresence>
          {status === "not_responded" && (
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: -20 }} 
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              transition={{ duration: 0.9 }}
            >
              <p 
                className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
                style={{ color: "hsl(42 70% 58% / 0.6)" }}
              >
                RSVP
              </p>
              <h2 
                className="font-serif text-4xl md:text-5xl italic mb-6"
                style={{ color: "hsl(42 85% 68%)" }}
              >
                Accept Invitation
              </h2>
              <OrnamentDivider variant="floral" color="hsl(42,80%,58%)" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main invitation card */}
        <motion.div
          className="relative flex flex-col items-center justify-center text-center py-12"
          style={{ y: cardY }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ─── Accept button area ─── */}
          <div className="relative flex flex-col items-center justify-center w-full">
            {/* Burst particles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {burst.map(p => <BurstParticle key={p.id} p={p} />)}
            </div>

            {/* Pulse rings */}
            {status === "not_responded" && isInView && (
              <>
                <PulseRing size={260} delay={0} />
                <PulseRing size={320} delay={0.8} />
                <PulseRing size={380} delay={1.6} />
              </>
            )}

            <AnimatePresence mode="wait">
              {status === "not_responded" ? (
                <motion.button
                  key="accept-btn"
                  onClick={handleAccept}
                  className="relative group cursor-pointer p-[12px] flex items-center justify-center"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {/* Golden Aura Glow behind the button */}
                  <motion.div
                    className="absolute -inset-1 rounded-md opacity-50 blur-md pointer-events-none transition duration-500 group-hover:opacity-100 group-hover:blur-lg"
                    style={{
                      background: "linear-gradient(90deg, hsl(42 95% 55%), hsl(45 95% 68%), hsl(42 95% 55%))",
                    }}
                  />

                  {/* Majestic Royal Mandala Aura & Sunburst Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <motion.div
                      className="absolute w-[220px] h-[220px] rounded-full pointer-events-none"
                      style={{
                        border: "1px solid hsl(42 95% 65% / 0.25)",
                        background: "radial-gradient(circle, hsl(42 95% 60% / 0.12) 0%, transparent 70%)",
                      }}
                      animate={{
                        scale: [0.85, 1.25],
                        opacity: [0.6, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <motion.div
                      className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
                      style={{
                        border: "1px dashed hsl(42 95% 65% / 0.15)",
                      }}
                      animate={{
                        scale: [0.95, 1.4],
                        opacity: [0.4, 0],
                      }}
                      transition={{
                        duration: 4.5,
                        delay: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    <motion.div
                      className="absolute w-[270px] h-[270px] flex items-center justify-center opacity-45 group-hover:opacity-85 transition-all duration-700"
                      initial={{ scale: 0.9, rotate: 0 }}
                      animate={{ 
                        rotate: 360,
                        scale: [0.96, 1.04, 0.96]
                      }}
                      transition={{ 
                        rotate: { duration: 28, repeat: Infinity, ease: "linear" },
                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="25" stroke="url(#mandalaGold)" strokeWidth="0.75" strokeDasharray="2 2" />
                        <circle cx="100" cy="100" r="45" stroke="url(#mandalaGold)" strokeWidth="1.2" />
                        <circle cx="100" cy="100" r="75" stroke="url(#mandalaGold)" strokeWidth="0.8" strokeDasharray="1 3" />
                        {Array.from({ length: 12 }).map((_, i) => {
                          const angle = (i * 360) / 12;
                          return (
                            <g key={i} transform={`rotate(${angle} 100 100)`}>
                              <path d="M100,52 C95,62 92,72 100,77 C108,72 105,62 100,52 Z" fill="url(#mandalaGold)" opacity="0.45" />
                              <circle cx="100" cy="46" r="1.5" fill="url(#mandalaGold)" />
                            </g>
                          );
                        })}
                        {Array.from({ length: 24 }).map((_, i) => {
                          const angle = (i * 360) / 24;
                          return (
                            <g key={i} transform={`rotate(${angle} 100 100)`}>
                              <path d="M100,20 L102,26 L98,26 Z" fill="url(#mandalaGold)" />
                              <circle cx="100" cy="12" r="1" fill="url(#mandalaGold)" opacity="0.7" />
                            </g>
                          );
                        })}
                        <defs>
                          <linearGradient id="mandalaGold" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                            <stop offset="50%" stopColor="hsl(45, 95%, 60%)" />
                            <stop offset="100%" stopColor="hsl(38, 85%, 45%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  </div>

                  {/* Deep Velvet Royal Crimson Plate */}
                  <div
                    className="relative px-12 py-5 overflow-hidden flex items-center justify-center gap-3 rounded-[4px]"
                    style={{
                      background: "linear-gradient(135deg, hsl(345 75% 16%) 0%, hsl(345 85% 8%) 100%)",
                      border: "1px solid hsl(42 85% 50% / 0.4)",
                      boxShadow: "inset 0 0 15px hsl(42 80% 50% / 0.5), 0 6px 20px hsl(0 0% 0% / 0.4)",
                    }}
                  >
                    {/* Luxury Zari Embroidery Pattern Overlay */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="royalZari" width="60" height="60" patternUnits="userSpaceOnUse">
                          <path d="M0 30 L30 0 L60 30 L30 60 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                          <circle cx="30" cy="30" r="3" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="1" />
                          <path d="M30 25 L30 35 M25 30 L35 30 M26.5 26.5 L33.5 33.5 M26.5 33.5 L33.5 26.5" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                          <path d="M0 0 C 4 8, 8 4, 12 12 C 8 8, 4 4, 0 0 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                          <path d="M60 0 C 56 8, 52 4, 48 12 C 52 8, 56 4, 60 0 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                          <path d="M0 60 C 4 52, 8 56, 12 48 C 8 52, 4 56, 0 60 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                          <path d="M60 60 C 56 52, 52 56, 48 48 C 52 52, 56 56, 60 60 Z" fill="none" stroke="hsl(42 85% 65%)" strokeWidth="0.75" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#royalZari)" />
                    </svg>

                    {/* Luxury Shimmer sweep */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 85% / 0.3) 50%, transparent 70%)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                    />

                    {/* Continuous Rising Gold Dust particles */}
                    {Array.from({ length: 6 }).map((_, i) => {
                      const left = `${15 + i * 14}%`;
                      const delay = i * 0.35;
                      const duration = 2.2 + Math.random() * 1.2;
                      const scale = 0.5 + Math.random() * 0.7;
                      return (
                        <motion.div
                          key={i}
                          className="absolute pointer-events-none rounded-full"
                          style={{
                            left,
                            bottom: "0%",
                            width: "5px",
                            height: "5px",
                            background: "radial-gradient(circle, hsl(42, 100%, 75%) 0%, transparent 80%)",
                            boxShadow: "0 0 8px hsl(42 100% 70%)",
                            zIndex: 1,
                          }}
                          animate={{
                            y: ["0px", "-45px"],
                            opacity: [0, 0.9, 0],
                            scale: [0.4, scale, 0],
                          }}
                          transition={{
                            duration,
                            delay,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      );
                    })}

                    {/* Left pulsing golden royal star ornament */}
                    <motion.svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative z-10"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M12 21 C12 21 8 16 12 10 C16 16 12 21 12 21 Z" fill="url(#starGoldGradient)" />
                      <path d="M12 21 C12 21 5 18 8 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                      <path d="M12 21 C12 21 19 18 16 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                      <path d="M12 21 C12 21 2 20 5 16 C9 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                      <path d="M12 21 C12 21 22 20 19 16 C15 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                      <defs>
                        <linearGradient id="starGoldGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                          <stop offset="100%" stopColor="hsl(42, 85%, 45%)" />
                        </linearGradient>
                      </defs>
                    </motion.svg>

                    {/* Button Text */}
                    <span
                      className="relative z-10 font-serif text-lg tracking-[0.2em] font-medium"
                      style={{
                        color: "hsl(42 90% 88%)",
                        textShadow: "0 2px 4px hsl(345 85% 4% / 0.5)",
                      }}
                    >
                      Accept Invitation
                    </span>

                    {/* Right pulsing golden royal star ornament */}
                    <motion.svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative z-10"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <path d="M12 21 C12 21 8 16 12 10 C16 16 12 21 12 21 Z" fill="url(#starGoldGradient)" />
                      <path d="M12 21 C12 21 5 18 8 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                      <path d="M12 21 C12 21 19 18 16 13 C12 16 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.8" />
                      <path d="M12 21 C12 21 2 20 5 16 C9 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                      <path d="M12 21 C12 21 22 20 19 16 C15 17 12 21 12 21 Z" fill="url(#starGoldGradient)" opacity="0.6" />
                    </motion.svg>
                  </div>

                  {/* Architectural Rajasthani Mehrab Gate Frame Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <svg width="100%" height="100%" viewBox="0 0 360 108" preserveAspectRatio="none" fill="none" className="opacity-75 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500">
                      <path d="M21,90 L21,48 C21,33 48,27 135,27 C152,27 167,20 180,11 C193,20 208,27 225,27 C312,27 339,33 339,48 L339,90" stroke="url(#goldGradientArch)" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M15,90 L15,45 C15,28 45,22 135,22 C155,22 170,14 180,4 C190,14 205,22 225,22 C315,22 345,28 345,45 L345,90" stroke="url(#goldGradientArch)" strokeWidth="1.5" />
                      <path d="M10,90 L26,90 L18,84 Z" fill="url(#goldGradientArch)" />
                      <path d="M334,90 L350,90 L342,84 Z" fill="url(#goldGradientArch)" />
                      <g transform="translate(168, -8)">
                        <path d="M12,18 C12,18 7,12 12,4 C17,12 12,18 12,18 Z" fill="url(#goldGradientArch)" />
                        <path d="M12,18 C12,18 4,14 6,7 C12,11 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.8" />
                        <path d="M12,18 C12,18 20,14 18,7 C12,11 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.8" />
                        <path d="M12,18 C12,18 1,17 2,12 C8,13 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.6" />
                        <path d="M12,18 C12,18 23,17 22,12 C16,13 12,18 12,18 Z" fill="url(#goldGradientArch)" opacity="0.6" />
                      </g>
                      <defs>
                        <linearGradient id="goldGradientArch" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                          <stop offset="35%" stopColor="hsl(45, 95%, 65%)" />
                          <stop offset="70%" stopColor="hsl(42, 85%, 45%)" />
                          <stop offset="100%" stopColor="hsl(42, 95%, 70%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="accepted-msg"
                  className="text-center py-4 flex flex-col items-center justify-center w-full"
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Luxury Serif Thank You Banner */}
                  <motion.h2
                    className="font-serif text-5xl md:text-6xl tracking-widest mb-1 italic"
                    style={{
                      color: "transparent",
                      background: "linear-gradient(90deg, hsl(42 95% 72%), hsl(45 95% 85%), hsl(42 95% 72%))",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      textShadow: "0 4px 15px rgba(251,191,36,0.25)",
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    Thank You
                  </motion.h2>

                  <motion.p
                    className="text-[10px] uppercase tracking-[0.35em] mb-6"
                    style={{ color: "hsl(42 60% 70% / 0.8)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Your presence is our greatest blessing
                  </motion.p>

                  {/* Immersive Udaipur Lake Palace Illustration */}
                  <div className="relative w-full max-w-[280px] mx-auto mb-6 flex justify-center items-center">
                    <svg width="240" height="100" viewBox="0 0 240 100" fill="none" className="relative z-10 filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.15)]">
                      <motion.circle
                        cx="120"
                        cy="50"
                        r="32"
                        fill="url(#goldSunGradient)"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.15, opacity: [0.2, 0.45, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.path
                        d="M120,10 L120,18 M120,82 L120,90 M80,50 L88,50 M152,50 L160,50 M92,22 L98,28 M148,22 L142,28 M92,78 L98,72 M148,78 L142,72"
                        stroke="hsl(42 85% 65% / 0.5)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: "120px 50px" }}
                      />
                      <motion.path
                        d="M 15,65
                           L 30,65 L 30,50 L 42,50 L 42,65
                           L 65,65 L 65,42 L 72,42 L 72,36 C 72,30 77,27 81,27 C 85,27 90,30 90,36 L 90,42 L 98,42 L 98,65
                           L 108,65 L 108,32 L 112,32 L 112,25 C 112,16 119,12 124,12 C 129,12 136,16 136,25 L 136,32 L 140,32 L 140,65
                           L 150,65 L 150,42 L 158,42 L 158,36 C 158,30 163,27 167,27 C 171,27 176,30 176,36 L 176,42 L 182,42 L 182,65
                           L 210,65 L 210,50 L 222,50 L 222,65 L 235,65
                           L 235,70 L 15,70 Z"
                        fill="url(#goldPalaceGradient)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      <motion.path
                        d="M10,74 C30,71 50,77 70,74 C90,71 110,77 130,74 C150,71 170,77 190,74 C210,71 230,77 230,74"
                        stroke="url(#lakeRipplesGradient)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        animate={{ x: [-4, 4, -4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.path
                        d="M15,80 C35,78 55,82 75,80 C95,78 115,82 135,80 C155,78 175,82 195,80 C215,78 225,80 225,80"
                        stroke="url(#lakeRipplesGradient)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.6"
                        animate={{ x: [4, -4, 4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="goldSunGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                          <stop offset="100%" stopColor="hsl(42, 85%, 45% / 0)" />
                        </linearGradient>
                        <linearGradient id="goldPalaceGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                          <stop offset="50%" stopColor="hsl(42, 85%, 55%)" />
                          <stop offset="100%" stopColor="hsl(38, 80%, 40%)" />
                        </linearGradient>
                        <linearGradient id="lakeRipplesGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(42 85% 65% / 0.1)" />
                          <stop offset="50%" stopColor="hsl(42 85% 65% / 0.6)" />
                          <stop offset="100%" stopColor="hsl(42 85% 65% / 0.1)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Sparkly Rising Gold Dust */}
                    {Array.from({ length: 8 }).map((_, i) => {
                      const left = `${20 + i * 8.5}%`;
                      const delay = i * 0.45;
                      const duration = 2.5 + Math.random() * 1.5;
                      const scale = 0.4 + Math.random() * 0.6;
                      return (
                        <motion.div
                          key={i}
                          className="absolute pointer-events-none rounded-full"
                          style={{
                            left,
                            bottom: "25%",
                            width: "4px",
                            height: "4px",
                            background: "radial-gradient(circle, hsl(42, 100%, 75%) 0%, transparent 80%)",
                            boxShadow: "0 0 6px hsl(42 100% 70%)",
                            zIndex: 5,
                          }}
                          animate={{
                            y: ["0px", "-60px"],
                            opacity: [0, 0.85, 0],
                            scale: [0.3, scale, 0],
                          }}
                          transition={{
                            duration,
                            delay,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Stage message headers */}
                  <motion.h3
                    className="font-serif text-3xl italic tracking-wide mb-2"
                    style={{
                      color: "hsl(42 90% 72%)",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    We'll see you there!
                  </motion.h3>
                  
                  <motion.p
                    className="text-xs uppercase tracking-[0.35em] font-sans mb-8"
                    style={{ color: "hsl(42 70% 58% / 0.85)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    Udaipur awaits your presence
                  </motion.p>

                  {/* Summary of choices (Only in Stage 3 - Detailed) */}
                  {status === "submitted" && config.rsvpType === "detailed" && (
                    <motion.div 
                      className="border border-primary/30 bg-black/30 p-6 max-w-sm w-full font-serif text-left space-y-3 mb-6 relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/60" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/60" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/60" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/60" />

                      <h4 className="text-primary text-[10px] uppercase tracking-widest text-center font-sans font-semibold mb-4 border-b border-primary/20 pb-2">
                        Your RSVP Details
                      </h4>

                      {config.form.fields.map((field) => {
                        const val = answers[field.id];
                        let displayVal = "Not provided";
                        if (val !== undefined && val !== null && val !== "") {
                          if (Array.isArray(val)) {
                            displayVal = val.join(", ");
                          } else if (typeof val === "boolean") {
                            displayVal = val ? "Yes" : "No";
                          } else {
                            displayVal = String(val);
                          }
                        }
                        return (
                          <div key={field.id} className="flex justify-between text-sm italic">
                            <span className="text-card-foreground/60">{field.label}:</span>
                            <span className="text-primary font-semibold">{displayVal}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Interactive Button (Complete / Edit) */}
                  {config.rsvpType === "detailed" && (
                    <div className="flex justify-center gap-4">
                      {status === "accepted" ? (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="relative px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif uppercase tracking-widest text-sm border border-primary/50 transition-all flex items-center gap-2 group shadow-lg cursor-pointer rounded-[2px]"
                        >
                          <span className="absolute -inset-1 rounded-sm opacity-25 blur-md pointer-events-none transition duration-500 group-hover:opacity-60 group-hover:blur-lg bg-gradient-to-r from-primary via-yellow-400 to-primary" />
                          <span className="relative z-10 flex items-center gap-2">
                            Submit RSVP Details <span className="text-xs">✦</span>
                          </span>
                        </button>
                      ) : (
                        config.allowEditRsvp && (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-3 border border-primary/60 text-primary hover:bg-primary/10 font-serif uppercase tracking-widest text-sm transition-all flex items-center gap-2 cursor-pointer rounded-[2px] backdrop-blur-sm bg-black/10"
                          >
                            <Edit size={14} />
                            <span>Edit RSVP Details</span>
                          </button>
                        )
                      )}
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ─── Generic Royal Dynamic Modal Form ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card text-card-foreground border-2 border-primary/50 rounded-none w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Corner Ornaments */}
              <div className="opacity-60">
                <CornerOrnament position="tl" color="hsl(var(--primary))" size={24} />
                <CornerOrnament position="tr" color="hsl(var(--primary))" size={24} />
                <CornerOrnament position="bl" color="hsl(var(--primary))" size={24} />
                <CornerOrnament position="br" color="hsl(var(--primary))" size={24} />
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-primary/60 hover:text-primary transition-colors hover:rotate-90 duration-300 z-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Decorative Mehrab gate design at the header */}
              <div className="pt-8 pb-4 px-6 border-b border-primary/10 bg-black/20 flex flex-col items-center justify-center relative">
                {/* Embedded decorative Arch */}
                <svg width="180" height="30" viewBox="0 0 180 30" fill="none" className="opacity-40 mb-2">
                  <path d="M10,25 C10,25 30,10 90,10 C150,10 170,25 170,25" stroke="url(#modalHeaderGold)" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M5,25 C5,25 25,5 90,5 C155,5 175,25 175,25" stroke="url(#modalHeaderGold)" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="modalHeaderGold" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(42, 95%, 70%)" />
                      <stop offset="100%" stopColor="hsl(42, 85%, 45%)" />
                    </linearGradient>
                  </defs>
                </svg>

                <h3 className="font-serif text-2xl italic text-primary">Guest Preferences</h3>
                <p className="text-[9px] uppercase tracking-[0.3em] text-primary/60 mt-1">Please complete your celebration details</p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto px-8 py-8 space-y-6 scrollbar-thin">
                {config.form.fields.map((field) => renderField(field as any))}

                <div className="pt-6">
                  <OrnamentDivider variant="line" color="hsl(var(--primary))" />
                  <button
                    type="submit"
                    className="w-full py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif uppercase tracking-widest text-lg border border-primary/50 transition-all cursor-pointer rounded-[2px] shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <Check size={16} />
                    <span>Submit RSVP Details</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
