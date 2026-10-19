"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Minus, Plus, ShoppingBag, X } from "lucide-react";
import FoodImage from "./FoodImage";
import { useShop } from "@/context/ShopContext";
import { fmt } from "@/lib/data";
import { buildOrderMessage, waLink } from "@/lib/whatsapp";

export default function CartBar() {
  const { lines, count, total, add, remove, clear, drawerOpen, setDrawerOpen } = useShop();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const send = () => {
    window.open(waLink(buildOrderMessage(lines, total, name.trim(), note.trim())), "_blank", "noopener");
  };

  return (
    <>
      <AnimatePresence>
        {count > 0 && !drawerOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-3 bottom-4 z-40 mx-auto max-w-md pb-[env(safe-area-inset-bottom)]"
          >
            <button onClick={() => setDrawerOpen(true)} data-cursor="Review" className="glass-strong gold-border flex w-full items-center justify-between rounded-full py-2.5 pl-5 pr-2.5 shadow-2xl shadow-black/50">
              <span className="flex items-center gap-3">
                <span className="relative">
                  <ShoppingBag size={20} className="text-gold" />
                  <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-bold text-obsidian">{count}</span>
                </span>
                <span className="text-sm">{count} {count === 1 ? "dish" : "dishes"} · {fmt(total)}</span>
              </span>
              <span className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian">Review order</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} data-cursor="Close" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog" aria-label="Your order"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, i) => { if (i.offset.y > 120) setDrawerOpen(false); }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88svh] max-w-lg flex-col rounded-t-[2rem] border border-gold/25 bg-obsidian/95 backdrop-blur-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/25" />
              <div className="flex items-center justify-between">
                <h3 className="font-display text-3xl">Your order</h3>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><X size={18} /></button>
              </div>

              <ul className="no-scrollbar mt-5 flex-1 space-y-4 overflow-y-auto">
                {lines.map(({ dish, qty }) => (
                  <li key={dish.id} className="flex items-center gap-4">
                    <FoodImage src={dish.image} alt={dish.name} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{dish.name}</p>
                      <p className="text-sm text-gold">{fmt(dish.price * qty)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/15 p-1">
                      <button onClick={() => remove(dish.id)} aria-label="Remove one" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Minus size={14} /></button>
                      <span className="w-5 text-center text-sm">{qty}</span>
                      <button onClick={() => add(dish.id)} aria-label="Add one" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Plus size={14} /></button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 outline-none placeholder:text-cream/40 focus:border-gold" />
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes: spice level, allergies, table number" className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 outline-none placeholder:text-cream/40 focus:border-gold" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-cream/70">Total</span>
                  <span className="font-display text-3xl text-gold">{fmt(total)}</span>
                </div>
                <button onClick={send} data-cursor="Send" className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-semibold text-obsidian animate-glow">
                  <MessageCircle size={18} /> Order via WhatsApp
                </button>
                <button onClick={() => { clear(); setDrawerOpen(false); }} className="w-full py-2 text-sm text-cream/60 hover:text-cream">Clear order</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
