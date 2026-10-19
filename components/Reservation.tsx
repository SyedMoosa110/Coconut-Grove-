"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Armchair, Check, Crown, MessageCircle, Minus, Plus, Tent } from "lucide-react";
import FairyLights from "./FairyLights";
import { TIME_SLOTS, ZONES, type ZoneId } from "@/lib/data";
import { buildReservationMessage, waLink } from "@/lib/whatsapp";

const ZONE_ICON = { "Garden Cabana": Tent, "Indoor Dining": Armchair, "Private Lounge": Crown } as const;
const STEPS = ["Seating", "Date and time", "Your details", "Confirm"];

interface Day { iso: string; weekday: string; day: number; month: string; long: string }

function nextDays(n: number): Day[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      weekday: i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
      long: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    };
  });
}

function slotPassed(slot: string) {
  const [t, ap] = slot.split(" ");
  let [h] = t.split(":").map(Number);
  const m = Number(t.split(":")[1]);
  if (ap === "PM" && h !== 12) h += 12;
  const now = new Date();
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}

export default function Reservation() {
  const [step, setStep] = useState(0);
  const [days, setDays] = useState<Day[]>([]);
  const [zone, setZone] = useState<ZoneId | "">("");
  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => setDays(nextDays(14)), []); // client-only: avoids hydration mismatch

  const valid = [zone !== "", time !== "", name.trim().length > 1, true][step];
  const day = days[dayIdx];

  const submit = () => {
    if (!day || !zone) return;
    window.open(waLink(buildReservationMessage({ zone, date: day.long, time, guests, name: name.trim(), notes: notes.trim() })), "_blank", "noopener");
    setSent(true);
  };

  const reset = () => { setStep(0); setZone(""); setTime(""); setName(""); setNotes(""); setGuests(2); setDayIdx(0); setSent(false); };

  return (
    <section id="reserve" className="relative overflow-hidden py-28">
      <FairyLights count={14} seed={3} className="opacity-60" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-[130px]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="font-display text-4xl leading-tight sm:text-6xl">
            Reserve your table in four taps
          </motion.h2>
          <p className="mt-5 max-w-md text-cream/70">
            Pick a seating area, choose a time and we hand your request to our team on WhatsApp. No sign-up needed.
          </p>
        </div>

        <div className="glass-strong rounded-[2rem] p-5 sm:p-8">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-forest"><Check size={30} /></span>
              <h3 className="mt-6 font-display text-3xl">Request ready in WhatsApp</h3>
              <p className="mx-auto mt-3 max-w-sm text-cream/70">Press send in WhatsApp and our team will confirm your table. Nothing is booked until they reply.</p>
              <button onClick={reset} className="mt-8 rounded-full border border-gold/60 px-6 py-3 text-sm hover:bg-gold hover:text-forest">Make another request</button>
            </motion.div>
          ) : (
            <>
              <div className="mb-7">
                <div className="flex justify-between text-xs text-cream/60">
                  {STEPS.map((s, i) => <span key={s} className={i === step ? "text-gold" : ""}>{s}</span>)}
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ type: "spring", stiffness: 160, damping: 22 }} className="h-full rounded-full bg-gold" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="min-h-[21rem]">
                  {step === 0 && (
                    <div className="grid gap-3">
                      {ZONES.map((z) => {
                        const Icon = ZONE_ICON[z.id];
                        const on = zone === z.id;
                        return (
                          <button key={z.id} onClick={() => setZone(z.id)} className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition-colors ${on ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/50"}`}>
                            <img src={z.image} alt="" className="h-20 w-24 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="font-display text-2xl">{z.id}</p>
                              <p className="text-sm text-cream/60">{z.blurb}</p>
                            </div>
                            <Icon className={on ? "text-gold" : "text-cream/40"} />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                        {days.map((d, i) => (
                          <button key={d.iso} onClick={() => { setDayIdx(i); setTime(""); }} className={`shrink-0 rounded-2xl border px-4 py-3 text-center transition-colors ${i === dayIdx ? "border-gold bg-gold text-forest" : "border-white/10 hover:border-gold/50"}`}>
                            <p className="text-xs">{d.weekday}</p>
                            <p className="font-display text-2xl leading-none">{d.day}</p>
                            <p className="text-xs">{d.month}</p>
                          </button>
                        ))}
                      </div>
                      <p className="mb-3 mt-5 text-sm text-cream/60">Available times</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {TIME_SLOTS.map((s) => {
                          const past = dayIdx === 0 && slotPassed(s);
                          return (
                            <button key={s} disabled={past} onClick={() => setTime(s)} className={`rounded-xl border py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${time === s ? "border-gold bg-gold text-forest" : "border-white/10 hover:border-gold/50"}`}>{s}</button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                        <div>
                          <p className="font-medium">Guests</p>
                          <p className="text-sm text-cream/60">{guests > 8 ? "For large groups we suggest the Private Lounge" : "Seats held for 15 minutes"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-gold"><Minus size={16} /></button>
                          <span className="w-6 text-center font-display text-3xl">{guests}</span>
                          <button onClick={() => setGuests((g) => Math.min(30, g + 1))} aria-label="More guests" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-gold"><Plus size={16} /></button>
                        </div>
                      </div>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name for the booking" className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 outline-none placeholder:text-cream/40 focus:border-gold" />
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Special requests: birthday, high chair, quiet corner" className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 outline-none placeholder:text-cream/40 focus:border-gold" />
                    </div>
                  )}

                  {step === 3 && day && (
                    <dl className="divide-y divide-white/10 rounded-2xl border border-white/10">
                      {[["Seating", zone], ["Date", day.long], ["Time", time], ["Guests", String(guests)], ["Name", name], ["Requests", notes || "None"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-6 px-5 py-3.5">
                          <dt className="text-cream/60">{k}</dt>
                          <dd className="text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="rounded-full px-5 py-3 text-sm text-cream/70 hover:text-cream disabled:invisible">Back</button>
                {step < 3 ? (
                  <button onClick={() => setStep((s) => s + 1)} disabled={!valid} className="rounded-full bg-gold px-8 py-3.5 font-semibold text-forest transition-opacity disabled:opacity-35">Continue</button>
                ) : (
                  <button onClick={submit} className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-forest animate-glow"><MessageCircle size={18} /> Reserve via WhatsApp</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
