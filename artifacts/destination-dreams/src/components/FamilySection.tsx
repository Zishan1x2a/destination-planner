import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CornerOrnament, OrnamentDivider } from "@/components/OrnamentalElements";

/* ─── Types ─── */
interface FamilyMember {
  name: string;
  relation: string;
  img: string;
}

/* ─── Data ─── */
const BRIDE_FAMILY: FamilyMember[] = [
  { name: "Rajesh Sharma", relation: "Father of the Bride", img: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=300&q=80" },
  { name: "Sunita Sharma", relation: "Mother of the Bride", img: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=300&q=80" },
  { name: "Rahul Sharma", relation: "Brother", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Neha Sharma", relation: "Sister", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
];

const GROOM_FAMILY: FamilyMember[] = [
  { name: "Suresh Mehta", relation: "Father of the Groom", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { name: "Kavita Mehta", relation: "Mother of the Groom", img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&q=80" },
  { name: "Vikram Mehta", relation: "Brother", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { name: "Ananya Mehta", relation: "Sister", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

/* ─── Member Card ─── */
function MemberCard({ member, index, from }: { member: FamilyMember; index: number; from: "left" | "right" }) {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(" ").map(n => n[0]).join("");

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: from === "left" ? -60 : 60, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Photo circle */}
      <div className="relative">
        {/* Glow ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full"
          style={{ border: "1.5px solid hsl(42 80% 55% / 0.5)" }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          style={{ border: "0.5px solid hsl(42 70% 55% / 0.2)" }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden relative"
          style={{ border: "2px solid hsl(42 80% 52% / 0.8)", background: "hsl(25 25% 14%)" }}
        >
          {!imgError ? (
            <img
              src={member.img}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-xl"
              style={{ color: "hsl(42 80% 60%)" }}>
              {initials}
            </div>
          )}

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 80% / 0.2) 50%, transparent 70%)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, delay: 1 + index * 0.4, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Name + relation */}
      <div className="text-center">
        <p className="font-serif text-sm md:text-base italic" style={{ color: "hsl(42 80% 72%)" }}>
          {member.name}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] mt-0.5 font-sans" style={{ color: "hsl(42 60% 55% / 0.65)" }}>
          {member.relation}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Family Panel ─── */
function FamilyPanel({
  title, subtitle, members, side, isOpen, onToggle, isInView,
}: {
  title: string;
  subtitle: string;
  members: FamilyMember[];
  side: "left" | "right";
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={{ opacity: 0, x: side === "left" ? -80 : 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.0, delay: side === "left" ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Panel header card — clickable */}
      <motion.button
        onClick={onToggle}
        className="relative w-full text-left cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25 }}
      >
        <div
          className="relative p-6 md:p-8 overflow-hidden"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, hsl(42 40% 14%) 0%, hsl(25 30% 10%) 100%)"
              : "linear-gradient(135deg, hsl(25 25% 11%) 0%, hsl(25 20% 8%) 100%)",
            border: `1.5px solid hsl(42 80% ${isOpen ? "55" : "40"}% / ${isOpen ? "0.8" : "0.5"})`,
            borderRadius: "2px",
            transition: "all 0.5s ease",
          }}
        >
          {/* Corner ornaments */}
          <CornerOrnament position={side === "left" ? "tl" : "tr"} color="hsl(42,80%,55%)" size={40} />
          <CornerOrnament position={side === "left" ? "br" : "bl"} color="hsl(42,80%,55%)" size={40} />

          {/* Shimmer on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(115deg, transparent 40%, hsl(42 90% 80% / 0.07) 50%, transparent 60%)" }}
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8 }}
          />

          {/* Content */}
          <div className={`flex items-center gap-4 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
            {/* Icon */}
            <motion.div
              className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center"
              style={{ background: "hsl(42 50% 18%)", border: "1px solid hsl(42 80% 52% / 0.5)" }}
              animate={isOpen ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14,4 L16.5,10 L23,10 L18,14.5 L20,21 L14,17.5 L8,21 L10,14.5 L5,10 L11.5,10 Z"
                  fill="hsl(42,85%,58%)" opacity="0.85" />
              </svg>
            </motion.div>

            <div>
              <h3 className="font-serif text-xl md:text-2xl italic" style={{ color: "hsl(42 85% 70%)" }}>
                {title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] mt-1 font-sans" style={{ color: "hsl(42 60% 55% / 0.65)" }}>
                {subtitle}
              </p>
              {/* Expand hint */}
              <motion.p
                className="text-xs mt-2 font-sans"
                style={{ color: "hsl(42 70% 58% / 0.8)" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isOpen ? "▲ Click to close" : "▼ Click to meet the family"}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.button>

      {/* Expandable members grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              className="pt-6 pb-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-6">
                {members.map((m, i) => (
                  <MemberCard key={m.name} member={m} index={i} from={side} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Sparkling particle ─── */
function GoldDot({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, background: "hsl(42 85% 62%)" }}
      animate={{ scale: [0, 1.6, 0], opacity: [0, 0.9, 0] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 3 + delay % 2 }}
    />
  );
}

const GOLD_DOTS = [
  { x: 5, y: 20, delay: 0.3 }, { x: 95, y: 30, delay: 1.1 },
  { x: 50, y: 8, delay: 0.7 }, { x: 50, y: 92, delay: 1.9 },
  { x: 20, y: 60, delay: 2.1 }, { x: 80, y: 55, delay: 0.5 },
  { x: 30, y: 85, delay: 1.4 }, { x: 70, y: 15, delay: 2.6 },
];

/* ─── Main Component ─── */
export function FamilySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [openPanel, setOpenPanel] = useState<"bride" | "groom" | null>(null);

  const toggle = (side: "bride" | "groom") =>
    setOpenPanel(prev => (prev === side ? null : side));

  return (
    <section
      ref={ref}
      id="family"
      className="relative w-full overflow-hidden py-24 px-4"
      style={{
        background: "linear-gradient(180deg, hsl(25 30% 6%) 0%, hsl(28 28% 10%) 50%, hsl(25 30% 6%) 100%)",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(42 80% 40% / 0.07) 0%, transparent 70%)" }} />

      {/* Gold dots */}
      {GOLD_DOTS.map((d, i) => <GoldDot key={i} x={d.x} y={d.y} delay={d.delay} />)}

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <p className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
            style={{ color: "hsl(42 70% 60% / 0.65)" }}>
            With the blessings of
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic mb-6"
            style={{ color: "hsl(42 85% 68%)" }}>
            Our Families
          </h2>
          <OrnamentDivider variant="floral" color="hsl(42,82%,58%)" />
          <motion.p
            className="mt-6 text-sm font-sans max-w-md mx-auto leading-relaxed"
            style={{ color: "hsl(42 50% 60% / 0.6)" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Click on each family to meet the wonderful people who shape our story
          </motion.p>
        </motion.div>

        {/* Divider line */}
        <motion.div
          className="relative mb-10 flex items-center justify-center gap-4"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        >
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 60% 45% / 0.5))" }} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10,2 L11.8,7.5 L18,7.5 L13,11.5 L14.8,17 L10,13.5 L5.2,17 L7,11.5 L2,7.5 L8.2,7.5 Z"
              fill="hsl(42,85%,58%)" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 60% 45% / 0.5))" }} />
        </motion.div>

        {/* Two panels */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <FamilyPanel
            title="Sharma Family"
            subtitle="Bride's Family · Jaipur"
            members={BRIDE_FAMILY}
            side="left"
            isOpen={openPanel === "bride"}
            onToggle={() => toggle("bride")}
            isInView={isInView}
          />

          {/* Center ornament */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center pt-10 shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.svg width="40" height="120" viewBox="0 0 40 120" fill="none"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <line x1="20" y1="0" x2="20" y2="48" stroke="hsl(42,70%,52%)" strokeWidth="1" opacity="0.4" />
              <circle cx="20" cy="56" r="5" fill="hsl(42,85%,58%)" opacity="0.8" />
              <circle cx="20" cy="56" r="9" stroke="hsl(42,75%,52%)" strokeWidth="0.5" opacity="0.4" fill="none" />
              <line x1="20" y1="64" x2="20" y2="120" stroke="hsl(42,70%,52%)" strokeWidth="1" opacity="0.4" />
            </motion.svg>
          </motion.div>

          <FamilyPanel
            title="Mehta Family"
            subtitle="Groom's Family · Mumbai"
            members={GROOM_FAMILY}
            side="right"
            isOpen={openPanel === "groom"}
            onToggle={() => toggle("groom")}
            isInView={isInView}
          />
        </div>

        {/* Bottom divider */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <OrnamentDivider variant="diamond" color="hsl(42,80%,55%)" />
        </motion.div>
      </div>
    </section>
  );
}
