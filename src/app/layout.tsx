import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import FacebookPixel from "@/components/tracking/FacebookPixel";
import GoogleAnalytics from "@/components/tracking/GoogleAnalytics";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

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
    name: "Montre Style Royal RM – Édition Tendance",
    description: "Montre de style luxe contemporain, idéale pour vos sorties, événements spéciaux et cadeaux marquants. Livraison à Conakry.",
    price: 350000,
    image: "/blanche.jpg",
    images: ["/blanche.jpg", "/vert.jpg", "/noir.jpg", "/rouge.jpg", "/jaune.jpg", "/bleu.jpg"],
    category: "Montres",
  },
  {
    id: 2,
    name: "Montre Élégance Gold – Style Classique",
    description: "Montre de style classique élégant pour vos occasions officielles, cérémonies et moments importants. Disponible à Conakry.",
    price: 500000,
    image: "/precious-duke.jpg",
    images: ["/precious-duke.jpg", "/montre-1.jpeg", "/montre-2.jpeg"],
    category: "Montres",
  },
  {
    id: 3,
    name: "Coque AG Glass Premium",
    description: "Protection premium en verre trempé AG avec finition matte élégante. Résistance aux chocs 9H, anti-traces, design ultra-fin.",
    price: 480000,
    image: "/luxury-glass-matte.jpeg",
    images: ["/luxury-glass-matte.jpeg", "/luxury-glass-matte-2.jpeg"],
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
    "montre style luxe Guinée",
    "montre élégance Conakry",
    "coque AG Glass premium",
    "livraison Conakry",
    "paiement à la livraison Guinée",
  ],
  authors: [{ name: "MARCHÉ ROYAL DE GUINÉE" }],
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
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
        url: "https://marcheroyalguinee.com/og-image.jpg",
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
    images: ["https://marcheroyalguinee.com/og-image.jpg"],
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
        {/* DNS prefetch pour accélérer les ressources tierces */}
        {/* Note: fonts gérées par next/font (auto-hébergées, pas besoin de preconnect) */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* JSON-LD Structured Data pour les rich snippets */}
        <ProductJsonLd products={productsForSeo} />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#B8860B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Marché Royal" />
        <link rel="apple-touch-icon" href="/og-image.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: 'var(--font-geist-sans)' },
          }}
        />

        {/* Tracking Scripts (chargés après interaction) */}
        <FacebookPixel />
        <GoogleAnalytics />
        {/* PWA Service Worker */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
