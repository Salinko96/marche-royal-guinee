/**
 * Composant JSON-LD pour les produits
 * Génère les données structurées Schema.org pour les rich snippets Google.
 *
 * Inclut : Product, Offer, AggregateRating, Organization
 */

interface ProductJsonLdProps {
  products: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    images: string[];
    category: string;
  }[];
  siteUrl?: string;
}

export default function ProductJsonLd({
  products,
  siteUrl = "https://marcheroyalguinee.com"
}: ProductJsonLdProps) {
  // Schema de l'Organisation
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MARCHÉ ROYAL DE GUINÉE",
    url: siteUrl,
    logo: `${siteUrl}/7437519256192966656.png`,
    description: "Boutique en ligne premium de montres et accessoires en Guinée. Livraison à Conakry.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lambanyi",
      addressLocality: "Conakry",
      addressCountry: "GN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+224623457689",
      contactType: "customer service",
      availableLanguage: "French",
    },
    sameAs: [],
  };

  // Schema du Site Web
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MARCHÉ ROYAL DE GUINÉE",
    url: siteUrl,
    description: "Boutique en ligne premium de montres et accessoires en Guinée.",
    inLanguage: "fr-GN",
  };

  // Schema des Produits
  const productSchemas = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => `${siteUrl}${img}`),
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "MARCHÉ ROYAL DE GUINÉE",
    },
    offers: {
      "@type": "Offer",
      url: siteUrl,
      priceCurrency: "GNF",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "MARCHÉ ROYAL DE GUINÉE",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "GN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "3",
      bestRating: "5",
      worstRating: "1",
    },
  }));

  // Schema FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Comment se passe la livraison à Conakry ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nous livrons dans tous les quartiers de Conakry en 24 à 48 heures. Paiement à la livraison disponible.",
        },
      },
      {
        "@type": "Question",
        name: "Comment commander sur WhatsApp ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cliquez sur le bouton Commander sur WhatsApp, notre équipe vous répondra rapidement pour confirmer votre commande.",
        },
      },
      {
        "@type": "Question",
        name: "Quels modes de paiement acceptez-vous ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paiement à la livraison (espèces ou Mobile Money), virement Mobile Money, ou paiement en boutique à Lambanyi.",
        },
      },
    ],
  };

  // LocalBusiness pour le SEO local
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MARCHÉ ROYAL DE GUINÉE",
    image: `${siteUrl}/7437519256192966656.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lambanyi",
      addressLocality: "Conakry",
      addressCountry: "GN",
    },
    telephone: "+224623457689",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    priceRange: "350000-500000 GNF",
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {productSchemas.map((schema, index) => (
        <script
          key={`product-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
