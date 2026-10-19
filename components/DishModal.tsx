"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Minus, Plus, Sparkles, Star, X } from "lucide-react";
import FoodImage from "./FoodImage";
import { useShop } from "@/context/ShopContext";
import { fmt, type Badge, type Dish } from "@/lib/data";

export const BADGE_STYLE: Record<Badge, { icon: typeof Star; cls: string }> = {
  "Chef's Signature": { icon: Sparkles, cls: "bg-gold text-obsidian border-gold" },
  "Most Ordered": { icon: Star, cls: "bg-cream/10 text-cream border-cream/40 backdrop-blur-md" },
  Spicy: { icon: Flame, cls: "bg-red-500/20 text-red-200 border-red-400/50 backdrop-blur-md" },
};

export function BadgeChip({ badge }: { badge: Badge }) {
  const { icon: Icon, cls } = BADGE_STYLE[badge];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>
      <Icon size={11} /> {badge}
    </span>
  );
}

export default function DishModal({ dish, onClose }: { dish: Dish | null; onClose: () => void }) {
  const { qtyOf, add, remove } = useShop();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!dish) return;
    document.body.classList.add("scroll-locked");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [dish, onClose]);

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          key="modal" className="fixed inset-0 z-[60] grid place-items-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-md" onClick={onClose} data-cursor="Close" />
          <motion.div
            role="dialog" aria-modal="true" aria-label={dish.name}
            initial={{ opacity: 0, y: 60, scale: 0.94, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong gold-border relative grid max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-[2rem] md:grid-cols-2"
            style={{ transformPerspective: 1200 }}
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
              <FoodImage src={dish.image} alt={dish.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {dish.badges.map((b) => <BadgeChip key={b} badge={b} />)}
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <button ref={closeRef} onClick={onClose} aria-label="Close" data-cursor="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-obsidian/50 backdrop-blur-md transition-colors hover:border-gold hover:text-gold">
                <X size={18} />
              </button>
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{dish.category}</p>
              <h3 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{dish.name}</h3>
              <p className="mt-4 text-cream/75">{dish.description}</p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-cream/50">Built from</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {dish.ingredients.map((i) => (
                  <li key={i} className="rounded-full border border-white/15 px-3 py-1 text-sm text-cream/85">{i}</li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                <span className="font-display text-4xl text-gold-gradient">{fmt(dish.price)}</span>
                {qtyOf(dish.id) === 0 ? (
                  <button onClick={() => add(dish.id)} data-cursor="Add" className="rounded-full bg-gold px-7 py-3.5 font-semibold text-obsidian transition-shadow hover:shadow-[0_0_40px_rgba(212,175,55,.6)]">
                    Add to order
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-full border border-gold/50 p-1.5">
                    <button onClick={() => remove(dish.id)} aria-label="Remove one" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><Minus size={16} /></button>
                    <span className="w-6 text-center font-semibold">{qtyOf(dish.id)}</span>
                    <button onClick={() => add(dish.id)} aria-label="Add one" className="grid h-10 w-10 place-items-center rounded-full bg-gold text-obsidian"><Plus size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
