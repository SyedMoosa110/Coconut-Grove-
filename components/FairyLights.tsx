"use client";

import { motion } from "framer-motion";

/** Drifting, twinkling gold motes. Positions are deterministic so server and client markup match. */
export default function FairyLights({ count = 24, seed = 0, className = "" }: { count?: number; seed?: number; className?: string }) {
  const lights = Array.from({ length: count }, (_, i) => ({
    left: (i * 47 + seed * 13) % 100,
    top: (i * 29 + 13 + seed * 17) % 100,
    size: 3 + ((i + seed) % 4),
    dur: 6 + ((i + seed) % 5) * 2,
    delay: ((i + seed) % 7) * 0.6,
  }));
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {lights.map((l, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-soft"
          style={{ left: `${l.left}%`, top: `${l.top}%`, width: l.size, height: l.size, boxShadow: "0 0 12px 3px rgba(212,175,55,0.65)" }}
          animate={{ y: [0, -46, 0], x: [0, 14, -8, 0], opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
