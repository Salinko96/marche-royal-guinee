"use client";

import Script from "next/script";

/**
 * Composant Facebook Pixel
 * Ajoute le tracking Facebook pour le suivi des conversions et le retargeting.
 *
 * Utilisation : Ajoutez NEXT_PUBLIC_FB_PIXEL_ID dans vos variables d'environnement.
 *
 * Événements disponibles :
 * - fbq('track', 'ViewContent', { content_name, content_ids, content_type, value, currency })
 * - fbq('track', 'AddToCart', { content_name, content_ids, content_type, value, currency })
 * - fbq('track', 'Purchase', { content_name, content_ids, content_type, value, currency })
 */

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function FacebookPixel() {
  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Fonctions utilitaires pour déclencher les événements Facebook Pixel
export const fbPixelEvent = {
  viewContent: (product: { name: string; id: number; price: number }) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent", {
        content_name: product.name,
        content_ids: [product.id.toString()],
        content_type: "product",
        value: product.price,
        currency: "GNF",
      });
    }
  },

  addToCart: (product: { name: string; id: number; price: number }) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: product.name,
        content_ids: [product.id.toString()],
        content_type: "product",
        value: product.price,
        currency: "GNF",
      });
    }
  },

  purchase: (product: { name: string; id: number; price: number }) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        content_name: product.name,
        content_ids: [product.id.toString()],
        content_type: "product",
        value: product.price,
        currency: "GNF",
      });
    }
  },

  initiateCheckout: (products: { name: string; id: number; price: number }[]) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      const totalValue = products.reduce((sum, p) => sum + p.price, 0);
      (window as any).fbq("track", "InitiateCheckout", {
        content_ids: products.map((p) => p.id.toString()),
        content_type: "product",
        value: totalValue,
        currency: "GNF",
        num_items: products.length,
      });
    }
  },
};
