"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Check, MessageCircle, Minus, Plus, RotateCcw, Users } from "lucide-react";
import FairyCanvas from "./FairyCanvas";
import FoodImage from "./FoodImage";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import SlideToUnlock from "./SlideToUnlock";
import SplitText from "./SplitText";
import TiltCard from "./TiltCard";
import { PHONE_DISPLAY, TIME_SLOTS, ZONES, type ZoneId } from "@/lib/data";
import { LUXE } from "@/lib/ease";
import { buildReservationMessage, waLink } from "@/lib/whatsapp";

const STEPS = ["Zone", "When", "Details", "Confirm"] as const;

const karachiToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

const prettyDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

const slotMinutes = (slot: string) => {
  const [time, ap] = slot.split(" ");
  const [h, m] = time.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
};

const karachiNowMinutes = () => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Karachi", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return (get("hour") % 24) * 60 + get("minute");
};

const inputCls = "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 outline-none transition-colors duration-500 placeholder:text-cream/35 focus:border-gold focus:bg-white/[0.08]";

export default function Reservation() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [zone, setZone] = useState<ZoneId | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [today, setToday] = useState("");
  const [sent, setSent] = useState(false);
  const [unlockKey, setUnlockKey] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => { setToday(karachiToday()); }, []);

  const quickDates = useMemo(
    () => (today ? [{ label: "Today", iso: today }, { label: "Tomorrow", iso: addDays(today, 1) }, { label: prettyShort(addDays(today, 2)), iso: addDays(today, 2) }] : []),
    [today],
  );

  const slotDisabled = (slot: string) => date === today && today !== "" && slotMinutes(slot) < karachiNowMinutes() + 30;

  const link = useMemo(
    () => waLink(buildReservationMessage({ zone, date: date ? prettyDate(date) : "", time, guests, name: name.trim(), notes: notes.trim() })),
    [zone, date, time, guests, name, notes],
  );

  const go = (to: number) => { setDir(to > step ? 1 : -1); setStep(to); setError(""); };

  const next = () => {
    if (step === 0 && !zone) return setError("Choose where you would like to sit.");
    if (step === 1) {
      if (!date) return setError("Pick a date.");
      if (!time) return setError("Pick a time.");
    }
    if (step === 2 && name.trim().length < 2) return setError("Please tell us the name for the booking.");
    go(step + 1);
  };

  const unlock = () => {
    const win = window.open(link, "_blank", "noopener");
    if (!win) window.location.href = link; // popup blocked: navigate instead
    setSent(true);
  };

  const reset = () => {
    setSent(false); setStep(0); setDir(-1); setZone(""); setDate(""); setTime(""); setGuests(2); setName(""); setNotes(""); setUnlockKey((k) => k + 1);
  };

  return (
    <section id="reserve" className="relative overflow-hidden bg-gradient-to-b from-obsidian via-forest to-obsidian py-28 sm:py-36">
      <FairyCanvas density={0.9} embers={0.2} className="opacity-70" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.5em] text-gold">VIP reservation</p>
          <SplitText text={"Reserve your\nevening"} accent={["evening"]} className="font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.95]" />
          <Reveal className="mt-6"><p className="mx-auto max-w-md text-cream/65">Four quick steps. We confirm directly on WhatsApp at {PHONE_DISPLAY}.</p></Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="glass-strong gold-border relative overflow-hidden rounded-[2rem] p-5 sm:p-9">
            {/* stepper */}
            <ol className="relative mb-9 flex justify-between" aria-label="Reservation progress">
              <span className="absolute left-5 right-5 top-5 h-px bg-white/10" />
              <motion.span
                className="absolute left-5 top-5 h-px origin-left bg-gold shadow-[0_0_12px_2px_rgba(212,175,55,.7)]"
                style={{ right: "1.25rem" }}
                animate={{ scaleX: step / (STEPS.length - 1) }}
                transition={{ duration: 0.9, ease: LUXE }}
              />
              {STEPS.map((s, i) => {
                const reached = i <= step;
                return (
                  <li key={s} className="relative z-10 flex flex-col items-center gap-2" aria-current={i === step ? "step" : undefined}>
                    <button
                      onClick={() => i < step && go(i)} disabled={i > step} aria-label={`Step ${i + 1}: ${s}`} data-cursor={i < step ? "Edit" : ""}
                      className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold transition-all duration-700 ease-luxe ${
                        reached ? "border-gold bg-gold text-obsidian shadow-[0_0_24px_rgba(212,175,55,.55)]" : "border-white/20 bg-obsidian text-cream/50"
                      }`}
                    >
                      {i < step ? <Check size={16} /> : i + 1}
                    </button>
                    <span className={`text-[11px] uppercase tracking-[0.2em] ${reached ? "text-gold" : "text-cream/40"}`}>{s}</span>
                  </li>
                );
              })}
            </ol>

            <div className="relative min-h-[22rem]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step} custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: 50 * d, filter: "blur(8px)" }),
                    center: { opacity: 1, x: 0, filter: "blur(0px)" },
                    exit: (d: number) => ({ opacity: 0, x: -50 * d, filter: "blur(8px)" }),
                  }}
                  initial="enter" animate="center" exit="exit" transition={{ duration: 0.65, ease: LUXE }}
                >
                  {step === 0 && (
                    <div>
                      <h3 className="font-display text-3xl">Where would you like to sit?</h3>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {ZONES.map((z) => {
                          const active = zone === z.id;
                          return (
                            <TiltCard key={z.id} max={10} className="h-full" onClick={() => { setZone(z.id); setError(""); }} data-cursor="Select" role="radio" aria-checked={active} tabIndex={0}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setZone(z.id); setError(""); } }}>
                              <div data-active={active} className={`gold-border relative h-full overflow-hidden rounded-3xl border transition-colors duration-700 ${active ? "border-gold/70" : "border-white/10"}`}>
                                <div className="relative aspect-[4/5] sm:aspect-[3/4]">
                                  <FoodImage src={z.image} alt={z.id} className="absolute inset-0 h-full w-full object-cover" />
                                  <div className={`absolute inset-0 transition-colors duration-700 ${active ? "bg-gold/15" : "bg-obsidian/30"}`} />
                                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                                  {active && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="tilt-layer absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gold text-obsidian shadow-[0_0_20px_rgba(212,175,55,.7)]"><Check size={16} /></motion.span>
                                  )}
                                  <div className="tilt-layer absolute inset-x-0 bottom-0 p-4">
                                    <p className="font-display text-2xl">{z.id}</p>
                                    <p className="mt-1 text-xs text-cream/70">{z.blurb}</p>
                                  </div>
                                </div>
                              </div>
                            </TiltCard>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-7">
                      <div>
                        <h3 className="flex items-center gap-2 font-display text-3xl"><CalendarDays size={22} className="text-gold" /> Date</h3>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {quickDates.map((q) => (
                            <button key={q.iso} onClick={() => { setDate(q.iso); setTime(""); setError(""); }} aria-pressed={date === q.iso} data-cursor="Pick"
                              className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-500 ease-luxe ${date === q.iso ? "border-gold bg-gold text-obsidian shadow-[0_0_22px_rgba(212,175,55,.45)]" : "border-white/15 hover:border-gold/60 hover:text-gold"}`}>
                              {q.label}
                            </button>
                          ))}
                          <input type="date" aria-label="Choose a date" min={today} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); setError(""); }} className={`${inputCls} !w-auto !py-2.5`} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display text-3xl">Time</h3>
                        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {TIME_SLOTS.map((t) => {
                            const off = slotDisabled(t);
                            return (
                              <button key={t} disabled={off} onClick={() => { setTime(t); setError(""); }} aria-pressed={time === t} data-cursor={off ? "" : "Pick"}
                                className={`rounded-2xl border py-3 text-sm transition-all duration-500 ease-luxe ${
                                  off ? "cursor-not-allowed border-white/5 text-cream/20 line-through" : time === t ? "border-gold bg-gold font-semibold text-obsidian shadow-[0_0_22px_rgba(212,175,55,.45)]" : "border-white/15 hover:border-gold/60 hover:text-gold"
                                }`}>
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <span className="flex items-center gap-2 font-display text-2xl"><Users size={20} className="text-gold" /> Guests</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests" data-cursor="Less" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-gold hover:text-gold"><Minus size={16} /></button>
                          <motion.span key={guests} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 text-center font-display text-3xl tabular-nums" aria-live="polite">{guests}</motion.span>
                          <button onClick={() => setGuests((g) => Math.min(30, g + 1))} aria-label="More guests" data-cursor="More" className="grid h-10 w-10 place-items-center rounded-full bg-gold text-obsidian"><Plus size={16} /></button>
                        </div>
                      </div>
                      {guests > 10 && <p className="text-sm text-gold/90">For parties over 10 we will confirm the best zone with you on WhatsApp.</p>}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <h3 className="font-display text-3xl">Who is the table for?</h3>
                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-cream/55">Name</span>
                        <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Full name" autoComplete="name" className={inputCls} />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-cream/55">Special requests (optional)</span>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Birthday setup, allergies, a quiet corner, high chair…" className={`${inputCls} resize-none`} />
                      </label>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h3 className="font-display text-3xl">{sent ? "Your table request is on its way" : "Review and unlock"}</h3>
                      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        {[
                          ["Zone", zone], ["Guests", `${guests}`], ["Date", date ? prettyDate(date) : ""], ["Time", time], ["Name", name.trim()],
                        ].map(([k, v]) => (
                          <div key={k} className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${k === "Date" ? "col-span-2" : ""}`}>
                            <dt className="text-[10px] uppercase tracking-[0.3em] text-cream/45">{k}</dt>
                            <dd className="mt-1 font-display text-xl text-cream">{v}</dd>
                          </div>
                        ))}
                        {notes.trim() && (
                          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <dt className="text-[10px] uppercase tracking-[0.3em] text-cream/45">Requests</dt>
                            <dd className="mt-1 text-cream/85">{notes.trim()}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-8">
                        <SlideToUnlock key={unlockKey} label="Slide to unlock reservation" doneLabel="Opening WhatsApp" onUnlock={unlock} />
                        <p className="mt-3 text-center text-xs text-cream/45">Opens WhatsApp with your details pre-filled. Press send there to finish.</p>
                      </div>
                      {sent && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gold underline-offset-4 hover:underline"><MessageCircle size={15} /> WhatsApp didn’t open? Tap here</a>
                          <button onClick={reset} className="flex items-center gap-2 text-cream/60 hover:text-gold"><RotateCcw size={14} /> Make another booking</button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 min-h-[1.5rem] text-sm text-red-300" role="alert">{error}</div>

            {step < 3 && (
              <div className="mt-2 flex items-center justify-between">
                {step > 0 ? (
                  <button onClick={() => go(step - 1)} data-cursor="Back" className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm hover:border-gold hover:text-gold"><ArrowLeft size={16} /> Back</button>
                ) : <span />}
                <Magnetic>
                  <button onClick={next} data-cursor="Next" className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-obsidian transition-shadow duration-500 hover:shadow-[0_0_44px_rgba(212,175,55,.6)]">
                    Continue <ArrowRight size={16} />
                  </button>
                </Magnetic>
              </div>
            )}
            {step === 3 && !sent && (
              <div className="mt-2">
                <button onClick={() => go(2)} data-cursor="Back" className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold"><ArrowLeft size={14} /> Edit details</button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function prettyShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
