"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationControls, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { Check, ChevronsRight, Lock, LockOpen } from "lucide-react";

const HANDLE = 64;
const PAD = 6;

/** Short vibration where supported (Android Chrome etc). Silently ignored elsewhere, e.g. iOS Safari. */
const buzz = (pattern: number | number[]) => {
  try { if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern); } catch { /* unsupported */ }
};

interface Props {
  label: string;
  doneLabel: string;
  onUnlock: () => void;
  disabled?: boolean;
}

/**
 * Slide-to-unlock CTA. Haptic visual feedback while dragging: the gold fill charges up, the lock glows and
 * trembles, the track pulses at each quarter and a burst of sparks fires on release. onUnlock runs
 * synchronously inside the pointer-up (or key) event so browsers allow the WhatsApp window to open.
 * Keyboard: ArrowRight nudges the handle, Enter confirms.
 */
export default function SlideToUnlock({ label, doneLabel, onUnlock, disabled = false }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pulse = useAnimationControls();
  const [sparks, setSparks] = useState<number[]>([]);
  const x = useMotionValue(0);
  const lastStep = useRef(0);

  useEffect(() => {
    const measure = () => { if (track.current) setMax(Math.max(0, track.current.clientWidth - HANDLE - PAD * 2)); };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  const progress = useTransform(x, (v) => (max > 0 ? Math.min(1, Math.max(0, v / max)) : 0));
  const fillWidth = useTransform(x, (v) => v + HANDLE + PAD);
  const labelOpacity = useTransform(progress, [0, 0.45], [1, 0]);
  const labelShift = useTransform(progress, [0, 1], [0, 40]);
  const glow = useTransform(progress, [0, 1], [0.15, 1]);
  const handleShadow = useTransform(glow, (g) => `0 0 ${10 + g * 38}px ${g * 9}px rgba(212,175,55,${0.25 + g * 0.55})`);
  const tremble = useTransform(progress, (p) => (p > 0.6 && p < 1 ? Math.sin(p * 400) * (p - 0.55) * 4 : 0));

  // haptic ticks at every quarter of the track
  useMotionValueEvent(progress, "change", (p) => {
    const step = Math.floor(p * 4);
    if (step !== lastStep.current && !done) {
      if (step > lastStep.current) { buzz(10 + step * 6); pulse.start({ scale: [1, 1.02, 1], transition: { duration: 0.35 } }); }
      lastStep.current = step;
    }
  });

  const finish = () => {
    setDone(true);
    animate(x, max, { type: "spring", stiffness: 300, damping: 26 });
    buzz([30, 40, 70]);
    setSparks(Array.from({ length: 16 }, (_, i) => i));
    onUnlock();
  };

  const release = () => {
    setDragging(false);
    if (done) return;
    if (progress.get() >= 0.92) finish();
    else { buzz(6); animate(x, 0, { type: "spring", stiffness: 420, damping: 30 }); }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (done || disabled) return;
    if (e.key === "ArrowRight") { e.preventDefault(); animate(x, Math.min(max, x.get() + max * 0.25), { type: "spring", stiffness: 400, damping: 30 }); if (x.get() + max * 0.25 >= max * 0.99) finish(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); animate(x, Math.max(0, x.get() - max * 0.25), { type: "spring", stiffness: 400, damping: 30 }); }
    if (e.key === "Enter") { e.preventDefault(); finish(); }
  };

  return (
    <motion.div
      animate={pulse}
      className={`relative ${disabled ? "opacity-50" : ""}`}
    >
      <div
        ref={track}
        className="gold-border glass relative h-[76px] w-full select-none overflow-hidden rounded-full"
        data-active={dragging || done}
        style={{ touchAction: "none" }}
      >
        {/* charging fill */}
        <motion.div style={{ width: fillWidth }} className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/10 via-gold/50 to-gold-soft" />

        {/* shimmering instruction */}
        <motion.div
          style={{ opacity: labelOpacity, x: labelShift }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center pl-16 text-sm font-medium uppercase tracking-[0.25em]"
        >
          <span className="bg-[linear-gradient(100deg,rgba(249,248,245,.45)_30%,#F3E3A6_50%,rgba(249,248,245,.45)_70%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-sheen">
            {label}
          </span>
          <ChevronsRight size={18} className="ml-2 animate-pulse text-gold" />
        </motion.div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 pr-16 text-sm font-semibold uppercase tracking-[0.2em] text-obsidian"
            >
              <Check size={18} /> {doneLabel}
            </motion.div>
          )}
        </AnimatePresence>

        {/* handle */}
        <motion.div
          role="slider" tabIndex={disabled ? -1 : 0}
          aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={done ? 100 : 0}
          aria-disabled={disabled}
          data-cursor={done ? "" : "Slide"} data-snap
          drag={disabled || done ? false : "x"}
          dragConstraints={{ left: 0, right: max }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => { setDragging(true); buzz(8); }}
          onDragEnd={release}
          onKeyDown={onKeyDown}
          style={{ x, y: tremble, boxShadow: handleShadow, left: PAD, top: PAD, width: HANDLE, height: HANDLE, touchAction: "none" }}
          whileTap={{ scale: 1.08 }}
          className="absolute z-10 grid cursor-grab place-items-center rounded-full bg-gradient-to-br from-gold-pale via-gold to-[#B8932B] text-obsidian active:cursor-grabbing"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={done ? "open" : "locked"} initial={{ rotate: -90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 20 }}>
              {done ? <LockOpen size={22} /> : <Lock size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* spark burst */}
        {sparks.map((i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              initial={{ x: max + HANDLE / 2 + PAD, y: 38, opacity: 1, scale: 1 }}
              animate={{ x: max + HANDLE / 2 + PAD + Math.cos(angle) * (60 + (i % 3) * 22), y: 38 + Math.sin(angle) * (40 + (i % 3) * 16), opacity: 0, scale: 0.2 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-pale shadow-[0_0_10px_3px_rgba(212,175,55,.9)]"
            />
          );
        })}
      </div>
    </motion.div>
  );
}
