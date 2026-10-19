"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markReady } from "@/lib/ready";

/** Cinematic curtain: letters rise, a gold line fills, then the whole screen wipes upward revealing the hero. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("cg-intro") === "1"; } catch { /* storage blocked: just play the intro */ }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setGone(true);
      markReady();
      return;
    }

    document.body.classList.add("scroll-locked");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("scroll-locked");
          try { sessionStorage.setItem("cg-intro", "1"); } catch { /* ignore */ }
          setGone(true);
        },
      });
      tl.from(".pl-letter", { yPercent: 120, rotate: 6, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.045 })
        .from(".pl-sub", { opacity: 0, y: 12, letterSpacing: "0.1em", duration: 1, ease: "expo.out" }, "-=0.6")
        .to(".pl-line-fill", { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, "-=0.7")
        .to(".pl-content", { opacity: 0, y: -30, duration: 0.6, ease: "power3.in" }, "+=0.15")
        .add(() => markReady(), "-=0.25")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "expo.inOut" }, "-=0.35");
    }, root);

    return () => {
      ctx.revert();
      document.body.classList.remove("scroll-locked");
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="cg-preloader fixed inset-0 z-[150] grid place-items-center bg-obsidian"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="pl-content flex flex-col items-center px-6 text-center">
        <div className="flex overflow-hidden pb-3 font-display text-[clamp(2.6rem,10vw,6rem)] leading-none">
          {"Coconut Grove".split("").map((c, i) => (
            <span key={i} className="pl-letter inline-block text-cream" style={{ whiteSpace: "pre" }}>{c}</span>
          ))}
        </div>
        <p className="pl-sub mt-2 text-xs uppercase tracking-[0.5em] text-gold">Karachi</p>
        <div className="mt-10 h-px w-56 bg-white/10">
          <div className="pl-line-fill h-full origin-left scale-x-0 bg-gradient-to-r from-gold/0 via-gold to-gold/0 shadow-[0_0_16px_2px_rgba(212,175,55,.6)]" />
        </div>
      </div>
    </div>
  );
}
