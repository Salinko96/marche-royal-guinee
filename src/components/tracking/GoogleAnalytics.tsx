"use client";

import Script from "next/script";

/**
 * Composant Google Analytics 4 (GA4)
 *
 * Utilisation : Ajoutez NEXT_PUBLIC_GA_MEASUREMENT_ID dans vos variables d'environnement.
 * Exemple : NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Fonctions utilitaires pour les événements GA4
export const gaEvent = {
  viewItem: (product: { name: string; id: number; price: number; category: string }) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "view_item", {
        currency: "GNF",
        value: product.price,
        items: [
          {
            item_id: product.id.toString(),
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          },
        ],
      });
    }
  },

  addToCart: (product: { name: string; id: number; price: number; category: string }) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "add_to_cart", {
        currency: "GNF",
        value: product.price,
        items: [
          {
            item_id: product.id.toString(),
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          },
        ],
      });
    }
  },

  // Événement personnalisé pour les commandes WhatsApp
  purchaseWhatsApp: (product: { name: string; id: number; price: number; category: string }) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "purchase", {
        currency: "GNF",
        value: product.price,
        transaction_id: `wa_${Date.now()}`,
        items: [
          {
            item_id: product.id.toString(),
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          },
        ],
      });
    }
  },

  // Suivi des clics WhatsApp
  whatsappClick: (productName: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: productName,
      });
    }
  },

  // Suivi du formulaire de contact
  contactFormSubmit: () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        event_category: "engagement",
        event_label: "contact_form",
      });
    }
  },
};
