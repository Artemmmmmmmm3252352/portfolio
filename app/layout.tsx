import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"]
});

const accent = Space_Grotesk({
  variable: "--font-accent",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Portfolio Studio",
  description: "Modern products portfolio"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${accent.variable}`}>{children}</body>
    </html>
  );
}
