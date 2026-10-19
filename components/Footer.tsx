import { Instagram, Leaf, MessageCircle, Phone } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-obsidian px-5 pb-28 pt-20 sm:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/[0.06] to-transparent" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 font-display text-4xl"><Leaf className="text-gold" size={24} /> Coconut Grove</p>
          <p className="mt-4 text-cream/65">Open-air garden dining in Karachi. Charcoal grills, fairy lights and a very good mocktail list.</p>
        </div>
        <div className="space-y-4 text-cream/80">
          <a href={PHONE_HREF} data-cursor="Call" className="flex items-center gap-3 transition-colors hover:text-gold"><Phone size={16} /> {PHONE_DISPLAY}</a>
          <a href={waLink("Hello Coconut Grove!")} target="_blank" rel="noopener noreferrer" data-cursor="Chat" className="flex items-center gap-3 transition-colors hover:text-gold"><MessageCircle size={16} /> Message us on WhatsApp</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-cursor="Follow" className="flex items-center gap-3 transition-colors hover:text-gold"><Instagram size={16} /> {INSTAGRAM_HANDLE}</a>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Coconut Grove on Instagram" data-cursor="Follow" data-snap className="glass gold-border grid h-14 w-14 place-items-center rounded-full transition-colors hover:text-gold">
          <Instagram size={20} />
        </a>
      </div>
      <p className="relative mx-auto mt-14 max-w-6xl text-sm text-cream/40">© {new Date().getFullYear()} Coconut Grove Karachi. All rights reserved.</p>
    </footer>
  );
}
