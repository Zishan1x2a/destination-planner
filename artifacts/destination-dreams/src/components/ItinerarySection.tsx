import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { EventInfo } from "@workspace/api-client-react";
import { CornerOrnament, OrnamentDivider } from "@/components/OrnamentalElements";

interface ItinerarySectionProps {
  events: EventInfo[];
}

/* ─── Gold ambient dot ─── */
function GoldDot({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, background: "hsl(42 85% 62%)" }}
      animate={{ scale: [0, 1.8, 0], opacity: [0, 0.8, 0] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 + (delay % 2) }}
    />
  );
}

const GOLD_DOTS = [
  { x: 4, y: 15, delay: 0.4 }, { x: 96, y: 22, delay: 1.2 },
  { x: 8, y: 50, delay: 2.0 }, { x: 92, y: 60, delay: 0.7 },
  { x: 3, y: 78, delay: 1.6 }, { x: 97, y: 80, delay: 2.4 },
  { x: 50, y: 5,  delay: 0.9 }, { x: 50, y: 95, delay: 1.8 },
  { x: 20, y: 90, delay: 2.8 }, { x: 80, y: 10, delay: 0.3 },
];

/* ─── Day badge ─── */
function DayBadge({ day, isInView, delay }: { day: number; isInView: boolean; delay: number }) {
  const labels = ["", "Day 1", "Day 2", "Day 3", "Day 4"];
  const dates  = ["", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];
  return (
    <motion.div
      className="flex flex-col items-center gap-2 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Vertical line above */}
      <motion.div
        className="w-px h-10"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(42 70% 52% / 0.5))" }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      />

      {/* Badge */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-20 h-20"
        animate={{ boxShadow: [
          "0 0 12px hsl(42 85% 52% / 0.2)",
          "0 0 28px hsl(42 85% 52% / 0.5)",
          "0 0 12px hsl(42 85% 52% / 0.2)",
        ]}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(135deg, hsl(42 45% 16%) 0%, hsl(25 30% 10%) 100%)",
          border: "1.5px solid hsl(42 80% 52% / 0.8)",
          borderRadius: "50%",
        }}
      >
        {/* Inner ring */}
        <div
          className="absolute inset-[4px] rounded-full pointer-events-none"
          style={{ border: "0.5px solid hsl(42 70% 55% / 0.3)" }}
        />
        <span className="font-serif text-xs uppercase tracking-[0.15em]"
          style={{ color: "hsl(42 70% 60% / 0.7)" }}>
          {labels[day] ?? `Day ${day}`}
        </span>
        <span className="font-serif text-base italic" style={{ color: "hsl(42 85% 70%)" }}>
          {dates[day] ?? ""}
        </span>
      </motion.div>

      {/* Vertical line below */}
      <motion.div
        className="w-px h-6"
        style={{ background: "linear-gradient(to bottom, hsl(42 70% 52% / 0.5), transparent)" }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      />
    </motion.div>
  );
}

/* ─── Event card ─── */
function EventCard({
  event, index, dayIndex, isInView,
}: { event: EventInfo; index: number; dayIndex: number; isInView: boolean }) {
  const fromLeft = (dayIndex + index) % 2 === 0;
  const delay = 0.15 + dayIndex * 0.2 + index * 0.14;

  /* Icon per event type */
  const iconMap: Record<string, string> = {
    mehendi: "🌿", sangeet: "🎶", haldi: "🌼", wedding: "💍",
    ceremony: "🪔", reception: "🥂", puja: "🪔", dinner: "🍽️",
  };
  const keyword = Object.keys(iconMap).find(k =>
    event.name.toLowerCase().includes(k)
  );
  const icon = keyword ? iconMap[keyword] : "✦";

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: fromLeft ? -70 : 70, y: 16 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden p-6 md:p-8 group"
        style={{
          background: "linear-gradient(135deg, hsl(25 25% 11%) 0%, hsl(25 20% 8%) 100%)",
          border: "1.5px solid hsl(42 70% 45% / 0.4)",
          borderRadius: "2px",
        }}
      >
        {/* Corner ornaments */}
        <CornerOrnament position="tl" color="hsl(42,78%,52%)" size={36} />
        <CornerOrnament position="tr" color="hsl(42,78%,52%)" size={36} />
        <CornerOrnament position="bl" color="hsl(42,78%,52%)" size={36} />
        <CornerOrnament position="br" color="hsl(42,78%,52%)" size={36} />

        {/* Inner border line */}
        <div
          className="absolute inset-[8px] pointer-events-none"
          style={{ border: "0.5px solid hsl(42 60% 45% / 0.2)", borderRadius: "1px" }}
        />

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, hsl(42 80% 52% / 0.08) 0%, transparent 70%)",
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(115deg, transparent 30%, hsl(42 90% 80% / 0.08) 50%, transparent 70%)",
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.9 }}
        />

        {/* Top glow line */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] rounded-full pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, hsl(42 80% 55% / 0.6), transparent)" }}
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 1.2, delay: delay + 0.3 }}
        />

        {/* Card content */}
        <div className="relative z-10 pt-2">
          {/* Top row: icon + event name + time tag */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              {/* Icon badge */}
              <motion.div
                className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-lg select-none"
                style={{
                  background: "hsl(42 40% 15%)",
                  border: "1px solid hsl(42 75% 50% / 0.5)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {icon}
              </motion.div>

              <div>
                <p className="uppercase tracking-[0.25em] text-[10px] font-sans mb-0.5"
                  style={{ color: "hsl(42 65% 58% / 0.65)" }}>
                  {event.date}
                </p>
                <h3 className="font-serif text-xl md:text-2xl italic leading-tight"
                  style={{ color: "hsl(42 80% 72%)" }}>
                  {event.name}
                </h3>
              </div>
            </div>

            {/* Time badge */}
            <div
              className="shrink-0 px-3 py-1.5 flex items-center gap-1.5"
              style={{
                background: "hsl(42 35% 15%)",
                border: "1px solid hsl(42 70% 50% / 0.45)",
                borderRadius: "2px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="hsl(42,80%,58%)" strokeWidth="1" />
                <path d="M6 3.5V6L7.5 7.5" stroke="hsl(42,80%,58%)" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <span className="font-serif italic text-xs" style={{ color: "hsl(42 75% 68%)" }}>
                {event.time}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <p className="font-serif italic text-base leading-relaxed mb-6"
              style={{ color: "hsl(42 45% 70% / 0.75)" }}>
              {event.description}
            </p>
          )}

          {/* Divider */}
          <div className="w-full h-px mb-5"
            style={{ background: "linear-gradient(to right, transparent, hsl(42 60% 45% / 0.35), transparent)" }} />

          {/* Bottom row: venue + dress code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Venue */}
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"
                  fill="hsl(42,80%,58%)" opacity="0.7" />
                <circle cx="8" cy="6" r="1.5" fill="hsl(25,30%,10%)" />
              </svg>
              <span className="font-serif italic text-sm" style={{ color: "hsl(42 55% 65% / 0.8)" }}>
                {event.venue}
              </span>
            </div>

            {/* Dress code */}
            <div
              className="flex items-center gap-2 px-3 py-1 self-start sm:self-auto"
              style={{
                background: "hsl(42 30% 12%)",
                border: "1px solid hsl(42 65% 48% / 0.4)",
                borderRadius: "20px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L6 5L10 2L11 4L8 6V11H4V6L1 4Z" fill="hsl(42,78%,55%)" opacity="0.7" />
              </svg>
              <span className="font-serif italic text-xs" style={{ color: "hsl(42 70% 62%)" }}>
                {event.dressCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main section ─── */
export function ItinerarySection({ events }: ItinerarySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });

  const eventsByDay = events.reduce((acc, event) => {
    if (!acc[event.day]) acc[event.day] = [];
    acc[event.day].push(event);
    return acc;
  }, {} as Record<number, EventInfo[]>);

  const days = Object.keys(eventsByDay).map(Number).sort();

  return (
    <section
      ref={ref}
      id="itinerary"
      className="relative w-full overflow-hidden py-24 px-4"
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg, hsl(25 30% 6%) 0%, hsl(28 28% 10%) 50%, hsl(25 30% 6%) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(42 80% 40% / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Gold ambient dots */}
      {GOLD_DOTS.map((d, i) => <GoldDot key={i} x={d.x} y={d.y} delay={d.delay} />)}

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p
            className="uppercase tracking-[0.4em] text-xs font-sans mb-4"
            style={{ color: "hsl(42 70% 60% / 0.65)" }}
          >
            The Celebration
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl italic mb-6"
            style={{ color: "hsl(42 85% 68%)" }}
          >
            Events Itinerary
          </h2>
          <OrnamentDivider variant="floral" color="hsl(42,82%,58%)" />
          <motion.p
            className="mt-6 text-sm font-sans max-w-md mx-auto leading-relaxed"
            style={{ color: "hsl(42 50% 60% / 0.55)" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Four magical days of celebration, love, and lasting memories
          </motion.p>
        </motion.div>

        {/* Days */}
        <div className="space-y-14">
          {days.map((day, dayIndex) => (
            <div key={day}>
              {/* Day badge */}
              <DayBadge day={day} isInView={isInView} delay={0.1 + dayIndex * 0.15} />

              {/* Event cards for this day */}
              <div className="space-y-6">
                {eventsByDay[day].map((event, eventIndex) => (
                  <EventCard
                    key={event.name}
                    event={event}
                    index={eventIndex}
                    dayIndex={dayIndex}
                    isInView={isInView}
                  />
                ))}
              </div>
            </div>
          ))}
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
