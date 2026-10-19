"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import FoodImage from "./FoodImage";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import TiltCard from "./TiltCard";
import DishModal, { BADGE_STYLE, BadgeChip } from "./DishModal";
import { useShop } from "@/context/ShopContext";
import { BADGES, CATEGORIES, CATEGORY_META, DISHES, fmt, type Badge, type Dish } from "@/lib/data";
import { LUXE } from "@/lib/ease";

function DishCard({ dish, onOpen }: { dish: Dish; onOpen: (d: Dish) => void }) {
  const { qtyOf, add, remove } = useShop();
  const qty = qtyOf(dish.id);

  return (
    <TiltCard
      className="h-full"
      role="button" tabIndex={0} aria-label={`View ${dish.name}`}
      data-cursor="View Dish"
      onClick={() => onOpen(dish)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(dish); } }}
    >
      <article className="gold-border glass group flex h-full flex-col overflow-hidden rounded-[1.75rem]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <FoodImage src={dish.image} alt={dish.name} className="h-full w-full scale-[1.12] object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.22]" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
          <div className="tilt-layer absolute left-3 top-3 flex flex-wrap gap-1.5">
            {dish.badges.map((b) => <BadgeChip key={b} badge={b} />)}
          </div>
          <span className="tilt-layer glass-strong absolute bottom-3 right-3 rounded-full px-4 py-1.5 font-display text-xl text-gold">{fmt(dish.price)}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-2xl leading-tight">{dish.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-cream/65">{dish.description}</p>
          <div className="mt-auto flex items-center justify-between pt-5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-cream/40">{dish.ingredients.length} ingredients</span>
            {qty === 0 ? (
              <button
                onClick={() => add(dish.id)} data-cursor="Add" data-snap
                className="flex items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2 text-sm text-gold transition-all duration-500 ease-luxe hover:bg-gold hover:text-obsidian hover:shadow-[0_0_28px_rgba(212,175,55,.5)]"
              >
                <Plus size={14} /> Add
              </button>
            ) : (
              <div className="flex items-center gap-1 rounded-full border border-gold/60 p-1">
                <button onClick={() => remove(dish.id)} aria-label={`Remove one ${dish.name}`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Minus size={14} /></button>
                <motion.span key={qty} initial={{ scale: 1.5, color: "#F3E3A6" }} animate={{ scale: 1, color: "#F9F8F5" }} className="w-5 text-center text-sm font-semibold">{qty}</motion.span>
                <button onClick={() => add(dish.id)} aria-label={`Add one ${dish.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-gold text-obsidian"><Plus size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default function Menu() {
  const { category, setCategory } = useShop();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [open, setOpen] = useState<Dish | null>(null);

  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, DISHES.filter((d) => d.category === c).length])) as Record<string, number>,
    [],
  );
  const dishes = useMemo(
    () => DISHES.filter((d) => d.category === category && (!badge || d.badges.includes(badge))),
    [category, badge],
  );

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    const c = CATEGORIES[(next + CATEGORIES.length) % CATEGORIES.length];
    setCategory(c);
    document.getElementById(`tab-${c}`)?.focus();
    e.preventDefault();
  };

  return (
    <section id="menu" className="relative bg-obsidian py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-5 text-[11px] uppercase tracking-[0.5em] text-gold">The menu</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitText text={"Fire, smoke\nand garden herbs"} accent={["smoke"]} className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.96]" />
          <Reveal className="max-w-sm"><p className="text-cream/65">Tap a dish for the full story. Build your order, then send it to our kitchen on WhatsApp.</p></Reveal>
        </div>

        {/* category tabs */}
        <div className="no-scrollbar -mx-5 mt-12 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Menu categories" className="glass relative inline-flex min-w-max gap-1 rounded-full p-1.5">
            {CATEGORIES.map((c, i) => {
              const active = c === category;
              return (
                <button
                  key={c} id={`tab-${c}`} role="tab" aria-selected={active} aria-controls="menu-panel" tabIndex={active ? 0 : -1}
                  onClick={() => setCategory(c)} onKeyDown={(e) => onTabKey(e, i)} data-cursor="Open" data-snap
                  className={`relative rounded-full px-5 py-3 text-sm transition-colors duration-500 ${active ? "text-obsidian" : "text-cream/75 hover:text-gold"}`}
                >
                  {active && (
                    <motion.span layoutId="tab-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-gold shadow-[0_0_30px_rgba(212,175,55,.5)]" />
                  )}
                  <span className="relative z-10 flex items-center gap-2 font-medium">
                    {c}
                    <span className={`text-[10px] ${active ? "text-obsidian/60" : "text-cream/40"}`}>{counts[c]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* badge filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
          <span className="mr-2 text-[11px] uppercase tracking-[0.3em] text-cream/45">Filter</span>
          {BADGES.map((b) => {
            const active = badge === b;
            const Icon = BADGE_STYLE[b].icon;
            return (
              <button
                key={b} onClick={() => setBadge(active ? null : b)} aria-pressed={active} data-cursor={active ? "Clear" : "Filter"}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-500 ease-luxe ${
                  active ? "border-gold bg-gold/15 text-gold shadow-[0_0_24px_rgba(212,175,55,.3)]" : "border-white/15 text-cream/70 hover:border-gold/60 hover:text-gold"
                }`}
              >
                {active ? <Check size={12} /> : <Icon size={12} />} {b}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={category}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.6, ease: LUXE }}
            className="mt-10 font-display text-2xl italic text-gold/90 sm:text-3xl"
          >
            {CATEGORY_META[category].tagline}
          </motion.p>
        </AnimatePresence>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${category}`} className="mt-8">
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {dishes.map((dish, i) => (
                <motion.div
                  key={dish.id} layout
                  initial={{ opacity: 0, y: 60, rotateX: -12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.9, delay: i * 0.07, ease: LUXE }}
                >
                  <DishCard dish={dish} onOpen={setOpen} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {dishes.length === 0 && (
            <div className="glass rounded-3xl p-10 text-center">
              <p className="font-display text-3xl">Nothing tagged “{badge}” in {category} yet.</p>
              <button onClick={() => setBadge(null)} className="mt-5 rounded-full border border-gold/60 px-6 py-2.5 text-gold hover:bg-gold hover:text-obsidian">Show every dish</button>
            </div>
          )}
        </div>
      </div>
      <DishModal dish={open} onClose={() => setOpen(null)} />
    </section>
  );
}
