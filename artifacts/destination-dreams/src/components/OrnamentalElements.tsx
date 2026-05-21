import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedSectionDivider() {
  return (
    <div
      className="relative flex flex-col items-center w-full overflow-visible"
      style={{ height: 72, background: "transparent" }}
    >
      {/* Left horizontal rule */}
      <div className="absolute top-1/2 left-0 right-0 flex items-center px-6" style={{ transform: "translateY(-50%)" }}>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 70% 50% / 0.35))" }} />
        <div className="mx-4 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full" style={{ background: "hsl(42 80% 55% / 0.4)" }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(42 80% 55% / 0.25)" }} />
        </div>

        {/* Center bouncing ornament */}
        <motion.div
          className="relative flex flex-col items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glow pulse behind ornament */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(42 85% 55% / 0.18) 0%, transparent 70%)", width: 60, height: 60, top: -10, left: -10 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            {/* Outer ring */}
            <motion.circle
              cx="20" cy="20" r="18"
              stroke="hsl(42,75%,52%)"
              strokeWidth="0.8"
              strokeDasharray="3 4"
              opacity="0.45"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "20px 20px" }}
            />
            {/* Inner ring */}
            <circle cx="20" cy="20" r="12" stroke="hsl(42,70%,50%)" strokeWidth="0.6" opacity="0.3" />
            {/* 8-point star */}
            <path
              d="M20,6 L21.8,17 L32,12 L24,20 L32,28 L21.8,23 L20,34 L18.2,23 L8,28 L16,20 L8,12 L18.2,17 Z"
              fill="hsl(42,82%,58%)"
              opacity="0.85"
            />
            {/* Center dot */}
            <circle cx="20" cy="20" r="3" fill="hsl(42,90%,70%)" opacity="0.9" />
          </svg>
        </motion.div>

        <div className="mx-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(42 80% 55% / 0.25)" }} />
          <div className="w-1 h-1 rounded-full" style={{ background: "hsl(42 80% 55% / 0.4)" }} />
        </div>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(42 70% 50% / 0.35))" }} />
      </div>
    </div>
  );
}

export function CornerOrnament({ position = "tl", size = 64, color = "currentColor" }: { position?: "tl" | "tr" | "bl" | "br", size?: number, color?: string }) {
  const transform = {
    tl: undefined,
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1, -1)",
  }[position];

  const transformOrigin = {
    tl: undefined,
    tr: "right top",
    bl: "left bottom",
    br: "right bottom",
  }[position];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 56 56" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute pointer-events-none select-none"
      style={{
        ...(position.includes('t') ? { top: 6 } : { bottom: 6 }),
        ...(position.includes('l') ? { left: 6 } : { right: 6 }),
        transform,
        transformOrigin,
      }}
    >
      {/* Royal Corner L-bracket */}
      <path d="M2,2 L2,26 Q2,4 26,4 L4,4 L4,2 Z" fill={color} opacity="0.95" />
      <path d="M2,2 L2,34 Q2,2 34,2" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
      <path d="M2,2 L2,20 Q2,8 20,8 L8,8 L8,2 Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
      <circle cx="2" cy="2" r="3" fill={color} />
      <circle cx="12" cy="3" r="1.5" fill={color} opacity="0.8" />
      <circle cx="3" cy="12" r="1.5" fill={color} opacity="0.8" />
      <circle cx="20" cy="4" r="1" fill={color} opacity="0.6" />
      <circle cx="4" cy="20" r="1" fill={color} opacity="0.6" />
    </svg>
  );
}

export function OrnamentDivider({ variant = "floral", color = "currentColor" }: { variant?: "floral" | "line" | "diamond", color?: string }) {
  if (variant === "line") {
    return (
      <div className="flex items-center justify-center w-full my-6">
        <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: color }} />
        <div className="mx-4 text-xs" style={{ color }}>✦</div>
        <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: color }} />
      </div>
    );
  }
  
  if (variant === "diamond") {
    return (
      <div className="flex items-center justify-center w-full my-6">
        <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: color }} />
        <div className="mx-4 flex gap-1 text-[10px]" style={{ color }}>
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>
        <div className="h-px flex-1 max-w-[100px]" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full my-6">
      <div className="h-[2px] flex-1 max-w-[80px]" style={{ backgroundColor: color, opacity: 0.5 }} />
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="mx-4">
        <path d="M20 0C25 10 35 15 40 15C30 15 25 18 20 20C15 18 10 15 0 15C5 15 15 10 20 0Z" fill={color} />
      </svg>
      <div className="h-[2px] flex-1 max-w-[80px]" style={{ backgroundColor: color, opacity: 0.5 }} />
    </div>
  );
}

export function InvitationBorder({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative p-8 md:p-12 ${className}`}>
      <CornerOrnament position="tl" color="hsl(var(--card-border))" />
      <CornerOrnament position="tr" color="hsl(var(--card-border))" />
      <CornerOrnament position="bl" color="hsl(var(--card-border))" />
      <CornerOrnament position="br" color="hsl(var(--card-border))" />
      {children}
    </div>
  );
}

export function SectionHeader({ label, subLabel, align = "center" }: { label: string, subLabel?: string, align?: "left" | "center" | "right" }) {
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left"} mb-12`}>
      <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block" style={{ fontVariant: "small-caps" }}>
        {label}
      </span>
      {subLabel && (
        <>
          <h2 className="font-serif text-5xl md:text-6xl italic text-card-foreground">
            {subLabel}
          </h2>
          <OrnamentDivider variant="floral" color="hsl(var(--primary))" />
        </>
      )}
    </div>
  );
}

export function BackgroundCornerOrnaments({ isInView }: { isInView: boolean }) {
  const corners = [
    { pos: 'top-6 left-6', rot: 0 },
    { pos: 'top-6 right-6', rot: 90 },
    { pos: 'bottom-16 left-6', rot: 270 },
    { pos: 'bottom-16 right-6', rot: 180 },
  ];

  return (
    <>
      {corners.map(({ pos, rot }, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-16 h-16 pointer-events-none select-none`}
          initial={{ opacity: 0, scale: 0.5, rotate: rot }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: rot } : {}}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2,2 L2,22 M2,2 L22,2" stroke="hsl(42 75% 52%)" strokeWidth="1.2" opacity="0.6" />
            <path d="M2,8 Q12,8 12,18" stroke="hsl(42 70% 50%)" strokeWidth="0.6" opacity="0.4" />
            <circle cx="2" cy="2" r="2" fill="hsl(42 80% 58%)" opacity="0.7" />
            <circle cx="14" cy="14" r="1.2" fill="hsl(42 80% 58%)" opacity="0.4" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}
