"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Leaf, Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import Magnetic from "./Magnetic";
import { useShop } from "@/context/ShopContext";
import { LUXE } from "@/lib/ease";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#menu", label: "Menu" },
  { href: "#reserve", label: "Reserve" },
  { href: "#visit", label: "Visit" },
];

export default function Navbar() {
  const { count, setDrawerOpen } = useShop();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 220 && !open);
  });

  useEffect(() => {
    document.body.classList.toggle("scroll-locked", open);
    return () => document.body.classList.remove("scroll-locked");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.7, ease: LUXE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-[background,border-color,box-shadow] duration-700 ease-luxe sm:px-6 ${
            scrolled ? "glass-strong shadow-[0_10px_50px_-10px_rgba(0,0,0,.7)]" : "border border-transparent bg-transparent"
          }`}
        >
          <a href="#top" data-cursor="Home" className="flex items-center gap-2 font-display text-xl sm:text-2xl">
            <Leaf size={18} className="text-gold" /> Coconut Grove
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Magnetic strength={0.25}>
                  <a href={l.href} className="group relative block rounded-full px-4 py-2 text-sm text-cream/80 transition-colors hover:text-gold">
                    {l.label}
                    <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)} aria-label={`Open order, ${count} items`} data-cursor="Order"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-gold"
            >
              <ShoppingBag size={17} className="text-gold" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-obsidian"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <span className="hidden sm:block">
              <Magnetic>
                <a href="#reserve" data-cursor="Book" className="block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian transition-shadow hover:shadow-[0_0_30px_rgba(212,175,55,.55)]">
                  Book a table
                </a>
              </Magnetic>
            </span>
            <button
              onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 md:hidden"
            >
              {open ? <X size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </nav>
        <motion.div style={{ scaleX: progress }} className="mx-auto mt-2 h-px max-w-6xl origin-left bg-gradient-to-r from-gold/0 via-gold to-gold/0 opacity-70" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.9, ease: LUXE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-obsidian/95 px-8 backdrop-blur-2xl md:hidden"
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href} onClick={() => setOpen(false)}
                    initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.25 + i * 0.08, ease: LUXE }}
                    className="block font-display text-6xl leading-tight text-cream hover:text-gold"
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm uppercase tracking-[0.3em] text-gold/80">Tropical garden dining · Karachi</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
