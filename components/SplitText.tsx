"use client";

import { motion } from "framer-motion";

/** Word-by-word lift reveal. Each word sits in an overflow-hidden mask. */
export default function SplitText({ text, className = "", delay = 0.2 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.95, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
