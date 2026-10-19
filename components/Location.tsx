"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FairyCanvas from "./FairyCanvas";
import Magnetic from "./Magnetic";
import SplitText from "./SplitText";
import { Car, Clock, MapPin, Navigation, Phone } from "lucide-react";
import { HOURS, MAPS_QUERY, PHONE_DISPLAY, PHONE_HREF } from "@/lib/data";
import { getStatus } from "@/lib/status";

function StatusBadge() {
  const [s, setS] = useState<ReturnType<typeof getStatus> | null>(null);
  useEffect(() => {
    setS(getStatus());
    const t = setInterval(() => setS(getStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (!s) return <span className="inline-block h-10 w-64" />;
  const c = s.open ? "bg-emerald-400" : "bg-red-400";
  return (
    <span className="glass inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm" role="status">
      <span className="relative flex h-3 w-3">
        <span className={`absolute inline-flex h-full w-full rounded-full ${c} animate-ping2`} />
        <span className={`relative inline-flex h-3 w-3 rounded-full ${c}`} />
      </span>
      {s.label}
    </span>
  );
}

function StyledMap() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/20 bg-forest sm:aspect-[16/10]">
      <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" role="img" aria-label="Stylised map showing Coconut Grove">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#D4AF37" strokeOpacity=".06" /></pattern>
          <radialGradient id="halo"><stop offset="0" stopColor="#D4AF37" stopOpacity=".35" /><stop offset="1" stopColor="#D4AF37" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#grid)" />
        <path d="M-20 340 C180 300 260 380 420 330 S700 250 830 290" stroke="#1D3B2B" strokeWidth="26" fill="none" />
        <path d="M-20 340 C180 300 260 380 420 330 S700 250 830 290" stroke="#D4AF37" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="10 12" fill="none" />
        <path d="M300 -10 C320 150 380 220 420 330 S470 480 450 520" stroke="#1D3B2B" strokeWidth="20" fill="none" />
        <path d="M600 -10 C590 120 640 200 700 255" stroke="#16301F" strokeWidth="14" fill="none" />
        <ellipse cx="150" cy="130" rx="110" ry="70" fill="#123022" /><ellipse cx="660" cy="400" rx="120" ry="60" fill="#123022" />
        <circle cx="400" cy="250" r="150" fill="url(#halo)" />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%]">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center">
          <span className="glass-strong mb-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm">Coconut Grove</span>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-obsidian shadow-[0_0_30px_rgba(212,175,55,0.7)]"><MapPin size={22} /></span>
        </motion.div>
      </div>
    </div>
  );
}

export default function Location() {
  const q = encodeURIComponent(MAPS_QUERY);
  const actions = [
    { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${q}`, icon: Navigation },
    { label: "Uber", href: "https://m.uber.com/", icon: Car },
    { label: "Careem", href: "https://www.careem.com/", icon: Car },
    { label: "Call us", href: PHONE_HREF, icon: Phone },
  ];

  return (
    <section id="visit" className="relative overflow-hidden bg-obsidian py-28 sm:py-36">
      <FairyCanvas density={0.6} embers={0.1} className="opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SplitText text="Find the grove" accent={["grove"]} className="font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.95]" />
          <StatusBadge />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <StyledMap />
          <div className="flex flex-col gap-5">
            <div className="glass gold-border rounded-3xl p-6">
              <p className="flex items-center gap-2 font-display text-2xl"><Clock size={18} className="text-gold" /> Opening hours</p>
              <ul className="mt-4 space-y-3">
                {HOURS.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-cream/70">{h.days}</span><span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {actions.map(({ label, href, icon: Icon }) => (
                <Magnetic key={label} strength={0.15} className="block">
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor={label === "Call us" ? "Call" : "Open"} className="glass gold-border flex items-center justify-center gap-2 rounded-2xl py-4 text-sm transition-colors hover:text-gold">
                    <Icon size={16} />{label}
                  </a>
                </Magnetic>
              ))}
            </div>
            <a href={PHONE_HREF} className="text-sm text-cream/60 hover:text-gold">Reservations and orders: {PHONE_DISPLAY} (calls and WhatsApp)</a>
          </div>
        </div>
      </div>
    </section>
  );
}
