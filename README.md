# Coconut Grove Karachi

Next.js 14 (App Router) · Tailwind CSS · Framer Motion · GSAP

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Where things live

| Concern | File |
| --- | --- |
| Menu, zones, hours, phone, Instagram, images | `lib/data.ts` |
| WhatsApp message builders | `lib/whatsapp.ts` |
| Magnetic cursor + halo labels (`data-cursor="Label"`, `data-snap`) | `components/CustomCursor.tsx` |
| Fairy-light / ember canvas | `components/FairyCanvas.tsx` |
| 3D tilt + glare | `components/TiltCard.tsx` |
| Staggered clip-path text reveal | `components/SplitText.tsx` |
| Slide-to-unlock CTA | `components/SlideToUnlock.tsx` |
| 4-step reservation | `components/Reservation.tsx` |
| Day/night slider | `components/AmbienceSlider.tsx` |

Add `data-cursor="Your label"` to any element to give the halo a label there.
Items marked `ASSUMED` in `lib/data.ts` (3 dishes, opening hour) were not in the original brief: confirm them.
