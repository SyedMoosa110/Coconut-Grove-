"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;      // max tilt in degrees
  lift?: number;     // scale on hover
  glare?: boolean;
}

/**
 * Physics-based 3D tilt. Pointer position drives rotateX/rotateY through springs, while a radial glare
 * and a faint gold sheen track the cursor across the surface. Children with .tilt-layer float above the card.
 */
export default function TiltCard({ children, max = 11, lift = 1.025, glare = true, className = "", ...rest }: Props) {
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.6 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.6 });
  const scale = useSpring(useMotionValue(1), { stiffness: 220, damping: 22 });
  const glareOpacity = useSpring(useMotionValue(0), { stiffness: 160, damping: 24 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sgx = useSpring(gx, { stiffness: 200, damping: 26 });
  const sgy = useSpring(gy, { stiffness: 200, damping: 26 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${sgx}% ${sgy}%, rgba(255,244,205,.34) 0%, rgba(212,175,55,.12) 28%, transparent 58%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    scale.set(lift);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    rx.set(0); ry.set(0); scale.set(1); glareOpacity.set(0);
  };

  return (
    <div
      {...rest}
      className={`[perspective:1100px] ${className}`}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, scale, transformStyle: "preserve-3d" }} className="relative h-full w-full will-change-transform">
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{ background: glareBg, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
          />
        )}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.07)_50%,transparent_65%)]"
          />
        )}
      </motion.div>
    </div>
  );
}
