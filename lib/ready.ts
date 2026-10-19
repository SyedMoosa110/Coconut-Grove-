import { useSyncExternalStore } from "react";

/** Tiny external store: flips to true once the preloader curtain lifts, so hero text can wait for it. */
let ready = false;
const subs = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  subs.forEach((fn) => fn());
}

const subscribe = (fn: () => void) => {
  subs.add(fn);
  return () => { subs.delete(fn); };
};

export function useSiteReady() {
  return useSyncExternalStore(subscribe, () => ready, () => false);
}
