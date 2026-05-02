import React from 'react';

export function CornerOrnament({ position = "tl", size = 64, color = "currentColor" }: { position?: "tl" | "tr" | "bl" | "br", size?: number, color?: string }) {
  const rotation = {
    tl: "rotate-0",
    tr: "rotate-90",
    br: "rotate-180",
    bl: "-rotate-90"
  }[position];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${rotation}`}
      style={{
        ...(position.includes('t') ? { top: 0 } : { bottom: 0 }),
        ...(position.includes('l') ? { left: 0 } : { right: 0 }),
      }}
    >
      <path d="M0 0C50 0 100 50 100 100C100 50 50 0 0 0Z" stroke={color} strokeWidth="2"/>
      <path d="M10 10C40 10 90 40 90 90C90 40 40 10 10 10Z" stroke={color} strokeWidth="1"/>
      <circle cx="20" cy="20" r="3" fill={color} />
      <circle cx="35" cy="15" r="2" fill={color} />
      <circle cx="15" cy="35" r="2" fill={color} />
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
