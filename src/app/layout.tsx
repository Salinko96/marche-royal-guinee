import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MARCHÉ ROYAL DE GUINÉE | Montres & Accessoires Premium à Conakry",
  description: "Boutique en ligne premium en Guinée. Découvrez notre collection exclusive de montres de luxe et accessoires pour téléphone. Livraison à Conakry, paiement à la livraison. Qualité garantie.",
  keywords: [
    "montres Guinée", 
    "achat montre Conakry", 
    "coque téléphone Guinée", 
    "boutique en ligne Guinée",
    "montre luxe Guinée",
    "accessoires téléphone Conakry",
    "MARCHÉ ROYAL DE GUINÉE",
    "montre Richard Mille Guinée",
    "montre Cartier Conakry",
    "coque AG Glass premium"
  ],
  authors: [{ name: "MARCHÉ ROYAL DE GUINÉE" }],
  icons: {
    icon: "/7437519256192966656.png",
  },
  openGraph: {
    title: "MARCHÉ ROYAL DE GUINÉE | Montres & Accessoires Premium",
    description: "Votre boutique en ligne de confiance pour les montres de prestige et accessoires premium en Guinée. Livraison à Conakry.",
    url: "https://marcheroyalguinee.com",
    siteName: "MARCHÉ ROYAL DE GUINÉE",
    type: "website",
    locale: "fr_GN",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARCHÉ ROYAL DE GUINÉE | Montres & Accessoires Premium",
    description: "Boutique en ligne premium en Guinée. Montres de luxe et accessoires à Conakry.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <Script 
          src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
          strategy="afterInteractive"
          async
          defer
        />
      </body>
    </html>
  );
}
