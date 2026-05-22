import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CornerOrnament, OrnamentDivider, BackgroundCornerOrnaments } from "@/components/OrnamentalElements";

/* ─── Types ─── */
interface FamilyMember {
  name: string;
  relation: string;
  img: string;
}

/* ─── Extended Family Data ─── */
const BRIDE_FAMILY: FamilyMember[] = [
  { name: "Rajesh Sharma", relation: "Father of the Bride", img: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Sunita Sharma", relation: "Mother of the Bride", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Devendra Sharma", relation: "Grandfather", img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Savitri Sharma", relation: "Grandmother", img: "https://images.unsplash.com/photo-1610030470214-5df6d2524a87?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Rahul Sharma", relation: "Brother", img: "https://images.unsplash.com/photo-1605087085244-6729a98e6f8d?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Neha Sharma", relation: "Sister", img: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Amit Sharma", relation: "Uncle (Chacha)", img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Priya Sharma", relation: "Aunt (Chachi)", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=380&fit=crop&crop=faces&q=80" },
];

const GROOM_FAMILY: FamilyMember[] = [
  { name: "Suresh Mehta", relation: "Father of the Groom", img: "https://images.unsplash.com/photo-1605087114187-5421c4355554?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Kavita Mehta", relation: "Mother of the Groom", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Harish Mehta", relation: "Grandfather", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Rukmani Mehta", relation: "Grandmother", img: "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Vikram Mehta", relation: "Brother", img: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Ananya Mehta", relation: "Sister", img: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Rajesh Mehta", relation: "Uncle (Tauji)", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=380&fit=crop&crop=faces&q=80" },
  { name: "Meena Mehta", relation: "Aunt (Taiji)", img: "https://images.unsplash.com/photo-1610030469668-8e4a7c3f2a0a?w=300&h=380&fit=crop&crop=faces&q=80" },
];

/* ─── Premium Arched Member Card ─── */
function MemberCard({ member, index, from }: { member: FamilyMember; index: number; from: "left" | "right" }) {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(" ").map(n => n[0]).join("");

  // Color theme variables based on side ("from")
  const isLeft = from === "left";
  const accentBase = isLeft ? "hsla(145, 60%, 45%, 0.3)" : "hsla(350, 70%, 50%, 0.3)";
  const accentPulse = isLeft ? "hsla(145, 75%, 55%, 0.75)" : "hsla(350, 80%, 60%, 0.75)";
  const glowPulse = isLeft ? "hsla(145, 75%, 55%, 0.45)" : "hsla(350, 80%, 60%, 0.45)";
  const hoverBorder = isLeft ? "hsla(145, 80%, 60%, 1)" : "hsla(350, 85%, 65%, 1)";
  const hoverGlow = isLeft ? "hsla(145, 80%, 60%, 0.65)" : "hsla(350, 85%, 65%, 0.65)";
  
  const innerBase = isLeft ? "hsla(145, 60%, 45%, 0.15)" : "hsla(350, 70%, 50%, 0.15)";
  const innerPulse = isLeft ? "hsla(145, 75%, 55%, 0.45)" : "hsla(350, 80%, 60%, 0.45)";
  const innerHover = isLeft ? "hsla(145, 80%, 60%, 0.7)" : "hsla(350, 85%, 65%, 0.7)";

  const nameColor = isLeft ? "hsl(145, 75%, 72%)" : "hsl(350, 85%, 75%)";
  const relationColor = isLeft ? "hsl(145, 40%, 60% / 0.7)" : "hsl(350, 50%, 65% / 0.7)";
  
  const shimmerGrad = isLeft
    ? "linear-gradient(115deg, transparent 30%, hsla(145, 90%, 80%, 0.15) 50%, transparent 70%)"
    : "linear-gradient(115deg, transparent 30%, hsla(350, 90%, 80%, 0.15) 50%, transparent 70%)";

  return (
    <motion.div
      className="flex-shrink-0 w-32 sm:w-36 md:w-44 lg:w-48 flex flex-col items-center gap-3 snap-center group relative"
      initial={{ opacity: 0, x: from === "left" ? -40 : 40, y: 15 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      {/* Royal Arched/Shield Frame Portrait */}
      <motion.div
        className="relative w-full aspect-[3.2/4] rounded-t-full overflow-hidden border pointer-events-auto"
        animate={{
          borderColor: [accentBase, accentPulse, accentBase],
          boxShadow: [
            `0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 0px ${isLeft ? "rgba(16, 185, 129, 0)" : "rgba(244, 63, 94, 0)"}`,
            `0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 0 14px ${glowPulse}`,
            `0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 0px ${isLeft ? "rgba(16, 185, 129, 0)" : "rgba(244, 63, 94, 0)"}`
          ]
        }}
        whileHover={{
          borderColor: hoverBorder,
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 0 22px ${hoverGlow}`,
          scale: 1.02
        }}
        transition={{
          borderColor: {
            repeat: Infinity,
            duration: 3.5,
            delay: index * 0.2,
            ease: "easeInOut"
          },
          boxShadow: {
            repeat: Infinity,
            duration: 3.5,
            delay: index * 0.2,
            ease: "easeInOut"
          },
          scale: {
            duration: 0.3,
            ease: "easeOut"
          }
        }}
        style={{ borderWidth: "1px", borderStyle: "solid" }}
      >
        {/* Ambient glow inside card */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" 
          style={{
            background: isLeft
              ? "linear-gradient(to top, hsla(145, 60%, 45%, 0.15) 0%, transparent 100%)"
              : "linear-gradient(to top, hsla(350, 70%, 50%, 0.15) 0%, transparent 100%)"
          }}
        />

        {/* Outer subtle ring ornament */}
        <motion.div
          className="absolute inset-1 rounded-t-full border pointer-events-none z-20"
          animate={{
            borderColor: [innerBase, innerPulse, innerBase],
            opacity: [0.7, 1, 0.7]
          }}
          whileHover={{
            borderColor: innerHover,
            opacity: 1
          }}
          transition={{
            borderColor: {
              repeat: Infinity,
              duration: 3.5,
              delay: index * 0.2,
              ease: "easeInOut"
            },
            opacity: {
              repeat: Infinity,
              duration: 3.5,
              delay: index * 0.2,
              ease: "easeInOut"
            }
          }}
          style={{ borderWidth: "1px", borderStyle: "solid" }}
        />

        {/* Shimmer sweeping light */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: shimmerGrad }}
          animate={{ x: ["-120%", "220%"] }}
          transition={{ duration: 2.5, delay: 1 + index * 0.4, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
        />

        {/* Profile Image with fallback */}
        {!imgError ? (
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.03] group-hover:scale-108 group-hover:brightness-100 transition-all duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center font-serif text-xl"
            style={{ color: isLeft ? "hsl(145 80% 60%)" : "hsl(350 80% 60%)", background: "hsl(25 25% 12%)" }}
          >
            {initials}
          </div>
        )}
      </motion.div>

      {/* Small ornamental diamond under photo */}
      <div 
        className={`w-1.5 h-1.5 rotate-45 border bg-transparent transition-all duration-300 ${
          isLeft 
            ? "border-emerald-500/60 group-hover:bg-emerald-500" 
            : "border-rose-500/60 group-hover:bg-rose-500"
        }`} 
      />

      {/* Name + Relation labels */}
      <div className="text-center w-full">
        <h4 className="font-serif text-sm sm:text-base italic font-semibold truncate transition-colors duration-300 text-primary-foreground group-hover:text-primary" style={{ color: nameColor }}>
          {member.name}
        </h4>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] mt-0.5 font-sans truncate" style={{ color: relationColor }}>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Dynamic Theme Styling configuration based on left (emerald) or right (ruby)
  const isLeft = side === "left";
  
  const bgGrad = isOpen
    ? isLeft
      ? "linear-gradient(135deg, hsl(145 40% 10%) 0%, hsl(25 30% 6%) 100%)"
      : "linear-gradient(135deg, hsl(350 40% 10%) 0%, hsl(25 30% 6%) 100%)"
    : "linear-gradient(135deg, hsl(25 25% 11%) 0%, hsl(25 20% 8%) 100%)";

  const panelPulseBorderOpen = isLeft
    ? ["hsla(145, 60%, 45%, 0.8)", "hsla(145, 75%, 55%, 1)", "hsla(145, 60%, 45%, 0.8)"]
    : ["hsla(350, 70%, 50%, 0.8)", "hsla(350, 80%, 60%, 1)", "hsla(350, 70%, 50%, 0.8)"];
  
  const panelPulseBorderClosed = isLeft
    ? ["hsla(145, 60%, 45%, 0.5)", "hsla(145, 70%, 50%, 0.7)", "hsla(145, 60%, 45%, 0.5)"]
    : ["hsla(350, 70%, 50%, 0.5)", "hsla(350, 80%, 55%, 0.7)", "hsla(350, 70%, 50%, 0.5)"];

  const panelGlowOpen = isLeft
    ? [
        "0 0 12px hsla(145, 75%, 55%, 0.25), inset 0 0 15px hsla(145, 75%, 55%, 0.1)",
        "0 0 25px hsla(145, 80%, 60%, 0.5), inset 0 0 25px hsla(145, 80%, 60%, 0.2)",
        "0 0 12px hsla(145, 75%, 55%, 0.25), inset 0 0 15px hsla(145, 75%, 55%, 0.1)"
      ]
    : [
        "0 0 12px hsla(350, 80%, 60%, 0.25), inset 0 0 15px hsla(350, 80%, 60%, 0.1)",
        "0 0 25px hsla(350, 85%, 65%, 0.5), inset 0 0 25px hsla(350, 85%, 65%, 0.2)",
        "0 0 12px hsla(350, 80%, 60%, 0.25), inset 0 0 15px hsla(350, 80%, 60%, 0.1)"
      ];

  const panelGlowClosed = isLeft
    ? [
        "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 0 0px hsla(145, 60%, 45%, 0)",
        "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 0 10px hsla(145, 70%, 50%, 0.25)",
        "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 0 0px hsla(145, 60%, 45%, 0)"
      ]
    : [
        "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 0 0px hsla(350, 70%, 50%, 0)",
        "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 0 10px hsla(350, 80%, 55%, 0.25)",
        "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 0 0px hsla(350, 70%, 50%, 0)"
      ];

  const panelHoverBorder = isLeft ? "hsla(145, 80%, 60%, 1)" : "hsla(350, 85%, 65%, 1)";
  const panelHoverGlow = isOpen
    ? isLeft
      ? "0 0 30px hsla(145, 80%, 60%, 0.65), inset 0 0 30px hsla(145, 80%, 60%, 0.3)"
      : "0 0 30px hsla(350, 85%, 65%, 0.65), inset 0 0 30px hsla(350, 85%, 65%, 0.3)"
    : isLeft
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 18px hsla(145, 75%, 55%, 0.45)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 18px hsla(350, 80%, 60%, 0.45)";

  const laserStroke = isLeft ? "url(#emerald-laser-grad)" : "url(#ruby-laser-grad)";

  const iconBg = isLeft ? "hsl(145 50% 18%)" : "hsl(350 50% 18%)";
  const iconBorder = isLeft ? "1px solid hsl(145 60% 45% / 0.5)" : "1px solid hsl(350 70% 50% / 0.5)";
  const iconFill = isLeft ? "hsl(145, 75%, 55%)" : "hsl(350, 80%, 60%)";

  const titleColor = isLeft ? "hsl(145, 75%, 72%)" : "hsl(350, 85%, 75%)";
  const subtitleColor = isLeft ? "hsl(145, 60%, 55% / 0.65)" : "hsl(350, 65%, 60% / 0.65)";
  const hintColor = isLeft ? "hsl(145, 70%, 58% / 0.8)" : "hsl(350, 75%, 62% / 0.8)";
  const ornamentColor = isLeft ? "hsl(145, 70%, 50%)" : "hsl(350, 75%, 55%)";

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    // Set scroll progress from 0 to 100
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
    
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < maxScroll - 8);
  };

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Recalculate dimensions once panel expands or changes
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isOpen) {
      timer = setTimeout(() => {
        handleScroll();
      }, 200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <motion.div
      className="flex flex-col w-full"
      initial={{ opacity: 0, x: side === "left" ? -80 : 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.0, delay: side === "left" ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Panel header card — clickable */}
      <motion.button
        onClick={onToggle}
        className="relative w-full text-left cursor-pointer group"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="relative p-6 md:p-8 overflow-hidden"
          animate={{
            borderColor: isOpen 
              ? panelPulseBorderOpen
              : panelPulseBorderClosed,
            boxShadow: isOpen
              ? panelGlowOpen
              : panelGlowClosed
          }}
          whileHover={{
            borderColor: panelHoverBorder,
            boxShadow: panelHoverGlow
          }}
          transition={{
            borderColor: {
              repeat: Infinity,
              duration: 4.5,
              ease: "easeInOut"
            },
            boxShadow: {
              repeat: Infinity,
              duration: 4.5,
              ease: "easeInOut"
            }
          }}
          style={{
            background: bgGrad,
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderRadius: "2px",
          }}
        >
          {/* Active Flowing SVG Laser Border Trail */}
          {isOpen && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
              <motion.rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="2"
                ry="2"
                fill="none"
                stroke={laserStroke}
                strokeWidth="2"
                strokeDasharray="120 240"
                animate={{ strokeDashoffset: [0, -360] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <defs>
                <linearGradient id={isLeft ? "emerald-laser-grad" : "ruby-laser-grad"} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isLeft ? "hsl(145, 50%, 40%)" : "hsl(350, 60%, 45%)"} stopOpacity="0.2" />
                  <stop offset="50%" stopColor={isLeft ? "hsl(145, 80%, 60%)" : "hsl(350, 80%, 60%)"} stopOpacity="1" />
                  <stop offset="100%" stopColor={isLeft ? "hsl(145, 50%, 40%)" : "hsl(350, 60%, 45%)"} stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Corner ornaments */}
          <CornerOrnament position={side === "left" ? "tl" : "tr"} color={ornamentColor} size={40} />
          <CornerOrnament position={side === "left" ? "br" : "bl"} color={ornamentColor} size={40} />

          {/* Shimmer on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: isLeft ? "linear-gradient(115deg, transparent 40%, hsla(145, 90%, 80%, 0.07) 50%, transparent 60%)" : "linear-gradient(115deg, transparent 40%, hsla(350, 90%, 80%, 0.07) 50%, transparent 60%)" }}
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8 }}
          />

          {/* Content */}
          <div className={`flex items-center gap-4 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
            {/* Icon */}
            <motion.div
              className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center"
              style={{ background: iconBg, border: iconBorder }}
              animate={isOpen ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14,4 L16.5,10 L23,10 L18,14.5 L20,21 L14,17.5 L8,21 L10,14.5 L5,10 L11.5,10 Z"
                  fill={iconFill} opacity="0.85" />
              </svg>
            </motion.div>

            <div>
              <h3 className="font-serif text-xl md:text-2xl italic" style={{ color: titleColor }}>
                {title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] mt-1 font-sans" style={{ color: subtitleColor }}>
                {subtitle}
              </p>
              {/* Expand hint */}
              <motion.p
                className="text-xs mt-2 font-sans"
                style={{ color: hintColor }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isOpen ? "▲ Click to close" : "▼ Click to meet the family"}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.button>

      {/* Expandable members horizontal slider */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              // Recalculate dimensions once layout settles
              setTimeout(handleScroll, 50);
            }}
            className="w-full overflow-hidden"
          >
            <motion.div
              className="pt-8 pb-6 relative"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Slider Wrapper with side paddings to isolate arrows */}
              <div className="relative w-full group/slider px-2 md:px-12">
                
                {/* Horizontal scrollable area */}
                <div
                  ref={containerRef}
                  onScroll={handleScroll}
                  className="flex gap-4 sm:gap-6 overflow-x-auto py-3 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {members.map((m, i) => (
                    <MemberCard key={m.name} member={m} index={i} from={side} />
                  ))}
                </div>

                {/* Left side fading mask */}
                {canScrollLeft && (
                  <div 
                    className="absolute left-2 md:left-12 top-0 bottom-0 w-12 md:w-20 pointer-events-none z-10 transition-opacity duration-300 animate-in fade-in" 
                    style={{
                      background: "linear-gradient(to right, hsl(25 30% 6%) 0%, transparent 100%)",
                    }}
                  />
                )}

                {/* Right side fading mask */}
                {canScrollRight && (
                  <div 
                    className="absolute right-2 md:right-12 top-0 bottom-0 w-12 md:w-20 pointer-events-none z-10 transition-opacity duration-300 animate-in fade-in"
                    style={{
                      background: "linear-gradient(to left, hsl(25 30% 6%) 0%, transparent 100%)",
                    }}
                  />
                )}

                {/* Slider Controls (Arrow Buttons) */}
                {members.length > 2 && (
                  <>
                    {/* Left Button */}
                    <button
                      onClick={() => scroll("left")}
                      disabled={!canScrollLeft}
                      className={`absolute left-1 md:left-3 top-[42%] transform -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-primary/40 bg-black/85 text-primary hover:bg-primary hover:text-black hover:scale-105 transition-all duration-300 z-20 ${
                        !canScrollLeft 
                          ? "opacity-0 cursor-default pointer-events-none" 
                          : "opacity-0 sm:group-hover/slider:opacity-100 hover:border-primary shadow-lg shadow-black/80"
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 18l-6-6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Right Button */}
                    <button
                      onClick={() => scroll("right")}
                      disabled={!canScrollRight}
                      className={`absolute right-1 md:right-3 top-[42%] transform -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-primary/40 bg-black/85 text-primary hover:bg-primary hover:text-black hover:scale-105 transition-all duration-300 z-20 ${
                        !canScrollRight 
                          ? "opacity-0 cursor-default pointer-events-none" 
                          : "opacity-0 sm:group-hover/slider:opacity-100 hover:border-primary shadow-lg shadow-black/80"
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 18l6-6-6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Dynamic physical gold scrollbar indicator */}
              {members.length > 2 && (
                <div className="w-28 h-[2px] bg-primary/10 rounded-full mx-auto mt-4 overflow-hidden relative">
                  {(() => {
                    const thumbWidth = Math.max(25, Math.min(60, 100 * 2.5 / members.length));
                    const thumbLeft = scrollProgress * (1 - thumbWidth / 100);
                    return (
                      <div 
                        className="absolute h-full bg-primary rounded-full transition-all duration-150"
                        style={{ 
                          width: `${thumbWidth}%`, 
                          left: `${thumbLeft}%` 
                        }}
                      />
                    );
                  })()}
                </div>
              )}
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

      {/* ── Background Corner Ornaments ── */}
      <BackgroundCornerOrnaments isInView={isInView} />

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

        {/* Two panels in full-width vertical stack */}
        <div className="flex flex-col gap-10 md:gap-14 w-full">
          <FamilyPanel
            title="Sharma Family"
            subtitle="Bride's Family · Jaipur"
            members={BRIDE_FAMILY}
            side="left"
            isOpen={openPanel === "bride"}
            onToggle={() => toggle("bride")}
            isInView={isInView}
          />

          {/* Central gold horizontal floral divider */}
          <motion.div
            className="flex items-center justify-center py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <OrnamentDivider variant="floral" color="hsl(42,82%,58%)" />
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
