"use client";

import { createElement, useRef, type ElementType } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { LUXE } from "@/lib/ease";
import { useSiteReady } from "@/lib/ready";

interface Props {
  text: string;            // use "\n" for forced line breaks
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  accent?: string[];       // words (lowercase, no punctuation) rendered in italic champagne gold
  waitForReady?: boolean;  // hold the reveal until the preloader curtain has lifted
}

/** Staggered word reveal: each word rises out of a mask with a clip-path wipe on the house easing. */
export default function SplitText({ text, as = "h2", className = "", delay = 0, stagger = 0.07, accent = [], waitForReady = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useSiteReady();
  const reduce = useReducedMotion();
  const show = inView && (!waitForReady || ready);

  const lines = text.split("\n").map((l) => l.split(" ").filter(Boolean));
  let idx = 0;

  const children = lines.map((words, li) => (
    <span key={li} className="block" aria-hidden="true">
      {words.map((w, wi) => {
        const i = idx++;
        const clean = w.toLowerCase().replace(/[^a-z']/g, "");
        const isAccent = accent.includes(clean);
        return (
          <span key={wi}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em] pr-[0.1em] -mr-[0.1em]">
              <motion.span
                className={`inline-block will-change-transform ${isAccent ? "italic text-gold-gradient" : ""}`}
                initial={reduce ? false : { y: "115%", clipPath: "inset(0% 0% 100% 0%)", rotate: 4 }}
                animate={show ? { y: "0%", clipPath: "inset(-12% -6% -28% -6%)", rotate: 0 } : undefined}
                transition={{ duration: 1.25, delay: delay + i * stagger, ease: LUXE }}
              >
                {w}
              </motion.span>
            </span>
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  ));

  return createElement(as, { ref, className, "aria-label": text.replace(/\n/g, " ") }, children);
}
