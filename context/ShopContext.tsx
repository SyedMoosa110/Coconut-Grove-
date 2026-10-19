"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DISHES, type Category, type Dish } from "@/lib/data";

interface ShopCtx {
  category: Category;
  setCategory: (c: Category) => void;
  lines: { dish: Dish; qty: number }[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

const Ctx = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<Category>("BBQ & Grills");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const add = useCallback((id: string) => setQty((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 })), []);
  const remove = useCallback(
    (id: string) =>
      setQty((q) => {
        const next = { ...q, [id]: (q[id] ?? 0) - 1 };
        if (next[id] <= 0) delete next[id];
        return next;
      }),
    [],
  );
  const clear = useCallback(() => setQty({}), []);

  const value = useMemo<ShopCtx>(() => {
    const lines = DISHES.filter((d) => qty[d.id]).map((dish) => ({ dish, qty: qty[dish.id] }));
    return {
      category, setCategory, lines, drawerOpen, setDrawerOpen, add, remove, clear,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.dish.price, 0),
      qtyOf: (id) => qty[id] ?? 0,
    };
  }, [category, qty, drawerOpen, add, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used inside <ShopProvider>");
  return c;
}
