import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";

export const metadata: Metadata = {
  title: "Coconut Grove Karachi | Tropical Garden Fine Dining",
  description:
    "A serene open-air tropical garden restaurant in Karachi. Fairy-lit cabanas, flame-grilled BBQ, steaks, pan-Asian plates. Reserve a table or order via WhatsApp.",
  openGraph: { title: "Coconut Grove Karachi", description: "A serene tropical dining experience in Karachi.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#07140E", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        <noscript><style>{".cg-preloader{display:none!important}"}</style></noscript>
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
