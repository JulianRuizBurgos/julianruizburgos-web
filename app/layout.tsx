import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import NowListening from "@/components/ui/NowListening";
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
    "Landscape and wildlife photographer, ecologist, and IT consultant based in the UK.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} flex min-h-screen flex-col antialiased`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <NowListening />
      </body>
    </html>
  );
}
