"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Info, Minus, Plus, X } from "lucide-react";
import { CATEGORIES, DISHES, fmt, type Badge, type Dish } from "@/lib/data";
import FoodImage from "./FoodImage";
import { useShop } from "@/context/ShopContext";

const BADGE_STYLE: Record<Badge, string> = {
  "Chef's Signature": "bg-[linear-gradient(110deg,#B8932A,#F3E3A0,#B8932A)] bg-[length:200%_100%] animate-shimmer text-forest",
  "Most Ordered": "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 shadow-[0_0_14px_rgba(52,211,153,0.35)]",
  Spicy: "bg-amber-500/20 text-amber-200 border border-amber-400/40",
};

function TiltCard({ dish, index }: { dish: Dish; index: number }) {
  const { add, remove, qtyOf } = useShop();
  const [showInfo, setShowInfo] = useState(false);
  const qty = qtyOf(dish.id);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 200, damping: 18 });
  const ix = useSpring(useTransform(mx, [0, 1], [12, -12]), { stiffness: 150, damping: 20 });
  const iy = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 150, damping: 20 });
  const px = useTransform(mx, (v) => v * 100);
  const py = useTransform(my, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${px}% ${py}%, rgba(212,175,55,0.22), transparent 65%)`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-charcoal transition-[border-color,box-shadow] duration-500 hover:border-gold/70 hover:shadow-[0_0_40px_-6px_rgba(212,175,55,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div style={{ x: ix, y: iy, scale: 1.14 }} className="h-full w-full"><FoodImage src={dish.image} alt={dish.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" /></motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {dish.badges.map((b) => (
            <span key={b} className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLE[b]}`}>{b}</span>
          ))}
        </div>
        <button
          onClick={() => setShowInfo(true)}
          aria-label={`Ingredients of ${dish.name}`}
          className="glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:border-gold"
        >
          <Info size={16} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight">{dish.name}</h3>
          <span className="shrink-0 pt-1 font-semibold text-gold">{fmt(dish.price)}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-cream/65">{dish.description}</p>

        <div className="mt-5">
          {qty === 0 ? (
            <button
              onClick={() => add(dish.id)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/60 py-3 text-sm font-semibold transition-colors hover:bg-gold hover:text-forest"
            >
              <Plus size={16} /> Add to WhatsApp order
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-full border border-gold bg-gold/10 p-1">
              <button onClick={() => remove(dish.id)} aria-label="Remove one" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><Minus size={16} /></button>
              <span className="font-semibold">{qty} in order</span>
              <button onClick={() => add(dish.id)} aria-label="Add one" className="grid h-10 w-10 place-items-center rounded-full bg-gold text-forest"><Plus size={16} /></button>
            </div>
          )}
        </div>
      </div>

      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glare }} />

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-center bg-forest/90 p-6 backdrop-blur-md"
          >
            <button onClick={() => setShowInfo(false)} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20"><X size={16} /></button>
            <p className="font-display text-2xl text-gold">Key ingredients</p>
            <ul className="mt-4 space-y-2">
              {dish.ingredients.map((ing, i) => (
                <motion.li key={ing} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center gap-3 text-cream/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />{ing}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Menu() {
  const { category, setCategory } = useShop();
  const dishes = DISHES.filter((d) => d.category === category);

  return (
    <section id="menu" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-6xl"
        >
          The menu
        </motion.h2>
        <p className="mt-4 max-w-lg text-cream/70">Browse five collections, then tap a dish to build your order. We prepare the list for WhatsApp, you send it in one tap.</p>

        <div role="tablist" className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c} role="tab" aria-selected={category === c} onClick={() => setCategory(c)}
              className="relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              {category === c && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className={`relative transition-colors ${category === c ? "text-forest" : "text-cream/75 hover:text-gold"}`}>{c}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {dishes.map((d, i) => <TiltCard key={d.id} dish={d} index={i} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
