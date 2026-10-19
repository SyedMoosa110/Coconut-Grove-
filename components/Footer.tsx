import { Facebook, Instagram, Leaf, MessageCircle, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-forest-deep px-5 pb-28 pt-16 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 font-display text-3xl"><Leaf className="text-gold" size={22} /> Coconut Grove</p>
          <p className="mt-4 text-cream/65">Open-air garden dining in Karachi. Charcoal grills, fairy lights and a very good mocktail list.</p>
        </div>
        <div className="space-y-3 text-cream/80">
          <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 hover:text-gold"><Phone size={16} /> {PHONE_DISPLAY}</a>
          <a href={waLink("Hello Coconut Grove!")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><MessageCircle size={16} /> Message us on WhatsApp</a>
        </div>
        <div className="flex gap-3">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="glass grid h-12 w-12 place-items-center rounded-full hover:border-gold hover:text-gold"><Instagram size={18} /></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="glass grid h-12 w-12 place-items-center rounded-full hover:border-gold hover:text-gold"><Facebook size={18} /></a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-sm text-cream/40">© {new Date().getFullYear()} Coconut Grove Karachi. All rights reserved.</p>
    </footer>
  );
}
