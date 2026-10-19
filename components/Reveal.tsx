"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { LUXE } from "@/lib/ease";

/** Soft rise + de-blur for paragraphs, cards and anything that isn't a headline. */
export default function Reveal({
  children, delay = 0, y = 44, className = "",
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.2, delay, ease: LUXE }}
    >
      {children}
    </motion.div>
  );
}
