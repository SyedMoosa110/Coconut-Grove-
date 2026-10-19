"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARQUEE_WORDS } from "@/lib/data";

/** Infinite GSAP ticker. Scroll velocity speeds it up and flips direction, like a film reel catching the wind. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const loop = gsap.to(track.current, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const dir = self.direction === 1 ? 1 : -1;
          gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(self.getVelocity()) / 260, 6)), duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: "auto" });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const row = [...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div ref={root} aria-hidden="true" className="relative overflow-hidden border-y border-gold/15 bg-charcoal py-6">
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center font-display text-3xl italic text-cream/80 sm:text-5xl">
                <span className="px-6 sm:px-10">{w}</span>
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-charcoal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-charcoal to-transparent" />
    </div>
  );
}
