import { OPEN_HOUR, WEEKEND_NIGHTS } from "./data";

const closeFor = (day: number) => (WEEKEND_NIGHTS.includes(day) ? 2 : 1);

/** Evaluates open/closed in Karachi time regardless of the visitor's timezone. */
export function getStatus(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi", weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const hour = Number(get("hour")) % 24;

  if (hour >= OPEN_HOUR) return { open: true, label: `Open Now · Serving until ${closeFor(day)}:00 AM` };
  const prev = (day + 6) % 7;
  if (hour < closeFor(prev)) return { open: true, label: `Open Now · Serving until ${closeFor(prev)}:00 AM` };
  return { open: false, label: `Closed · Opens at ${OPEN_HOUR}:00 PM` };
}
