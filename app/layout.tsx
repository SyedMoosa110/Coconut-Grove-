import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";

const display = Cormorant_Garamond({
  subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Coconut Grove Karachi | Tropical Garden Fine Dining",
  description:
    "A serene open-air tropical garden restaurant in Karachi. Fairy-lit cabanas, flame-grilled BBQ, steaks, pan-Asian plates. Reserve a table or order via WhatsApp.",
  openGraph: { title: "Coconut Grove Karachi", description: "A serene tropical dining experience in Karachi.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#0F241A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
