"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Gold ring that follows the pointer and swells over interactive elements. Mouse devices only. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.35 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(!!(e.target as HTMLElement)?.closest?.("a, button, input, [data-cursor]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[100]">
      <motion.div
        animate={{ width: active ? 64 : 16, height: active ? 64 : 16, backgroundColor: active ? "rgba(212,175,55,0.14)" : "rgba(212,175,55,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-gold shadow-[0_0_20px_rgba(212,175,55,.45)]"
      />
    </motion.div>
  );
}
