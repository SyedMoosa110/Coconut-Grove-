"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import FairyCanvas from "./FairyCanvas";
import FoodImage from "./FoodImage";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import TiltCard from "./TiltCard";
import AmbienceSlider from "./AmbienceSlider";
import { GALLERY, STATS } from "@/lib/data";

function Gallery() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  const x = useMotionValue(0);
  const progress = useTransform(x, [0, -Math.max(limit, 1)], [0.12, 1]);

  useEffect(() => {
    const measure = () => {
      if (!wrap.current || !track.current) return;
      setLimit(Math.max(0, track.current.scrollWidth - wrap.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      <div ref={wrap} className="overflow-hidden px-5 sm:px-8 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]" data-cursor="Drag">
        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.14}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 30, power: 0.35 }}
          style={{ x, touchAction: "pan-y" }}
          className="flex w-max cursor-grab select-none gap-5 pr-8 active:cursor-grabbing sm:gap-7"
        >
          {GALLERY.map((g, i) => (
            <TiltCard key={g.title} max={9} className="w-[78vw] shrink-0 sm:w-[360px]">
              <figure className="gold-border glass relative aspect-[3/4] overflow-hidden rounded-[1.75rem]">
                <FoodImage src={g.image} alt={g.title} className="absolute inset-0 h-full w-full scale-110 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                <span className="tilt-layer absolute left-5 top-5 font-display text-5xl italic text-gold/90">0{i + 1}</span>
                <figcaption className="tilt-layer absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-3xl">{g.title}</h3>
                  <p className="mt-2 text-sm text-cream/70">{g.caption}</p>
                </figcaption>
              </figure>
            </TiltCard>
          ))}
        </motion.div>
      </div>
      <div className="mx-auto mt-8 flex max-w-6xl items-center gap-4 px-5 sm:px-8">
        <span className="text-[11px] uppercase tracking-[0.35em] text-cream/50">Drag to explore</span>
        <div className="relative h-px flex-1 bg-white/10">
          <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-gold shadow-[0_0_12px_rgba(212,175,55,.7)]" />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="experience" className="relative overflow-hidden bg-gradient-to-b from-obsidian via-forest to-obsidian py-28 sm:py-36">
      <FairyCanvas density={0.8} embers={0.15} className="opacity-80" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-5 text-[11px] uppercase tracking-[0.5em] text-gold">The experience</p>
        <SplitText
          text={"An evening under\nthe canopy"} accent={["canopy"]}
          className="max-w-4xl font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95]"
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal>
            <p className="max-w-xl text-lg leading-relaxed text-cream/75">
              Step off the street and into a quiet garden. Palms sway above lantern-lit paths, the grill glows at the far end,
              and every cabana hums beneath its own ceiling of fairy lights. Come at noon for sun and steaks, or wait for the
              lights to wake up.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="glass gold-border rounded-2xl p-4 text-center">
                  <dt className="font-display text-4xl text-gold-gradient sm:text-5xl">{s.value}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.2em] text-cream/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-20 sm:mt-24">
        <Gallery />
      </div>

      <div className="relative mx-auto mt-28 max-w-6xl px-5 sm:mt-36 sm:px-8">
        <p className="mb-5 text-[11px] uppercase tracking-[0.5em] text-gold">Day to night</p>
        <SplitText text={"Watch the garden\nlight up"} accent={["light"]} className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.98]" />
        <Reveal className="mt-12">
          <AmbienceSlider />
        </Reveal>
      </div>
    </section>
  );
}
