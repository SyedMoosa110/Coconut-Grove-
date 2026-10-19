import { WHATSAPP_NUMBER, fmt, type Dish } from "./data";

export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export function buildOrderMessage(lines: { dish: Dish; qty: number }[], total: number, name: string, note: string) {
  const items = lines.map((l) => `• ${l.qty} x ${l.dish.name} (${fmt(l.dish.price * l.qty)})`).join("\n");
  return [
    "*New Order: Coconut Grove*",
    name ? `Name: ${name}` : null,
    "",
    items,
    "",
    `*Total: ${fmt(total)}*`,
    note ? `Note: ${note}` : null,
  ].filter((l) => l !== null).join("\n");
}

export interface Booking {
  zone: string; date: string; time: string; guests: number; name: string; notes: string;
}

export function buildReservationMessage(b: Booking) {
  return [
    "*Table Reservation Request: Coconut Grove*",
    `Name: ${b.name}`,
    `Seating: ${b.zone}`,
    `Date: ${b.date}`,
    `Time: ${b.time}`,
    `Guests: ${b.guests}`,
    b.notes ? `Special requests: ${b.notes}` : null,
    "",
    "Please confirm availability. Thank you!",
  ].filter((l) => l !== null).join("\n");
}
