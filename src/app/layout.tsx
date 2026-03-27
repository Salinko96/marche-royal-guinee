import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FacebookPixel from "@/components/tracking/FacebookPixel";
import GoogleAnalytics from "@/components/tracking/GoogleAnalytics";
import ProductJsonLd from "@/components/seo/ProductJsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Données produits pour le JSON-LD (côté serveur)
const productsForSeo = [
  {
    id: 1,
    name: "Montre Richard Mille – Édition Tendance",
    description: "Style luxe inspiré des modèles Richard Mille, idéale pour vos sorties, événements spéciaux et cadeaux marquants. Livraison à Conakry.",
    price: 350000,
    image: "/blanche.jpg",
    images: ["/blanche.jpg", "/vert.jpg", "/noir.jpg", "/rouge.jpg", "/jaune.jpg", "/bleu.jpg"],
    category: "Montres",
  },
  {
    id: 2,
    name: "Montre Cartier – Élégance Classique",
    description: "L'élégance classique inspirée de la maison Cartier pour vos occasions officielles, cérémonies et moments importants. Disponible à Conakry.",
    price: 500000,
    image: "/precious duke.jpg",
    images: ["/precious duke.jpg", "/_ (1).jpeg", "/_ (2).jpeg"],
    category: "Montres",
  },
  {
    id: 3,
    name: "Coque AG Glass Premium",
    description: "Protection premium en verre trempé AG avec finition matte élégante. Résistance aux chocs 9H, anti-traces, design ultra-fin.",
    price: 480000,
    image: "/Luxury Big Window AG Glass Matte.jpeg",
    images: ["/Luxury Big Window AG Glass Matte.jpeg", "/Luxury Big Window AG Glass Matte (1).jpeg"],
    category: "Accessoires Téléphone",
  },
];

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
    "coque AG Glass premium",
    "livraison Conakry",
    "paiement à la livraison Guinée",
  ],
  authors: [{ name: "MARCHÉ ROYAL DE GUINÉE" }],
  icons: {
    icon: "/7437519256192966656.png",
    apple: "/7437519256192966656.png",
  },
  openGraph: {
    title: "MARCHÉ ROYAL DE GUINÉE | Montres & Accessoires Premium",
    description: "Votre boutique en ligne de confiance pour les montres de prestige et accessoires premium en Guinée. Livraison à Conakry.",
    url: "https://marcheroyalguinee.com",
    siteName: "MARCHÉ ROYAL DE GUINÉE",
    type: "website",
    locale: "fr_GN",
    images: [
      {
        url: "https://marcheroyalguinee.com/7437519256192966656.png",
        width: 1200,
        height: 630,
        alt: "MARCHÉ ROYAL DE GUINÉE - Montres et accessoires premium à Conakry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MARCHÉ ROYAL DE GUINÉE | Montres & Accessoires Premium",
    description: "Boutique en ligne premium en Guinée. Montres de luxe et accessoires à Conakry.",
    images: ["https://marcheroyalguinee.com/7437519256192966656.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://marcheroyalguinee.com",
  },
  verification: {
    // Ajoutez vos codes de vérification ici
    // google: "votre-code-google",
    // yandex: "votre-code-yandex",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data pour les rich snippets */}
        <ProductJsonLd products={productsForSeo} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />

        {/* Tracking Scripts (chargés après interaction) */}
        <FacebookPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
