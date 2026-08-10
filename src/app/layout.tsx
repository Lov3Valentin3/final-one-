import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://northpolepenpals.example.com"),
  title: {
    default: "North Pole Pen Pals — Your Child's Magical Elf Pen Pal",
    template: "%s | North Pole Pen Pals",
  },
  description:
    "The magical Christmas app where kids ages 3–12 become pen pals with a real North Pole elf! Letters from the North Pole, Santa letters, elf mail, videos, games, and printable certificates. Safe, parent-controlled Christmas magic.",
  keywords: [
    "Elf Pen Pal",
    "Letters from the North Pole",
    "Santa Letters",
    "Christmas App for Kids",
    "Elf Friend",
    "Santa Pen Pal",
    "Christmas Magic",
    "North Pole Letters",
    "Elf Mail",
    "Santa's Workshop",
  ],
  openGraph: {
    title: "North Pole Pen Pals — Your Child's Magical Elf Pen Pal",
    description:
      "Kids write letters to their very own North Pole elf and get magical personalized replies. Games, videos, certificates & full parent controls.",
    type: "website",
    siteName: "North Pole Pen Pals",
    images: [{ url: "/images/north-pole-hero.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "North Pole Pen Pals — Magical Elf Letters for Kids",
    description:
      "A safe, magical Christmas pen-pal experience: elf letters, videos, games & certificates.",
    images: ["/images/north-pole-hero.jpg"],
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#14532d",
  width: "device-width",
  initialScale: 1,
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "North Pole Pen Pals",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "A magical Christmas pen pal app where children exchange letters with their own North Pole elf.",
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 3,
    suggestedMaxAge: 12,
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "129.99",
    priceCurrency: "USD",
  },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-950 text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}