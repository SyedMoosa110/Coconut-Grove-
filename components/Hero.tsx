"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import FairyCanvas from "./FairyCanvas";
import Magnetic from "./Magnetic";
import SplitText from "./SplitText";
import { HERO_IMAGES } from "@/lib/data";
import { LUXE } from "@/lib/ease";
import { useSiteReady } from "@/lib/ready";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const ready = useSiteReady();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(t);
  }, []);

  // GSAP ScrollTrigger: the photo drifts and zooms slower than the page, the copy lifts away and fades.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(bg.current, {
        yPercent: 16, scale: 1.1, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        yPercent: -14, opacity: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "75% top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 26, filter: "blur(8px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 1.4, delay, ease: LUXE },
  });

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-obsidian">
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.16 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 2.2, ease: "easeInOut" }, scale: { duration: 9, ease: "linear" } }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[index]})` }}
          />
        </AnimatePresence>
      </div>

      {/* grade: forest vignette + gold bloom + floor fade into the next section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,20,14,.35)_0%,rgba(7,20,14,.82)_75%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-transparent to-obsidian" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(212,175,55,.22),transparent_55%)]" />
      <FairyCanvas density={1.15} embers={0.4} />

      <div ref={content} className="relative z-10 mx-auto max-w-5xl px-5 pt-24 text-center">
        <motion.p {...fade(0.1)} className="mb-6 text-[11px] uppercase tracking-[0.55em] text-gold sm:text-xs">
          Tropical garden dining · Karachi
        </motion.p>

        <SplitText
          as="h1" text={"Coconut\nGrove"} accent={["grove"]} waitForReady delay={0.15} stagger={0.12}
          className="font-display text-[clamp(4rem,16vw,12rem)] font-medium leading-[0.86] tracking-tight text-cream text-shadow-soft"
        />

        <motion.p {...fade(0.9)} className="mx-auto mt-8 max-w-xl text-base text-cream/75 sm:text-lg">
          Charcoal grills, wood-fired pizza and wok-hot plates, served under a canopy of fairy lights and palms.
        </motion.p>

        <motion.div {...fade(1.15)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <a href="#reserve" data-cursor="Book" className="block rounded-full bg-gold px-8 py-4 font-semibold text-obsidian shadow-[0_0_40px_rgba(212,175,55,.35)] transition-shadow duration-500 hover:shadow-[0_0_70px_rgba(212,175,55,.65)]">
              Reserve a table
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#menu" data-cursor="Explore" className="glass gold-border block rounded-full px-8 py-4 text-cream transition-colors hover:text-gold">
              Explore the menu
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* reel indicator */}
      <div className="absolute bottom-8 left-5 z-10 hidden items-center gap-2 sm:flex sm:left-10" aria-hidden="true">
        {HERO_IMAGES.map((_, i) => (
          <span key={i} className="relative h-px w-10 overflow-hidden bg-white/20">
            {i === index && (
              <motion.span key={`bar-${index}`} className="absolute inset-0 origin-left bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: "linear" }} />
            )}
          </span>
        ))}
      </div>

      <a href="#experience" aria-label="Scroll down" data-cursor="Scroll" className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-cream/60 sm:bottom-8">
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-0 animate-scrollcue bg-gold" />
        </span>
        <ArrowDown size={12} className="sr-only" />
      </a>
    </section>
  );
}
