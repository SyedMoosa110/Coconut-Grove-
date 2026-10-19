"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import SplitText from "./SplitText";
import Magnetic from "./Magnetic";
import FairyLights from "./FairyLights";
import { HERO_IMAGES, HERO_VIDEO } from "@/lib/data";

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-forest-deep">
        {HERO_VIDEO && <video src={HERO_VIDEO} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />}
        <AnimatePresence>
          <motion.img
            key={i}
            src={HERO_IMAGES[i]}
            alt=""
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6 }, scale: { duration: 9, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest/80 via-forest/45 to-forest" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(212,175,55,0.16),transparent_55%)]" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 animate-pulse rounded-full bg-gold/10 blur-[110px]" />
      <FairyLights count={30} />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
        >
          <Star size={15} className="fill-gold text-gold" />
          <span>4.2</span><span className="text-cream/40">|</span><span>500+ Google Reviews</span>
        </motion.div>

        <h1 className="font-display text-[2.9rem] font-medium leading-[1.02] text-shadow-soft sm:text-7xl lg:text-[6.5rem]">
          <SplitText text="A Serene Tropical Dining Experience in Karachi" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-cream/80"
        >
          Fairy-lit cabanas, live charcoal and a garden that stays cool after dark. Book a table or order your favourites on WhatsApp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55, duration: 0.8 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Magnetic>
            <a href="#reserve" className="group relative flex items-center justify-center overflow-hidden rounded-full border border-gold px-9 py-4 font-semibold text-cream animate-glow">
              <span aria-hidden className="absolute inset-0 translate-y-full rounded-t-[50%] bg-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative transition-colors duration-300 group-hover:text-forest">Reserve a Table</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#menu" className="flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-9 py-4 font-medium backdrop-blur-md transition-colors hover:border-gold/60">
              Explore Digital Menu
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <a href="#experience" aria-label="Scroll down" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold/80">
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="block"><ChevronDown /></motion.span>
      </a>
    </section>
  );
}
