"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import FairyCanvas from "./FairyCanvas";
import FoodImage from "./FoodImage";
import { DAY_IMAGE, NIGHT_IMAGE } from "@/lib/data";

/** 0 = fully night on the left edge, 100 = fully day. Maps the divider position to a clock time for the readout. */
const timeFor = (pos: number) => {
  const t = 1 - pos / 100;                 // 0 (noon) .. 1 (late night)
  const minutes = Math.round((12 * 60 + t * 10 * 60) / 15) * 15;
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
};

/**
 * Before/after ambience slider. Drag (mouse, touch or pen), tap anywhere, or use the arrow keys.
 * The night layer is revealed by a clip-path, so fairy lights only exist on the night side of the glowing divider.
 */
export default function AmbienceSlider() {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, amount: 0.5 });
  const raw = useMotionValue(78);
  const pos = useSpring(raw, { stiffness: 190, damping: 28, mass: 0.6 });
  const [clock, setClock] = useState(timeFor(78));
  const [dragging, setDragging] = useState(false);
  const intro = useRef<ReturnType<typeof animate> | null>(null);

  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`;
  const left = useMotionTemplate`${pos}%`;

  useMotionValueEvent(pos, "change", (v) => setClock(timeFor(Math.min(100, Math.max(0, v)))));

  // Intro sweep so people discover the interaction: day -> deep night -> settle at dusk
  useEffect(() => {
    if (!inView) return;
    intro.current = animate(raw, [78, 22, 52], { duration: 3.4, ease: [0.16, 1, 0.3, 1], times: [0, 0.55, 1] });
    return () => intro.current?.stop();
  }, [inView, raw]);

  const setFromX = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    raw.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  /** The visitor takes over: cancel the intro sweep so it never fights their hand. */
  const claim = () => intro.current?.stop();

  const isNight = pos.get() < 50;

  return (
    <div className="relative">
      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Day to night ambience"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(100 - pos.get())}
        aria-valuetext={clock}
        data-cursor="Drag"
        onKeyDown={(e) => {
          const step = e.shiftKey ? 15 : 6;
          if (e.key === "ArrowLeft") { claim(); raw.set(Math.max(0, raw.get() - step)); e.preventDefault(); }
          if (e.key === "ArrowRight") { claim(); raw.set(Math.min(100, raw.get() + step)); e.preventDefault(); }
          if (e.key === "Home") { claim(); raw.set(100); }
          if (e.key === "End") { claim(); raw.set(0); }
        }}
        onPointerDown={(e) => {
          claim();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => { if (dragging) setFromX(e.clientX); }}
        onPointerUp={(e) => { setDragging(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
        onPointerCancel={() => setDragging(false)}
        className="gold-border relative aspect-[4/5] w-full cursor-ew-resize select-none overflow-hidden rounded-[2rem] border border-white/10 bg-charcoal sm:aspect-[16/9]"
        style={{ touchAction: "pan-y" }}
      >
        {/* DAY (base layer) */}
        <FoodImage src={DAY_IMAGE} alt="The garden by day" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-sky-200/5" />

        {/* NIGHT (clipped reveal) */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <FoodImage src={NIGHT_IMAGE} alt="The garden by night" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/30 to-obsidian/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,.3),transparent_55%)]" />
          <FairyCanvas density={1.4} embers={0.25} />
        </motion.div>

        {/* glowing divider */}
        <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2">
          <div className="relative h-full w-px bg-gradient-to-b from-transparent via-gold-pale to-transparent shadow-[0_0_24px_6px_rgba(212,175,55,.7)]" />
          <div className="absolute inset-y-0 -left-10 w-20 bg-gradient-to-r from-transparent via-gold/15 to-transparent blur-xl" />
          <motion.div
            animate={{ scale: dragging ? 1.18 : 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-obsidian/70 shadow-[0_0_34px_6px_rgba(212,175,55,.5)] backdrop-blur-xl"
          >
            <Sun size={14} className="absolute -left-5 text-gold-pale/80" />
            <Moon size={14} className="absolute -right-5 text-gold-pale/80" />
            <span className="flex gap-0.5 text-gold">
              <span className="h-4 w-px bg-gold" /><span className="h-4 w-px bg-gold" /><span className="h-4 w-px bg-gold" />
            </span>
          </motion.div>
        </motion.div>

        {/* labels */}
        <div className="pointer-events-none absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.25em]">
          <Sun size={13} className="text-gold" /> Day
        </div>
        <div className="pointer-events-none absolute right-5 top-5 z-30 flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.25em]">
          <Moon size={13} className="text-gold" /> Night
        </div>
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full glass-strong px-6 py-2.5 text-center">
          <span className="font-display text-3xl tabular-nums text-gold-gradient">{clock}</span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-cream/45" aria-live="off">
        Drag, tap or use the arrow keys · {isNight ? "The lights are on" : "Golden hour is coming"}
      </p>
    </div>
  );
}
