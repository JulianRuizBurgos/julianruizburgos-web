import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import NowListening from "@/components/ui/NowListening";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Julian Ruiz Burgos",
  description:
    "Landscape and wildlife photographer, ecologist, and IT consultant the Netherlands.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} flex min-h-screen flex-col antialiased`}
      >
        <CartProvider>
          {/* Under construction banner — floats below the Now Listening widget */}
          <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center pointer-events-none mb-[64px]">
            <div className="pointer-events-auto mb-2 rounded-full bg-yellow-300/90 backdrop-blur-sm px-4 py-1.5 text-xs text-stone-900 tracking-wide shadow-lg">
              Site under construction — some content is placeholder material.
            </div>
          </div>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <NowListening />
        </CartProvider>
      </body>
    </html>
  );
}
