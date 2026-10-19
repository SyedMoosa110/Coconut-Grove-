"use client";

import { useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import FairyLights from "./FairyLights";
import { DAY_IMAGE, GALLERY, NIGHT_IMAGE } from "@/lib/data";

function DayNight() {
  const [pos, setPos] = useState(0); // divider position: left of it shows daylight
  const glide = (to: number) => animate(pos, to, { duration: 1.1, ease: [0.65, 0, 0.35, 1], onUpdate: setPos });

  return (
    <div className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl sm:text-5xl">Same garden, two moods</h3>
          <p className="mt-2 max-w-md text-cream/70">Drag the slider to watch the grove change from afternoon light to lantern glow.</p>
        </div>
        <div className="glass flex rounded-full p-1">
          <button onClick={() => glide(100)} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Sun size={15} />Day</button>
          <button onClick={() => glide(0)} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Moon size={15} />Night</button>
        </div>
      </div>

      <div className="relative aspect-[4/3] select-none overflow-hidden rounded-3xl border border-white/10 sm:aspect-[16/8]" data-cursor>
        <img src={NIGHT_IMAGE} alt="Coconut Grove garden at night under fairy lights" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.28),transparent_60%)] mix-blend-screen" style={{ opacity: 1 - pos / 100 }} />
        <img
          src={DAY_IMAGE} alt="Coconut Grove garden in daylight"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div className="pointer-events-none absolute inset-y-0 w-px bg-gold shadow-[0_0_18px_3px_rgba(212,175,55,0.8)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-forest/80 text-gold backdrop-blur">
            <ChevronLeft size={12} /><ChevronRight size={12} />
          </span>
        </div>
        <input
          type="range" min={0} max={100} step={0.1} value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Day to night slider"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  );
}

export default function About() {
  const rail = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <section id="experience" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[70%] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <FairyLights count={20} seed={7} className="opacity-70" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl font-display text-4xl leading-tight sm:text-6xl"
          >
            Dinner under the palms, away from the city noise
          </motion.h2>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scrollBy(-1)} aria-label="Previous" className="glass grid h-12 w-12 place-items-center rounded-full hover:border-gold/60"><ChevronLeft /></button>
            <button onClick={() => scrollBy(1)} aria-label="Next" className="glass grid h-12 w-12 place-items-center rounded-full hover:border-gold/60"><ChevronRight /></button>
          </div>
        </div>
        <p className="mt-6 max-w-xl text-cream/70">
          Coconut Grove is built around its garden: canopy cabanas, warm lantern light and a menu cooked over charcoal.
        </p>
      </div>

      <div ref={rail} className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        {GALLERY.map((g, idx) => (
          <motion.figure
            key={g.title}
            initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: idx * 0.08 }}
            className={`group relative h-[26rem] w-[78vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/10 sm:w-[24rem] ${idx % 2 ? "sm:mt-10" : ""}`}
          >
            <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-2xl">{g.title}</p>
              <p className="mt-1 text-sm text-cream/70">{g.caption}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <DayNight />
    </section>
  );
}
