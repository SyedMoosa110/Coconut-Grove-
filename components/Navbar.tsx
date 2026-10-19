"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Menu as MenuIcon, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import type { Category } from "@/lib/data";

const LINKS: { label: string; href: string; category?: Category }[] = [
  { label: "Experience", href: "#experience" },
  { label: "BBQ", href: "#menu", category: "BBQ" },
  { label: "Steaks", href: "#menu", category: "Steaks & Continental" },
  { label: "Pizza", href: "#menu", category: "Gourmet Pizza" },
  { label: "Visit", href: "#visit" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setCategory } = useShop();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (c?: Category) => { if (c) setCategory(c); setOpen(false); };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-3 top-3 z-50 mx-auto max-w-5xl sm:top-5"
    >
      <nav className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-colors duration-500 sm:px-6 ${scrolled ? "glass-strong shadow-2xl shadow-black/40" : "glass"}`}>
        <a href="#top" className="flex items-center gap-2" aria-label="Coconut Grove home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-forest"><Leaf size={16} /></span>
          <span className="font-display text-xl font-semibold tracking-wide">Coconut Grove</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={() => go(l.category)} className="text-sm text-cream/80 transition-colors hover:text-gold">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#reserve" className="relative rounded-full bg-gold px-4 py-2 text-sm font-semibold text-forest animate-glow sm:px-5">
            Book Table
          </a>
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 md:hidden">
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="glass-strong mt-2 overflow-hidden rounded-3xl p-3 md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => go(l.category)} className="block rounded-2xl px-4 py-3.5 text-lg text-cream/90 active:bg-white/10">{l.label}</a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
