"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Trailing cursor: a crisp gold dot plus a spring-lagged halo.
 * - Any element with data-cursor="Label" grows the halo into an illuminated gold disc showing that label.
 * - Any element inside [data-magnetic] (or with data-snap) pulls the halo toward its centre.
 * - Plain links/buttons get a medium ring. Touch devices never see any of this.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const hx = useMotionValue(-200);
  const hy = useMotionValue(-200);
  const dotX = useSpring(mx, { stiffness: 1000, damping: 50, mass: 0.25 });
  const dotY = useSpring(my, { stiffness: 1000, damping: 50, mass: 0.25 });
  const haloX = useSpring(hx, { stiffness: 170, damping: 17, mass: 0.7 });
  const haloY = useSpring(hy, { stiffness: 170, damping: 17, mass: 0.7 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setVisible(true);
      mx.set(e.clientX);
      my.set(e.clientY);

      const t = e.target instanceof Element ? e.target : null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]") ?? null;
      const interactive = t?.closest("a,button,[role='button'],[role='tab'],[role='slider'],input,textarea,select,label") ?? null;
      const magnet = t?.closest<HTMLElement>("[data-magnetic],[data-snap]") ?? null;

      setLabel(labelled?.dataset.cursor || null);
      setHover(Boolean(interactive || labelled));

      if (magnet) {
        const r = magnet.getBoundingClientRect();
        hx.set(e.clientX + (r.left + r.width / 2 - e.clientX) * 0.4);
        hy.set(e.clientY + (r.top + r.height / 2 - e.clientY) * 0.4);
      } else {
        hx.set(e.clientX);
        hy.set(e.clientY);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [mx, my, hx, hy]);

  if (!enabled) return null;

  const size = label ? 104 : hover ? 58 : 36;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[200]" style={{ opacity: visible ? 1 : 0, transition: "opacity .3s" }}>
      {/* illuminated halo */}
      <motion.div
        style={{ x: haloX, y: haloY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, scale: pressed ? 0.88 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute left-0 top-0 grid place-items-center rounded-full border"
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{
            borderColor: label ? "rgba(243,227,166,.9)" : "rgba(212,175,55,.55)",
            boxShadow: label ? "0 0 46px 10px rgba(212,175,55,.38), inset 0 0 30px rgba(212,175,55,.35)" : "0 0 0px 0px rgba(212,175,55,0)",
            backgroundColor: label ? "rgba(212,175,55,.2)" : "rgba(212,175,55,0)",
          }}
          style={{ borderWidth: 1, borderStyle: "solid", backdropFilter: label ? "blur(3px)" : "none" }}
          transition={{ duration: 0.45 }}
        />
        <AnimatePresence mode="wait">
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-cream"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {/* precise dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: label ? 0 : pressed ? 0.6 : 1 }}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(212,175,55,.8)]"
      />
    </div>
  );
}
