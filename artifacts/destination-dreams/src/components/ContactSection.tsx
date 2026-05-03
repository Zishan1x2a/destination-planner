import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ContactInfo } from "@workspace/api-client-react";
import { CornerOrnament, OrnamentDivider } from "@/components/OrnamentalElements";

interface ContactSectionProps {
  contacts: ContactInfo[];
}

/* ─── Gold dot sparkle ─── */
function GoldDot({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, background: "hsl(42 85% 62%)" }}
      animate={{ scale: [0, 1.8, 0], opacity: [0, 0.75, 0] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, repeatDelay: 3 + delay % 2 }}
    />
  );
}

const DOTS = [
  { x: 5,  y: 18, delay: 0.4 }, { x: 95, y: 22, delay: 1.2 },
  { x: 8,  y: 55, delay: 2.0 }, { x: 92, y: 60, delay: 0.7 },
  { x: 4,  y: 80, delay: 1.6 }, { x: 96, y: 82, delay: 2.5 },
  { x: 48, y: 5,  delay: 0.9 }, { x: 52, y: 95, delay: 1.8 },
];

/* ─── Role icon ─── */
function roleIcon(relation: string) {
  const r = relation.toLowerCase();
  if (r.includes("sister") || r.includes("bride"))  return "👰";
  if (r.includes("brother") || r.includes("groom")) return "🤵";
  if (r.includes("concierge") || r.includes("coordinator")) return "🌟";
  return "✦";
}

/* ─── Contact card ─── */
function ContactCard({ contact, index, isInView }: {
  contact: ContactInfo; index: number; isInView: boolean;
}) {
  const fromLeft = index % 2 === 0;
  const delay = 0.15 + index * 0.18;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: fromLeft ? -60 : 60, y: 12 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div
        className="relative overflow-hidden p-7 md:p-8"
        style={{
          background: "linear-gradient(135deg, hsl(25 25% 11%) 0%, hsl(25 20% 8%) 100%)",
          border: "1.5px solid hsl(42 70% 45% / 0.4)",
          borderRadius: "2px",
        }}
      >
        {/* Corner ornaments */}
        <CornerOrnament position="tl" color="hsl(42,78%,52%)" size={32} />
        <CornerOrnament position="tr" color="hsl(42,78%,52%)" size={32} />
        <CornerOrnament position="bl" color="hsl(42,78%,52%)" size={32} />
        <CornerOrnament position="br" color="hsl(42,78%,52%)" size={32} />

        {/* Inner border */}
        <div className="absolute inset-[8px] pointer-events-none"
          style={{ border: "0.5px solid hsl(42 60% 45% / 0.18)", borderRadius: "1px" }} />

        {/* Top glow sweep */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, hsl(42 80% 55% / 0.6), transparent)" }}
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 1.1, delay: delay + 0.3 }}
        />

        {/* Hover radial glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(42 80% 52% / 0.07) 0%, transparent 70%)" }}
        />

        {/* Shimmer on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 80% / 0.07) 50%, transparent 70%)" }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.9 }}
        />

        {/* Card content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          {/* Avatar / icon badge */}
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl select-none"
            style={{
              background: "linear-gradient(135deg, hsl(42 40% 15%) 0%, hsl(25 30% 10%) 100%)",
              border: "1.5px solid hsl(42 75% 50% / 0.5)",
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {roleIcon(contact.relation)}
          </motion.div>

          {/* Name */}
          <div>
            <h3
              className="font-serif text-xl italic"
              style={{ color: "hsl(42 82% 70%)" }}
            >
              {contact.name}
            </h3>
            <p
              className="uppercase tracking-[0.22em] text-[10px] font-sans mt-1"
              style={{ color: "hsl(42 60% 55% / 0.6)" }}
            >
              {contact.relation}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px"
            style={{ background: "linear-gradient(to right, transparent, hsl(42 60% 45% / 0.35), transparent)" }} />

          {/* Phone number */}
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2 font-serif italic text-base transition-colors"
            style={{ color: "hsl(42 70% 62% / 0.85)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2C2 2 3 1 4 1C5 1 5.5 2 6 3C6.5 4 7 4.5 6 5.5C5 6.5 5.5 7 6.5 8C7.5 9 8 9.5 9 8.5C10 7.5 10.5 8 11.5 8.5C12.5 9 13 9.5 13 10.5C13 11.5 12 12.5 12 12.5C9 15.5 0 6.5 2 2Z"
                fill="hsl(42,80%,58%)" opacity="0.8" />
            </svg>
            {contact.phone}
          </a>

          {/* WhatsApp button */}
          <motion.a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden flex items-center gap-2.5 px-6 py-2.5"
            style={{
              background: "linear-gradient(135deg, hsl(42 75% 30%) 0%, hsl(42 80% 22%) 100%)",
              border: "1px solid hsl(42 75% 48% / 0.65)",
              borderRadius: "2px",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 80% / 0.15) 50%, transparent 70%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
            />
            {/* WhatsApp icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0C3.58 0 0 3.58 0 8C0 9.42 0.38 10.75 1.04 11.9L0 16L4.22 14.98C5.33 15.6 6.62 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0Z"
                fill="hsl(42,85%,62%)" />
              <path d="M11.5 10.2C11.3 10.65 10.55 11.05 10.1 11.1C9.7 11.15 9.2 11.17 6.85 10.18C4.05 9.02 2.2 6.22 2.06 6.03C1.93 5.84 1 4.62 1 3.36C1 2.1 1.65 1.49 1.9 1.22C2.15 0.95 2.45 0.88 2.63 0.88C2.81 0.88 3 0.88 3.16 0.89C3.34 0.9 3.59 0.82 3.84 1.42L4.7 3.48C4.87 3.88 4.73 4.17 4.57 4.38L4.1 4.97C3.93 5.18 3.95 5.46 4.1 5.66C4.57 6.32 5.36 7.22 6.17 7.79C7.18 8.49 7.93 8.73 8.3 8.88C8.59 9 8.85 8.97 9.06 8.74L9.72 7.97C9.94 7.71 10.2 7.79 10.49 7.9L12.27 8.72C12.57 8.86 12.76 8.93 12.82 9.06C12.88 9.18 12.88 9.77 11.5 10.2Z"
                fill="hsl(25,30%,10%)" />
            </svg>
            <span
              className="font-serif italic text-sm relative"
              style={{ color: "hsl(42 90% 85%)" }}
            >
              WhatsApp
            </span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main section ─── */
export function ContactSection({ contacts }: ContactSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative w-full overflow-hidden py-24 px-4"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, hsl(25 30% 6%) 0%, hsl(350 18% 9%) 50%, hsl(25 30% 6%) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(42 80% 40% / 0.08) 0%, transparent 70%)" }} />

      {/* Gold ambient dots */}
      {DOTS.map((d, i) => <GoldDot key={i} x={d.x} y={d.y} delay={d.delay} />)}

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
            style={{ color: "hsl(42 70% 60% / 0.6)" }}>
            Get In Touch
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic mb-6"
            style={{ color: "hsl(42 85% 68%)" }}>
            Contact Us
          </h2>
          <OrnamentDivider variant="floral" color="hsl(42,82%,58%)" />
          <motion.p
            className="mt-6 text-sm font-sans max-w-md mx-auto leading-relaxed"
            style={{ color: "hsl(42 50% 60% / 0.5)" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            For any queries regarding travel, accommodation or the celebrations — our family is here to help
          </motion.p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {contacts.map((contact, i) => (
            <ContactCard key={contact.name} contact={contact} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Bottom divider */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <OrnamentDivider variant="diamond" color="hsl(42,80%,55%)" />
        </motion.div>
      </div>
    </section>
  );
}
