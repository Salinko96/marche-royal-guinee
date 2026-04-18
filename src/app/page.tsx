"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  X,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Shield,
  Truck,
  Star,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { CartButton, CartPanel } from "@/components/cart/MiniCart";
import NewsletterForm from "@/components/NewsletterForm";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { fbPixelEvent } from "@/components/tracking/FacebookPixel";
import { gaEvent } from "@/components/tracking/GoogleAnalytics";
import { toast } from "sonner";

/* ============================================
   MARCHÉ ROYAL DE GUINÉE
   Boutique en ligne de montres et accessoires
   ============================================ */

// ============================================
// Types & Data
// ============================================

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  longDescription: string;
  characteristics: string[];
  highlights: string[];
  image: string;
  images: string[];
  compatibility?: string[];
  isRealPhoto?: boolean;
  badge?: string;
  isNew?: boolean;
  stockQuantity?: number;
  inStock?: boolean;
  variants?: { name: string; options: { label: string; extraPrice: number }[] }[];
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

// ============================================
// Transformation d'un produit DB → Product UI
// ============================================
function dbToProduct(p: any): Product {
  let characteristics: string[] = [];
  let highlights: string[] = [];
  let images: string[] = [];
  let compatibility: string[] | undefined;
  let variants: { name: string; options: { label: string; extraPrice: number }[] }[] | undefined;
  try { const obj = JSON.parse(p.characteristics || '[]'); characteristics = Array.isArray(obj) ? obj : Object.values(obj); } catch {}
  try { highlights = JSON.parse(p.highlights || '[]'); } catch {}
  try { images = JSON.parse(p.images || '[]'); } catch {}
  try { if (p.compatibility) compatibility = JSON.parse(p.compatibility); } catch {}
  try { if (p.variants) variants = JSON.parse(p.variants); } catch {}
  if (p.image && !images.includes(p.image)) images = [p.image, ...images];
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    characteristics,
    highlights,
    image: images[0] || p.image || '',
    images,
    compatibility,
    isRealPhoto: p.isRealPhoto ?? false,
    badge: p.badge ?? undefined,
    isNew: p.isNew ?? false,
    stockQuantity: p.stockQuantity ?? undefined,
    inStock: p.inStock ?? true,
    variants: variants && variants.length > 0 ? variants : undefined,
  };
}

// Produits de démonstration affichés pendant le chargement
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Montre Style Royal RM – Édition Tendance",
    category: "Montres",
    price: 350000,
    originalPrice: 480000,
    isRealPhoto: true,
    badge: "Best-seller",
    isNew: false,
    stockQuantity: 15,
    inStock: true,
    shortDescription: "Montre de style luxe contemporain, idéale pour vos sorties, événements spéciaux et cadeaux marquants.",
    longDescription: `La Montre Style Royal RM – Édition Tendance incarne l'excellence horlogère rendue accessible au plus grand nombre en Guinée. Son design audacieux aux formes géométriques pures et son cadran sophistiqué avec détails raffinés en font l'accessoire parfait pour ceux qui souhaitent affirmer leur style avec confiance et originalité.

Cette montre tendance accompagne toutes vos occasions importantes : sorties entre amis à Conakry, soirées VIP, événements familiaux ou rencontres professionnelles décontractées. Elle constitue également un cadeau mémorable pour un proche qui mérite une attention spéciale. Son design unique capture l'essence du luxe contemporain tout en restant parfaitement portable au quotidien.

Conçue pour durer, cette montre allie robustesse et raffinement dans un équilibre remarquable. Son mécanisme de précision garantit une fiabilité absolue au fil des heures, tandis que son design audacieux traverse les modes sans jamais se démoder. Disponible exclusivement chez MARCHÉ ROYAL DE GUINÉE, avec livraison rapide à Conakry.

Cette pièce représente bien plus qu'une simple montre : c'est un véritable statement de style pour l'homme ou la femme moderne de Conakry qui refuse la banalité. Son allure premium attire les regards et suscite les compliments, vous distinguant naturellement dans toute occasion.`,
    characteristics: [
      "Boîtier en alliage de haute qualité avec finitions luxueuses",
      "Verre minéral résistant aux rayures et aux impacts quotidiens",
      "Mouvement quartz précis pour une fiabilité à toute épreuve",
      "Bracelet en silicone confortable, ajustable et durable",
      "Étanchéité quotidienne (3 ATM) – résiste aux éclaboussures",
      "Style unisexe moderne – parfaite pour homme et femme",
      "Couleur dominante : noir/luxe avec accents métallisés",
      "Usage idéal : sorties, événements, cadeaux, style quotidien",
    ],
    highlights: [
      "Design exclusif inspiré des grandes maisons horlogères mondiales, sans le prix exorbitant",
      "Parfaite pour impressionner lors de vos soirées et événements à Conakry",
      "Idéale comme cadeau prestige pour un proche (anniversaire, réussite, mariage)",
      "Style unisexe qui convient aussi bien aux hommes qu'aux femmes modernes",
      "Disponible immédiatement à Conakry – pas d'attente ni d'importation",
      "Paiement à la livraison possible – zéro risque pour vous",
    ],
    image: "/blanche.jpg",
    images: [
      "/blanche.jpg",
      "/vert.jpg", 
      "/rouge-jaune-vert-noir.jpg",
      "/noir.jpg",
      "/rouge.jpg",
      "/jaune.jpg",
      "/bleu.jpg",
      "/belle-vue-bleu.jpg"
    ],
  },
  {
    id: "2",
    name: "Montre Élégance Gold – Style Classique",
    category: "Montres",
    price: 500000,
    isRealPhoto: true,
    badge: "Sélection premium",
    isNew: true,
    stockQuantity: 8,
    inStock: true,
    shortDescription: "Montre de style classique élégant pour vos occasions officielles, cérémonies et moments importants. Disponible à Conakry.",
    longDescription: `La Montre Élégance Gold représente le summum du raffinement et de la sophistication horlogère. Son design classique intemporel aux lignes harmonieuses en fait le compagnon idéal des hommes et femmes d'affaires de Conakry qui comprennent que l'allure est le premier message que l'on adresse au monde.

Cette pièce d'exception est façonnée pour ceux qui apprécient les valeurs sûres de l'horlogerie classique. Son cadran raffiné avec aiguilles élégantes et index précis témoigne d'un savoir-faire artisanal remarquable. Que ce soit pour un mariage, une réunion d'affaires importante, une cérémonie officielle ou simplement pour affirmer votre statut avec discrétion.

Offrir cette montre, c'est offrir bien plus qu'un simple accessoire : c'est transmettre un symbole de réussite, de bon goût et d'ambition. Son allure distinguée séduira instantanément les amateurs de belles pièces horlogères qui reconnaissent la qualité au premier regard.

Disponible à Lambanyi, Conakry, avec la garantie de qualité MARCHÉ ROYAL DE GUINÉE. Elle accompagne les moments importants de votre vie avec une présence à la fois discrète et marquante.`,
    characteristics: [
      "Boîtier en acier inoxydable poli miroir – finitions premium",
      "Verre saphir anti-reflet pour une lisibilité parfaite",
      "Mouvement automatique de précision – pas besoin de pile",
      "Bracelet cuir véritable de qualité supérieure",
      "Boucle déployante sécurisée – confort et élégance",
      "Résistance à l'eau (5 ATM) – usage quotidien serein",
      "Finitions main luxe avec attention aux détails",
      "Usage idéal : affaires, cérémonies, cadeaux prestige, occasions officielles",
    ],
    highlights: [
      "Parfaite pour les réunions d'affaires et occasions professionnelles à Conakry",
      "Idéale pour cérémonies : mariages, baptêmes, remises de prix, réceptions officielles",
      "Cadeau prestige exceptionnel pour marquer un moment important de la vie",
      "Design classique intemporel qui ne se démode jamais",
      "Qualité supérieure garantie par notre sélection rigoureuse",
      "Livraison express à Conakry avec paiement à la livraison possible",
    ],
    image: "/precious-duke.jpg",
    images: [
      "/precious-duke.jpg", 
      "/montre-1.jpeg", 
      "/montre-2.jpeg",
      "/montre-6.jpeg",
      "/montre-8.jpeg",
      "/montre-9.jpeg",
      "/_.jpeg",
      "/7437519256192966656.jpg"
    ],
  },
  {
    id: "3",
    name: "Coque AG Glass Premium",
    category: "Accessoires Téléphone",
    price: 480000,
    isRealPhoto: true,
    stockQuantity: 25,
    inStock: true,
    shortDescription: "Protection premium en verre trempé AG avec finition matte élégante. Résistance aux chocs, anti-traces et design ultra-fin.",
    longDescription: `La Coque AG Glass Premium offre une protection exceptionnelle pour votre smartphone tout en préservant son élégance naturelle et sa prise en main confortable. Conçue avec les dernières technologies de verre trempé renforcé de qualité 9H, cette coque combine une résistance aux chocs hors pair avec une esthétique raffinée. Son design ultra-fin de seulement 0.3mm s'adapte parfaitement à la forme de votre téléphone sans ajouter de volume inutile ni compromettre son ergonomie.

Cette coque de protection haut de gamme intègre une technologie AG (Anti-Glare) avancée qui réduit significativement les reflets gênants et les traces de doigts. Votre écran reste parfaitement lisible en toutes circonstances, même sous le soleil intense de Conakry. La finition matte luxueuse apporte une touche de sophistication moderne à votre appareil, le distinguant nettement des coques ordinaires que l'on trouve partout ailleurs sur le marché local.

Fabriquée avec des matériaux de première qualité sélectionnés avec soin, la Coque AG Glass Premium résiste aux chutes accidentelles, aux rayures quotidiennes et aux impacts du transport. Son système d'absorption des chocs révolutionnaire protège efficacement les angles vulnérables et le dos de votre téléphone contre les dommages. L'installation se fait en quelques secondes, sans bulles d'air, pour un résultat professionnel dès le premier essai.

Vivez votre vie active à Conakry avec la tranquillité d'esprit totale, sachant que votre précieux smartphone est protégé par le meilleur des accessoires disponibles en Guinée. Cette coque n'est pas qu'une simple protection : c'est un investissement dans la longévité de votre téléphone et la préservation de sa valeur.`,
    characteristics: [
      "Verre trempé AG renforcé 9H – la meilleure protection disponible",
      "Protection anti-chocs avancée – absorbe les impacts efficacement",
      "Finition matte anti-traces – pas de traces de doigts visibles",
      "Ultra-fin : 0.3mm d'épaisseur – préserve la finesse de votre téléphone",
      "Installation sans bulles – application facile et rapide",
      "Toucher naturel préservé – sensation fluide et réactive",
      "Bords arrondis confortables – agréable au toucher",
      "Design élégant et professionnel – adapté à tous les environnements",
    ],
    highlights: [
      "Protection maximale contre les chutes et rayures du quotidien à Conakry",
      "Design élégant et professionnel qui met en valeur votre téléphone",
      "Compatibilité universelle – nous avons sûrement le modèle pour votre téléphone",
      "Rapport qualité-prix exceptionnel comparé aux réparations d'écran",
      "Finition matte qui reste propre et élégante toute la journée",
      "Idéal pour la vie active – transport, travail, sorties à Conakry",
    ],
    image: "/luxury-glass-matte.jpeg",
    images: ["/luxury-glass-matte.jpeg", "/luxury-glass-matte-2.jpeg", "/f9d01d82-379f-42b7-9d7b-49ea74dbe43e.jpg"],
    compatibility: [
      "iPhone : modèles 13, 14, 15, 16 (toutes versions)",
      "Samsung Galaxy : S21, S22, S23, S24 (toutes versions)",
      "Samsung Galaxy : Série A (A50, A51, A52, A53, etc.)",
      "Xiaomi : Redmi Note series (Note 10, 11, 12, 13, etc.)",
      "Huawei : Série P et Mate",
      "Oppo : Série Reno et A",
      "Et bien d'autres modèles – contactez-nous !",
    ],
  },
];

// Testimonials Data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mamadou S.",
    location: "Kaloum, Conakry",
    text: "J'ai commandé une montre de luxe pour mon frère. La qualité est exceptionnelle et la livraison a été rapide. Je recommande vivement MARCHÉ ROYAL DE GUINÉE !",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatou D.",
    location: "Dixinn, Conakry",
    text: "Service client au top ! J'ai eu un problème avec ma commande et ils ont été très réactifs sur WhatsApp. Ma montre est magnifique, merci infiniment.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ibrahima K.",
    location: "Ratoma, Conakry",
    text: "Enfin une boutique fiable en Guinée ! Les produits sont de qualité et le paiement à la livraison m'a rassuré. Je suis devenu un client fidèle.",
    rating: 5,
  },
];

// FAQ Data - Questions optimisées pour le marché guinéen
const faqData = [
  {
    question: "Comment se passe la livraison à Conakry et dans les environs ?",
    answer: "Nous livrons personnellement vos commandes dans tous les quartiers de Conakry (Kaloum, Dixinn, Ratoma, Matam, Matoto, Lambanyi, etc.) ainsi que dans les communes environnantes comme Coyah et Dubréka. Notre équipe de livreurs dédiée vous contacte par téléphone pour convenir d'un créneau horaire qui vous arrange. Vous n'avez pas à vous déplacer : nous venons jusqu'à vous, que ce soit à votre domicile, votre bureau ou tout autre lieu de votre choix à Conakry.",
  },
  {
    question: "Quels sont les frais de livraison ?",
    answer: "Les frais de livraison dépendent de votre zone géographique. Pour Conakry intra-muros, la livraison est généralement offerte à partir d'un certain montant d'achat, sinon des frais modérés s'appliquent. Pour les environs proches, des frais supplémentaires raisonnables peuvent être ajoutés. Nous vous communiquons toujours le montant exact avant confirmation de votre commande, sans surprise ni frais cachés. Notre objectif est de vous offrir le meilleur rapport qualité-prix.",
  },
  {
    question: "Quels sont les délais moyens de livraison ?",
    answer: "Pour Conakry, comptez entre 24 et 48 heures ouvrées après confirmation de votre commande. Nous livrons du lundi au samedi, de 8h à 20h. Si vous avez une urgence (cadeau de dernière minute, départ en voyage), nous proposons un service de livraison express le jour même selon disponibilité. Pour les villes de l'intérieur du pays, le délai est de 3 à 5 jours via nos partenaires de transport fiables. Nous vous tiendrons informé de l'avancement de votre livraison par SMS ou WhatsApp.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous offrons plusieurs options de paiement flexibles pour vous faciliter la vie. Le paiement à la livraison est notre option la plus populaire : vous payez en espèces ou par Mobile Money (Orange Money, MTN Mobile Money) au moment où vous recevez votre produit. Vous pouvez également effectuer un virement Mobile Money avant la livraison si vous préférez. Enfin, vous pouvez passer directement à notre boutique de Lambanyi pour payer en espèces. Nous nous adaptons à vos préférences pour que votre achat se passe sans stress.",
  },
  {
    question: "Comment passer commande via WhatsApp ?",
    answer: "C'est très simple et rapide ! Cliquez sur le bouton vert « Commander sur WhatsApp » présent sur chaque fiche produit ou en bas de page. Vous serez automatiquement redirigé vers notre WhatsApp avec un message pré-rempli. Notre équipe vous répondra en quelques minutes (pendant les heures d'ouverture) pour confirmer la disponibilité du produit, prendre vos coordonnées de livraison et convenir du mode de paiement. Tout se passe en conversation, sans formulaire compliqué à remplir.",
  },
  {
    question: "Les produits sont-ils réellement disponibles en stock en Guinée ?",
    answer: "Oui, absolument ! Contrairement à beaucoup de sites qui font venir les produits de l'étranger après votre commande, nos produits sont physiquement disponibles à Conakry. Cela signifie que vous pouvez recevoir votre achat très rapidement, sans attendre des semaines d'expédition internationale. Avant de confirmer votre commande, nous vérifions systématiquement la disponibilité en stock pour éviter toute déception. Dans le rare cas où un produit serait temporairement indisponible, nous vous en informons immédiatement et vous proposons une alternative ou un délai estimé.",
  },
  {
    question: "Puis-je échanger un produit s'il ne me convient pas ?",
    answer: "Bien sûr ! Votre satisfaction est notre priorité absolue. Si le produit reçu ne correspond pas à votre commande ou présente un défaut, vous avez 7 jours pour nous le signaler par WhatsApp et effectuer un échange. Pour Conakry, nous pouvons même venir récupérer le produit chez vous. Les produits doivent être retournés dans leur état original, non utilisés et dans leur emballage d'origine. Notre politique d'échange est simple et sans tracas car nous voulons que vous soyez pleinement satisfait de votre achat.",
  },
  {
    question: "Comment garantissez-vous la qualité des montres et coques ?",
    answer: "Nous sélectionnons personnellement chaque produit que nous proposons, en privilégiant la qualité et la durabilité. Nos montres proviennent de fournisseurs vérifiés et chaque pièce est contrôlée avant mise en vente. Toutes nos montres bénéficient d'une garantie de 30 jours contre les défauts de fabrication. Pour les coques de téléphone, nous choisissons uniquement des matériaux premium (verre trempé AG, protection renforcée) qui offrent une vraie protection. Nous préférons proposer moins de références mais de meilleure qualité plutôt que d'inonder le marché avec des produits médiocres.",
  },
  {
    question: "Est-ce que je peux commander depuis l'intérieur du pays ?",
    answer: "Oui, nous livrons dans les principales villes de Guinée : Kankan, N'Zérékoré, Labé, Kindia, Boké, Siguiri, Kissidougou et bien d'autres. Les commandes sont expédiées via nos partenaires de transport routier fiables et sécurisés. Le délai de livraison est de 3 à 5 jours ouvrées selon la destination. Des frais de livraison supplémentaires s'appliquent pour couvrir les coûts de transport, mais nous restons très compétitifs. Contactez-nous par WhatsApp pour obtenir un devis précis selon votre ville.",
  },
  {
    question: "Que faire si j'ai un problème avec ma commande ?",
    answer: "Ne paniquez pas, nous sommes là pour vous ! Contactez-nous immédiatement par WhatsApp ou téléphone en expliquant votre situation. Que ce soit un retard de livraison, une erreur sur le produit reçu, ou un défaut constaté après ouverture, notre équipe réagira rapidement pour trouver une solution. Pour les clients de Conakry, nous pouvons intervenir le jour même dans la plupart des cas. Notre engagement est simple : nous ne vous laissons jamais dans l'embarras. Chaque client mérite un service irréprochable avant, pendant et après son achat.",
  },
];

// Categories (calculées dynamiquement dans le composant)

// WhatsApp link generator
const generateWhatsAppLink = (productName: string): string => {
  const message = encodeURIComponent(`Bonjour, je souhaite commander : ${productName}`);
  return `https://wa.me/224623457689?text=${message}`;
};

// Format price in GNF
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-GN').format(price) + ' GNF';
};

// ============================================
// Préchargement des images pour vitesse max
// ============================================
const preloadImage = (src: string) => {
  if (typeof window !== 'undefined') {
    const img = new window.Image();
    img.src = src;
  }
};

// ============================================
// Composant ReviewsSection — avis avec dates
// ============================================
function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<{ id: string; customerName: string; rating: number; comment: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSubmitted(false);
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.ok ? r.json() : { reviews: [] })
      .then(data => { setReviews(data.reviews || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async () => {
    if (!form.customerName.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...form }),
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ customerName: '', rating: 5, comment: '' });
    } catch {}
    setSubmitting(false);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fr-GN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return ''; }
  };

  if (loading) return null;

  return (
    <div className="border-t pt-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">
          Avis clients {reviews.length > 0 && <span className="text-gray-400 font-normal text-sm">({reviews.length})</span>}
        </h4>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-[#B8860B] hover:underline font-medium"
          >
            + Laisser un avis
          </button>
        )}
      </div>

      {submitted && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          Merci ! Votre avis est en attente de validation.
        </p>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Votre prénom ou nom"
            value={form.customerName}
            onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Note :</span>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                <Star className={`h-5 w-5 ${n <= form.rating ? 'fill-[#D4A418] text-[#D4A418]' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            rows={3}
            placeholder="Décrivez votre expérience..."
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-[#B8860B] hover:bg-[#9A7209] text-white text-sm font-medium py-2 rounded-lg disabled:opacity-60"
            >
              {submitting ? 'Envoi...' : 'Envoyer mon avis'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">
              Annuler
            </button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Aucun avis pour ce produit. Soyez le premier !</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{r.customerName}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`h-3 w-3 ${n <= r.rating ? 'fill-[#D4A418] text-[#D4A418]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Skeleton card — affiché pendant le chargement
// ============================================
function ProductSkeleton() {
  return (
    <div className="rounded-2xl border-0 shadow-lg overflow-hidden bg-white animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-7 bg-gray-200 rounded w-1/2 mt-2" />
        <div className="flex gap-2 pt-1">
          <div className="h-10 bg-gray-200 rounded flex-1" />
          <div className="h-10 w-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Composant ProductCard optimisé avec memo
// ============================================
const ProductCard = memo(function ProductCard({
  product,
  onSelect,
  onHover,
  onQuickBuy,
  priority,
}: {
  product: Product;
  onSelect: (product: Product) => void;
  onHover: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  priority?: boolean;
}) {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stockLabel = product.inStock === false
    ? { text: 'Rupture de stock', cls: 'bg-red-100 text-red-700' }
    : product.stockQuantity !== undefined && product.stockQuantity <= 5
    ? { text: `Plus que ${product.stockQuantity} en stock`, cls: 'bg-orange-100 text-orange-700' }
    : product.stockQuantity !== undefined && product.stockQuantity <= 15
    ? { text: 'Stock faible', cls: 'bg-yellow-100 text-yellow-700' }
    : { text: 'En stock', cls: 'bg-green-100 text-green-700' };

  return (
    <Card
      className="premium-card border-0 shadow-lg overflow-hidden bg-white cursor-pointer group"
      onClick={() => onSelect(product)}
      onMouseEnter={() => onHover(product)}
      role="article"
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      {/* Product Image */}
      <div className="product-image-container aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
        <Image
          src={product.image}
          alt={`${product.name} - ${product.category} disponible chez MARCHÉ ROYAL DE GUINÉE à Conakry`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority ?? false}
        />
        {/* Badges superposés */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Nouveau
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge && !product.isNew && (
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        {/* Photo réelle */}
        {product.isRealPhoto && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-green-600/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="h-2.5 w-2.5" /> Photo réelle
            </span>
          </div>
        )}
        {/* Bouton Achat Rapide (overlay) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Button
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#B8860B] hover:bg-[#FFF9E6] shadow-xl transform translate-y-4 group-hover:translate-y-0"
            onClick={(e) => {
              e.stopPropagation();
              onQuickBuy(product);
            }}
            aria-label={`Achat rapide : ${product.name}`}
          >
            <Zap className="mr-2 h-4 w-4" />
            Achat rapide
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {product.shortDescription}
        </p>
        {/* Notation étoilée */}
        <div className="flex items-center gap-1 mb-2" aria-label="Note : 5 sur 5 étoiles">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[#D4A418] text-[#D4A418]" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(5.0)</span>
        </div>
        {/* Prix + prix barré */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="text-2xl font-bold text-[#B8860B] price-tag">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
        {/* Indicateur de stock */}
        <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${stockLabel.cls}`}>
          {stockLabel.text}
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          className="flex-1 bg-gold-gradient text-white hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
        >
          Voir le produit
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-green-500 text-green-500 hover:bg-green-50"
          onClick={(e) => {
            e.stopPropagation();
            // Tracking
            fbPixelEvent.purchase(product);
            gaEvent.whatsappClick(product.name);
            window.open(generateWhatsAppLink(product.name), '_blank');
          }}
          aria-label={`Commander ${product.name} sur WhatsApp`}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
});

// ============================================
// Main Component
// ============================================

export default function MarcheRoyalGuinee() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [variantError, setVariantError] = useState('');

  // ---- Produits dynamiques depuis la DB ----
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  // Lazy rendering de la section vidéo (below the fold)
  const [showVideos, setShowVideos] = useState(false);
  const videoSectionRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShowVideos(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(node);
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(dbToProduct);
          setProducts(mapped);
          mapped.forEach((p: Product) => preloadImage(p.image));
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setProductsLoading(false));
  }, []);

  // Zustand stores
  const addToCart = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const customer = useAuthStore(state => state.customer);

  // ── Récupération panier abandonné ────────────────────────────────────────
  // Si le visiteur a des articles dans le panier et quitte sans commander,
  // affiche un toast de rappel à son retour.
  useEffect(() => {
    if (cartItems.length === 0) return;
    const key = 'mrg_cart_reminder_shown';
    const alreadyShown = sessionStorage.getItem(key);
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(key, '1');
      toast('🛒 Vous avez des articles dans votre panier !', {
        description: 'Finalisez votre commande avant qu\'il soit trop tard.',
        duration: 10000,
        action: {
          label: 'Commander',
          onClick: () => { window.location.href = '/checkout'; },
        },
      });
    }, 45000); // 45s après chargement de la page

    return () => clearTimeout(timer);
  }, [cartItems.length]);

  // Catégories calculées depuis les produits chargés
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ["Tous", ...cats];
  }, [products]);

  // Mémoriser les produits filtrés pour éviter les recalculs
  const filteredProducts = useMemo(() => {
    return activeCategory === "Tous"
      ? products
      : products.filter((p: Product) => p.category === activeCategory);
  }, [activeCategory, products]);

  // Callback optimisé pour sélectionner un produit
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setSelectedVariants({});
    setVariantError('');
    setIsModalOpen(true);
    // Tracking : ViewContent
    fbPixelEvent.viewContent(product);
    gaEvent.viewItem(product);
  }, []);

  // Callback pour fermer le modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setActiveImageIndex(0);
  }, []);

  // Achat rapide : ouvre un modal sans quitter la page
  const handleQuickBuy = useCallback((product: Product) => {
    setQuickBuyProduct(product);
    setIsQuickBuyOpen(true);
    // Tracking
    fbPixelEvent.addToCart(product);
    gaEvent.addToCart(product);
  }, []);

  // Ajouter au panier
  const handleAddToCart = useCallback((product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    // Tracking
    fbPixelEvent.addToCart(product);
    gaEvent.addToCart(product);
  }, [addToCart]);

  // Envoi du formulaire de contact
  const handleContactSubmit = useCallback(async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', phone: '', message: '' });
        gaEvent.contactFormSubmit();
      } else {
        setContactStatus('error');
      }
    } catch {
      setContactStatus('error');
    }
  }, [contactForm]);

  // Précharger les images du produit quand on survole la carte
  const handleProductHover = useCallback((product: Product) => {
    product.images.forEach(img => preloadImage(img));
  }, []);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Précharger uniquement les images principales des fallback (pas la galerie complète)
  useEffect(() => {
    FALLBACK_PRODUCTS.forEach(product => preloadImage(product.image));
  }, []);

  // Scroll to section - mémorisé
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ============================================
          HEADER / NAVIGATION
          ============================================ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left"
              >
                <Image
                  src="/logo-royal.png"
                  alt="Royal Marché de Guinée"
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
                <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                  Vos montres et accessoires livrés à Conakry, en toute simplicité.
                </p>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('boutique')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                Boutique
              </button>
              <a
                href="/produits"
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                Catalogue
              </a>
              <button
                onClick={() => scrollToSection('apropos')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                À propos
              </button>
              <a
                href="/contact"
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                Contact
              </a>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                FAQ
              </button>
              <a
                href="/suivi"
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                Suivi commande
              </a>
              <a
                href={customer ? "/compte" : "/connexion"}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium flex items-center gap-1"
              >
                {customer ? `👤 ${customer.name.split(' ')[0]}` : "Mon Compte"}
              </a>
            </nav>

            {/* CTA Button + Cart */}
            <div className="hidden md:flex items-center gap-3">
              <CartButton />
              <Button
                onClick={() => scrollToSection('produits')}
                className="bg-gold-gradient text-white hover:opacity-90 shadow-lg"
              >
                Commander maintenant
              </Button>
            </div>

            {/* Mobile: Cart + Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <CartButton />
              <button
                className="p-2 text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('boutique')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                Boutique
              </button>
              <a
                href="/produits"
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                Catalogue
              </a>
              <button
                onClick={() => scrollToSection('apropos')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                À propos
              </button>
              <a
                href="/contact"
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                Contact
              </a>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                FAQ
              </button>
              <a
                href="/suivi"
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                Suivi commande
              </a>
              <a
                href={customer ? "/compte" : "/connexion"}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                {customer ? `👤 ${customer.name.split(' ')[0]}` : "Mon Compte"}
              </a>
              <Button
                onClick={() => scrollToSection('produits')}
                className="bg-gold-gradient text-white w-full"
              >
                Commander maintenant
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center hero-pattern pt-20"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4A418]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-[#FFF9E6] text-[#B8860B] border border-[#D4A418]/30 px-4 py-1.5">
              🇬🇳 Boutique en ligne premium en Guinée
            </Badge>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Vos montres de luxe et accessoires,{" "}
              <span className="text-gold-gradient">livrés à Conakry</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Découvrez notre collection exclusive de montres tendance et d'accessoires premium. 
              Qualité exceptionnelle, style raffiné, disponible immédiatement en Guinée avec 
              paiement à la livraison.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('boutique')}
                className="bg-gold-gradient text-white hover:opacity-90 text-lg px-8 py-6 shadow-xl luxury-shadow"
              >
                Découvrir les offres
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(generateWhatsAppLink('informations sur vos produits'), '_blank')}
                className="border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#FFF9E6] text-lg px-8 py-6"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Commander sur WhatsApp
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#B8860B]" />
                <span>Livraison à Conakry</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#B8860B]" />
                <span>Paiement à la livraison</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#B8860B]" />
                <span>Qualité garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('produits')}
            className="text-[#B8860B] opacity-60 hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8 rotate-90" />
          </button>
        </div>
      </section>

      {/* ============================================
          VIDEOS PRODUITS SHOWCASE (lazy — chargé quand visible)
          ============================================ */}
      <section ref={videoSectionRef} id="videos-produits" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {!showVideos ? (
        /* Placeholder léger tant que la section n'est pas visible */
        <div className="flex items-center justify-center py-16">
          <div className="text-center text-gray-500">
            <PlayCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Vidéos en cours de chargement…</p>
          </div>
        </div>
      ) : (<>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4A418]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4A418]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#D4A418]/20 text-[#D4A418] border border-[#D4A418]/30 px-4 py-1.5">
              🎬 Présentations Vidéo
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Découvrez nos <span className="text-[#D4A418]">Produits en Action</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Des vidéos professionnelles pour découvrir en détail la qualité et le design de nos produits premium
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Video 1: Richard Mille */}
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-2xl border border-[#D4A418]/20 hover:border-[#D4A418]/50 transition-all duration-500 hover:shadow-[#D4A418]/20 hover:shadow-2xl">
                <div className="aspect-video overflow-hidden">
                  <video
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/blanche.jpg"
                  >
                    <source src="https://aigc-files.bigmodel.cn/api/cogvideo/5796cab0-1f20-11f1-913a-f2c33534665f_0.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#D4A418]/90 flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="h-8 w-8 text-black" />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-[#D4A418] text-black mb-2 text-xs">Montres</Badge>
                  <h3 className="text-xl font-bold text-white mb-1">Montre Style Royal RM – Édition Tendance</h3>
                  <p className="text-gray-300 text-sm mb-3">Style luxe et design audacieux</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D4A418]">350 000 GNF</span>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const product = products[0];
                        if (product) handleSelectProduct(product);
                      }}
                      className="bg-white/10 hover:bg-[#D4A418] text-white border border-white/20"
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video 2: Cartier */}
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-2xl border border-[#D4A418]/20 hover:border-[#D4A418]/50 transition-all duration-500 hover:shadow-[#D4A418]/20 hover:shadow-2xl">
                <div className="aspect-video overflow-hidden">
                  <video
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/precious-duke.jpg"
                  >
                    <source src="https://aigc-files.bigmodel.cn/api/cogvideo/6bf984ac-1f20-11f1-913a-f2c33534665f_0.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#D4A418]/90 flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="h-8 w-8 text-black" />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-[#D4A418] text-black mb-2 text-xs">Montres</Badge>
                  <h3 className="text-xl font-bold text-white mb-1">Montre Élégance Gold – Style Classique</h3>
                  <p className="text-gray-300 text-sm mb-3">Le raffinement à l'état pur</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D4A418]">500 000 GNF</span>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const product = products[1];
                        if (product) handleSelectProduct(product);
                      }}
                      className="bg-white/10 hover:bg-[#D4A418] text-white border border-white/20"
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video 3: AG Glass */}
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-2xl border border-[#D4A418]/20 hover:border-[#D4A418]/50 transition-all duration-500 hover:shadow-[#D4A418]/20 hover:shadow-2xl">
                <div className="aspect-video overflow-hidden">
                  <video
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/luxury-glass-matte.jpeg"
                  >
                    <source src="https://aigc-files.bigmodel.cn/api/cogvideo/c62a175e-1f1e-11f1-a4db-02e07114cd92_0.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#D4A418]/90 flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="h-8 w-8 text-black" />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-[#D4A418] text-black mb-2 text-xs">Accessoires</Badge>
                  <h3 className="text-xl font-bold text-white mb-1">Coque AG Glass Premium</h3>
                  <p className="text-gray-300 text-sm mb-3">Protection ultime en verre trempé</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D4A418]">480 000 GNF</span>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const product = products[2];
                        if (product) handleSelectProduct(product);
                      }}
                      className="bg-white/10 hover:bg-[#D4A418] text-white border border-white/20"
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">Tous nos produits sont disponibles à Conakry avec livraison rapide</p>
            <Button
              size="lg"
              className="bg-gold-gradient text-white hover:opacity-90 shadow-xl px-10 py-6 text-lg"
              onClick={() => scrollToSection('boutique')}
            >
              Voir tous les produits
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        </>)}
      </section>

      {/* ============================================
          PRODUITS PHARES SECTION
          ============================================ */}
      <section id="produits" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FFF9E6] text-[#B8860B]">Collection Exclusive</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Produits Phares
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une sélection soignée de montres de prestige et d'accessoires premium, 
              disponibles maintenant à Conakry.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
                onHover={handleProductHover}
                onQuickBuy={handleQuickBuy}
                priority={idx === 0}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('boutique')}
              className="border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#FFF9E6] px-8"
            >
              Voir toute la boutique
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          POURQUOI NOUS CHOISIR SECTION
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FFF9E6] text-[#B8860B]">Nos Engagements</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              MARCHÉ ROYAL DE GUINÉE s'engage à vous offrir le meilleur service 
              et des produits de qualité supérieure.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Truck,
                title: "Livraison Rapide à Conakry",
                description: "Recevez votre commande en 24 à 48 heures directement chez vous, à votre bureau ou là où vous le souhaitez. Nous livrons tous les quartiers de Conakry et les environs proches avec ponctualité et professionnalisme.",
              },
              {
                icon: Shield,
                title: "Paiement à la Livraison",
                description: "Commandez sans risque – vous payez uniquement quand vous tenez votre produit entre les mains. Zéro stress, zéro avance, confiance totale. Votre satisfaction est notre priorité.",
              },
              {
                icon: Star,
                title: "Produits Sélectionnés avec Soin",
                description: "Chaque montre et accessoire est choisi pour sa qualité et sa durabilité. Nous refusons les produits médiocres car votre satisfaction et notre réputation sont plus importantes que les profits faciles.",
              },
              {
                icon: MessageCircle,
                title: "Service Client WhatsApp Réactif",
                description: "Une question ? Un doute ? Notre équipe répond rapidement par WhatsApp. Nous sommes là pour vous accompagner avant, pendant et après votre achat. Un vrai service client, accessible et humain.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#D4A418]/30 transition-all hover:shadow-lg"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4A418]/20 to-[#B8860B]/20 flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-[#B8860B]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SOCIAL PROOF COUNTER
          ============================================ */}
      <section className="py-10 bg-[#B8860B]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: '200+', label: 'Clients satisfaits' },
              { value: '500+', label: 'Commandes livrées' },
              { value: '48h', label: 'Livraison max Conakry' },
              { value: '5★', label: 'Note moyenne clients' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold">{stat.value}</span>
                <span className="text-sm md:text-base text-white/80 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TÉMOIGNAGES SECTION
          ============================================ */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#D4A418]/20 text-[#D4A418] border border-[#D4A418]/30">
              Avis Clients
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des clients satisfaits à travers toute la Guinée
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4A418]/30 transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#D4A418] text-[#D4A418]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A418] to-[#B8860B] flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-20 bg-gradient-to-r from-[#B8860B] via-[#D4A418] to-[#B8860B]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à passer commande ?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous directement sur WhatsApp pour commander votre montre 
            ou accessoire préféré. Réponse rapide garantie !
          </p>
          <Button
            size="lg"
            className="whatsapp-btn text-white text-lg px-10 py-6 shadow-xl"
            onClick={() => window.open(generateWhatsAppLink('passer une commande'), '_blank')}
          >
            <MessageCircle className="mr-3 h-6 w-6" />
            Commander sur WhatsApp
          </Button>
        </div>
      </section>

      {/* ============================================
          NOUVEAUTÉS SECTION
          ============================================ */}
      {products.some(p => p.isNew) && (
        <section className="py-14 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Nouveau</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Nouveautés</h2>
              <p className="text-gray-500 text-sm hidden sm:block">— Venez de rejoindre notre collection</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.isNew).map((product) => {
                const disc = product.originalPrice && product.originalPrice > product.price
                  ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
                return (
                  <div
                    key={`new-${product.id}`}
                    className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex gap-4 p-4"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                      <span className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-purple-600 font-medium mb-0.5">{product.category}</p>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#B8860B]">{formatPrice(product.price)}</span>
                        {disc > 0 && product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button
                        className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full font-medium transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleSelectProduct(product); }}
                      >
                        Découvrir →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          BOUTIQUE SECTION (Full Catalog)
          ============================================ */}
      <section id="boutique" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FFF9E6] text-[#B8860B]">Catalogue Complet</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Boutique
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez notre collection complète de montres de prestige et d&apos;accessoires premium.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={
                  activeCategory === category
                    ? "bg-gold-gradient text-white hover:opacity-90"
                    : "border-[#B8860B] text-[#B8860B] hover:bg-[#FFF9E6]"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {productsLoading
              ? Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
              : filteredProducts.map((product, boutIdx) => {
              const disc = product.originalPrice && product.originalPrice > product.price
                ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
              const stk = product.inStock === false
                ? { text: 'Rupture de stock', cls: 'bg-red-100 text-red-700' }
                : product.stockQuantity !== undefined && product.stockQuantity <= 5
                ? { text: `Plus que ${product.stockQuantity} en stock`, cls: 'bg-orange-100 text-orange-700' }
                : product.stockQuantity !== undefined && product.stockQuantity <= 15
                ? { text: 'Stock faible', cls: 'bg-yellow-100 text-yellow-700' }
                : { text: 'En stock', cls: 'bg-green-100 text-green-700' };
              return (
                <Card
                  key={product.id}
                  className="premium-card border-0 shadow-lg overflow-hidden bg-white cursor-pointer group"
                  onClick={() => handleSelectProduct(product)}
                  role="article"
                  aria-label={`${product.name} - ${formatPrice(product.price)}`}
                >
                  {/* Product Image avec next/image optimisé */}
                  <div className="product-image-container aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
                    <Image
                      src={product.image}
                      alt={`${product.name} - ${product.category} disponible chez MARCHÉ ROYAL DE GUINÉE à Conakry`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={boutIdx === 0 ? 'eager' : 'lazy'}
                      priority={boutIdx === 0}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Nouveau</span>
                      )}
                      {disc > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{disc}%</span>
                      )}
                      {product.badge && !product.isNew && (
                        <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">{product.badge}</span>
                      )}
                    </div>
                    {product.isRealPhoto && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-600/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-2.5 w-2.5" /> Photo réelle
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {product.shortDescription}
                    </p>
                    {/* Notation étoilée */}
                    <div className="flex items-center gap-1 mb-2" aria-label="Note : 5 sur 5 étoiles">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D4A418] text-[#D4A418]" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                    </div>
                    {/* Prix + barré */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-2xl font-bold text-[#B8860B] price-tag">{formatPrice(product.price)}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                    {/* Stock */}
                    <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${stk.cls}`}>{stk.text}</span>
                  </CardContent>

                  <CardFooter className="pt-0 gap-2 flex-wrap">
                    <Button
                      className="flex-1 bg-gold-gradient text-white hover:opacity-90"
                      onClick={(e) => { e.stopPropagation(); handleSelectProduct(product); }}
                    >
                      Voir le produit
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-[#B8860B] text-[#B8860B] hover:bg-[#FFF9E6]"
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        fbPixelEvent.purchase(product);
                        gaEvent.whatsappClick(product.name);
                        window.open(generateWhatsAppLink(product.name), '_blank');
                      }}
                      aria-label={`Commander ${product.name} sur WhatsApp`}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================
          À PROPOS SECTION
          ============================================ */}
      <section id="apropos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/7437519256192966656.jpg"
                    alt="Logo et vitrine de MARCHÉ ROYAL DE GUINÉE - Boutique de montres et accessoires premium à Lambanyi, Conakry"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-[#D4A418] to-[#B8860B] rounded-2xl -z-10"></div>
              </div>

              {/* Content */}
              <div>
                <Badge className="mb-4 bg-[#FFF9E6] text-[#B8860B]">Notre Histoire</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  À propos de MARCHÉ ROYAL DE GUINÉE
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    MARCHÉ ROYAL DE GUINÉE est né d&apos;une idée simple mais puissante : pourquoi les Guinéens devraient-ils se contenter de produits médiocres ou attendre des semaines pour recevoir leurs commandes depuis l&apos;étranger ? Fondée à Lambanyi, au cœur de Conakry, notre boutique en ligne a été créée par des passionnés qui croyaient qu&apos;il était possible d&apos;offrir des montres stylées et des accessoires de qualité supérieure, disponibles immédiatement.
                  </p>
                  <p>
                    Notre manière de travailler repose sur trois piliers fondamentaux : la sélection rigoureuse de chaque produit, le contrôle qualité permanent avant expédition, et la disponibilité locale de nos stocks à Conakry. Nous refusons les produits de mauvaise qualité, même s&apos;ils nous permettraient de réaliser des marges plus confortables. Nos stocks sont physiquement présents à Conakry, ce qui signifie que vous n&apos;attendez pas des semaines pour profiter de votre achat.
                  </p>
                  <p>
                    Nos engagements envers vous sont simples et directs : le sérieux dans le traitement de chaque commande, la transparence sur les prix sans frais cachés, et un service client WhatsApp réactif disponible avant, pendant et après votre achat. Nous ne sommes pas une multinationale impersonnelle : nous sommes une équipe locale qui comprend les réalités du marché guinéen.
                  </p>
                </div>

                {/* Values */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {["Sérieux", "Fiabilité", "Qualité", "Proximité"].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#B8860B]" />
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CONTACT SECTION
          ============================================ */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#FFF9E6] text-[#B8860B]">Contactez-nous</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nous Contacter
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Une question ? Une commande ? N&apos;hésitez pas à nous contacter. 
                Notre équipe est là pour vous aider.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom complet <span className="text-red-500" aria-hidden="true">*</span></Label>
                    <Input
                      id="contact-name"
                      placeholder="Votre nom"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email <span className="text-red-500" aria-hidden="true">*</span></Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Téléphone</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+224 XX XX XX XX"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message <span className="text-red-500" aria-hidden="true">*</span></Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Votre message..."
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                      aria-required="true"
                    />
                  </div>
                  <Button
                    className="w-full bg-gold-gradient text-white hover:opacity-90"
                    onClick={handleContactSubmit}
                    disabled={contactStatus === 'sending'}
                  >
                    {contactStatus === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                  {contactStatus === 'success' && (
                    <p className="text-green-600 text-sm text-center" role="alert">
                      Message envoyé avec succès ! Nous vous répondrons bientôt.
                    </p>
                  )}
                  {contactStatus === 'error' && (
                    <p className="text-red-600 text-sm text-center" role="alert">
                      Erreur lors de l&apos;envoi. Veuillez réessayer ou nous contacter sur WhatsApp.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Phone */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFF9E6] flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#B8860B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Téléphone</h3>
                      <p className="text-[#B8860B] font-medium">+224 623 457 689</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFF9E6] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#B8860B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Localisation</h3>
                      <p className="text-gray-600">Lambanyi, Conakry, Guinée</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Hours */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFF9E6] flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#B8860B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Horaires</h3>
                      <p className="text-gray-600">Lun - Sam : 9h - 19h</p>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp CTA */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Commandez directement sur WhatsApp
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Réponse rapide garantie ! Contactez-nous pour passer votre commande 
                      ou poser vos questions.
                    </p>
                    <Button
                      className="w-full whatsapp-btn text-white"
                      onClick={() => window.open(generateWhatsAppLink('demande d\'informations'), '_blank')}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Commander par WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FFF9E6] text-[#B8860B]">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Retrouvez les réponses aux questions les plus posées. 
              Une autre question ? Contactez-nous !
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border-0 rounded-xl shadow-md overflow-hidden px-2"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 text-left font-semibold text-gray-900">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">MARCHÉ</span>
                <span className="text-[#D4A418] ml-1">ROYAL</span>
                <span className="text-gray-400 text-lg ml-1">DE GUINÉE</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Votre boutique en ligne de confiance pour les montres de prestige 
                et accessoires premium en Guinée. Qualité, style et service client exceptionnel.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open(generateWhatsAppLink('contact'), '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-[#D4A418]">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Accueil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('boutique')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Boutique
                  </button>
                </li>
                <li>
                  <a
                    href="/produits"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Catalogue complet
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('apropos')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    À propos
                  </button>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <a
                    href="/suivi"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Suivi commande
                  </a>
                </li>
                <li>
                  <a
                    href={customer ? "/compte" : "/connexion"}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Mon Compte
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-[#D4A418]">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#D4A418]" />
                  <a href="tel:+224623457689" className="hover:text-white transition-colors">+224 623 457 689</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#D4A418]" />
                  Lambanyi, Conakry
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D4A418]" />
                  Lun-Sam : 9h-19h
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <MessageCircle className="h-4 w-4 text-[#D4A418]" />
                  <a href="/contact" className="hover:text-white transition-colors">Formulaire de contact</a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-8" />

          {/* Badges de confiance */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-xs text-gray-300">
              <span>🔒</span> Paiement sécurisé
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-xs text-gray-300">
              <span>🚚</span> Livraison rapide Conakry
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-xs text-gray-300">
              <span>✅</span> Qualité garantie 30 jours
            </div>
            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-xs text-gray-300">
              <span>💵</span> Paiement à la livraison
            </div>
          </div>

          {/* Liens légaux */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs text-gray-600">
            <a href="/cgv" className="hover:text-gray-400 transition-colors">Conditions Générales de Vente</a>
            <span className="text-gray-700">·</span>
            <a href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions Légales</a>
            <span className="text-gray-700">·</span>
            <a href="/confidentialite" className="hover:text-gray-400 transition-colors">Politique de Confidentialité</a>
            <span className="text-gray-700">·</span>
            <a href="/contact" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} MARCHÉ ROYAL DE GUINÉE. Tous droits réservés.
            </p>
            <p className="mt-2">
              Boutique en ligne de montres et accessoires à Conakry, Guinée 🇬🇳
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================
          PRODUCT DETAIL MODAL
          ============================================ */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="text-[#B8860B] text-xl font-bold price-tag">
                  {formatPrice(selectedProduct.price)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Product Images - Galerie avec miniatures cliquables */}
                <div className="space-y-4">
                  {/* Image principale */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={selectedProduct.images?.[activeImageIndex] || selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>
                  {/* Miniatures cliquables */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProduct.images?.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0
                          ${activeImageIndex === idx 
                            ? 'border-[#B8860B] ring-2 ring-[#D4A418]/30 scale-105' 
                            : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => setActiveImageIndex(idx)}
                        aria-label={`Voir image ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${selectedProduct.name} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Short Description */}
                  <p className="text-gray-700 text-lg italic border-l-4 border-[#D4A418] pl-4">
                    {selectedProduct.shortDescription}
                  </p>

                  {/* Long Description */}
                  <div className="prose prose-gray">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                    {selectedProduct.longDescription.split('\n\n').map((para, idx) => (
                      <p key={idx} className="text-gray-600 text-sm leading-relaxed mb-3">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Characteristics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Caractéristiques</h4>
                    <ul className="space-y-2">
                      {selectedProduct.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-[#B8860B] mt-0.5 flex-shrink-0" />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* VIDEO BLOC - AG GLASS UNIQUEMENT */}
                  {selectedProduct.category === 'Accessoires Téléphone' && (
                    <div className="product-video-block bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <PlayCircle className="h-5 w-5 text-[#B8860B]" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Voir la coque AG Glass en vidéo
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Découvrez la protection premium en action
                      </p>
                      
                      {/* Video Player */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg group">
                        <video
                          src="https://aigc-files.bigmodel.cn/api/cogvideo/c62a175e-1f1e-11f1-a4db-02e07114cd92_0.mp4"
                          poster="/luxury-glass-matte.jpeg"
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Texte rassurant */}
                      <div className="mt-3 p-3 bg-[#FFF9E6] rounded-lg border border-[#D4A418]/20">
                        <p className="text-sm text-gray-700">
                          <strong className="text-[#B8860B]">✓ Qualité vérifiée :</strong> Cette vidéo montre la véritable coque AG Glass Premium. Vous pouvez voir la finesse du design et la solidité de la protection.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Pourquoi vous allez l&apos;adorer
                    </h4>
                    <ul className="space-y-2">
                      {selectedProduct.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-[#D4A418] mt-0.5 flex-shrink-0 fill-[#D4A418]" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compatibility (for phone cases) */}
                  {selectedProduct.compatibility && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Compatibilité</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.compatibility.map((model, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Info */}
                  <div className="bg-[#FFF9E6] rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-gray-900">Livraison & Paiement</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Truck className="h-4 w-4 text-[#B8860B]" />
                      Livraison 24–48h à Conakry (3–5j en province)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="h-4 w-4 text-[#B8860B]" />
                      Paiement à la livraison — Orange Money — MTN Money
                    </div>
                  </div>

                  {/* Politique de retour */}
                  <div className="border border-green-200 bg-green-50 rounded-xl p-4 space-y-1.5">
                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Politique d&apos;échange — 7 jours
                    </h4>
                    <p className="text-sm text-green-800">
                      Si le produit ne correspond pas à votre commande ou présente un défaut, vous avez <strong>7 jours</strong> pour nous le signaler via WhatsApp. Échange immédiat, sans tracas, pour les clients de Conakry.
                    </p>
                    <p className="text-xs text-green-700">
                      Produit non utilisé · emballage d&apos;origine requis · garantie fabrication 30 jours
                    </p>
                  </div>

                  {/* Sélecteurs de variantes */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Choisir vos options</h4>
                      {selectedProduct.variants.map((variant) => (
                        <div key={variant.name}>
                          <label className="block text-sm text-gray-600 mb-1.5">
                            {variant.name} <span className="text-red-500">*</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variant.options.map((opt) => (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => {
                                  setSelectedVariants(prev => ({ ...prev, [variant.name]: opt.label }));
                                  setVariantError('');
                                }}
                                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                                  selectedVariants[variant.name] === opt.label
                                    ? 'border-[#B8860B] bg-[#FFF9E6] text-[#B8860B]'
                                    : 'border-gray-200 text-gray-700 hover:border-[#B8860B]'
                                }`}
                              >
                                {opt.label}
                                {opt.extraPrice > 0 && (
                                  <span className="ml-1 text-xs text-gray-400">+{new Intl.NumberFormat('fr-GN').format(opt.extraPrice)}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {variantError && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          {variantError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="space-y-3">
                    {/* Ajouter au panier */}
                    <Button
                      className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white text-lg py-6"
                      onClick={() => {
                        // Validation variantes obligatoires
                        if (selectedProduct.variants && selectedProduct.variants.length > 0) {
                          const missing = selectedProduct.variants.find(v => !selectedVariants[v.name]);
                          if (missing) {
                            setVariantError(`Veuillez choisir : ${missing.name}`);
                            return;
                          }
                        }
                        handleAddToCart(selectedProduct);
                      }}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Ajouter au panier
                    </Button>

                    {/* WhatsApp Button avec tracking */}
                    <Button
                      className="w-full whatsapp-btn text-white text-lg py-6"
                      onClick={() => {
                        fbPixelEvent.purchase(selectedProduct);
                        gaEvent.purchaseWhatsApp(selectedProduct);
                        gaEvent.whatsappClick(selectedProduct.name);
                        window.open(generateWhatsAppLink(selectedProduct.name), '_blank');
                      }}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Commander sur WhatsApp
                    </Button>
                  </div>

                  {/* ── Upsell : Vous aimerez aussi ─────────────────── */}
                  {(() => {
                    const others = products.filter(p => p.id !== selectedProduct.id).slice(0, 2);
                    if (others.length === 0) return null;
                    return (
                      <div className="border-t pt-5">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-[#B8860B]" />
                          Vous aimerez aussi
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {others.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSelectedProduct(p);
                                setActiveImageIndex(0);
                                setSelectedVariants({});
                                setVariantError('');
                              }}
                              className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-[#D4A418] hover:bg-[#FFF9E6] transition-all text-left group"
                            >
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
                                <p className="text-sm font-bold text-[#B8860B] mt-0.5">{formatPrice(p.price)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Section avis clients avec dates */}
                  <ReviewsSection productId={selectedProduct.id} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================
          QUICK BUY MODAL (Achat rapide)
          ============================================ */}
      <Dialog open={isQuickBuyOpen} onOpenChange={(open) => {
        if (!open) {
          setIsQuickBuyOpen(false);
          setQuickBuyProduct(null);
        }
      }}>
        <DialogContent className="max-w-md">
          {quickBuyProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Achat rapide</DialogTitle>
                <DialogDescription>
                  Commandez directement sans quitter la page
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-4 mt-4">
                {/* Image miniature */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={quickBuyProduct.image}
                    alt={`${quickBuyProduct.name} - Achat rapide`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Infos produit */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {quickBuyProduct.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {quickBuyProduct.category}
                  </p>
                  <p className="text-2xl font-bold text-[#B8860B] mt-2">
                    {formatPrice(quickBuyProduct.price)}
                  </p>
                </div>
              </div>

              {/* Infos livraison */}
              <div className="bg-[#FFF9E6] rounded-xl p-3 mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Truck className="h-4 w-4 text-[#B8860B]" />
                  Livraison 24-48h à Conakry
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Shield className="h-4 w-4 text-[#B8860B]" />
                  Paiement à la livraison
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3 mt-4">
                <Button
                  className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white py-5"
                  onClick={() => {
                    handleAddToCart(quickBuyProduct);
                    setIsQuickBuyOpen(false);
                    setQuickBuyProduct(null);
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier
                </Button>
                <Button
                  className="w-full whatsapp-btn text-white py-5"
                  onClick={() => {
                    fbPixelEvent.purchase(quickBuyProduct);
                    gaEvent.purchaseWhatsApp(quickBuyProduct);
                    gaEvent.whatsappClick(quickBuyProduct.name);
                    window.open(generateWhatsAppLink(quickBuyProduct.name), '_blank');
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Commander sur WhatsApp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================
          FOOTER
          ============================================ */}
      {/* Newsletter section */}
      <section className="bg-gradient-to-r from-[#1a1400] via-[#0a0a0a] to-[#1a1400] border-t border-[#D4A418]/20 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4A418]/10 border border-[#D4A418]/30 text-[#D4A418] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            ✉️ Newsletter exclusive
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Restez informé des nouveautés</h2>
          <p className="text-white/60 text-sm mb-6">
            Offres exclusives, nouvelles collections et promotions réservées à nos abonnés.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 mt-0">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Colonne 1 : Marque */}
            <div>
              {/* Logo */}
              <div className="mb-4">
                <Image
                  src="/logo-royal.png"
                  alt="Royal Marché de Guinée"
                  width={160}
                  height={80}
                  className="h-16 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Montres, accessoires et produits premium. Authentiques, élégants, livrés chez vous.
              </p>
              <a
                href="https://wa.me/224623457689"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Nous contacter
              </a>
            </div>

            {/* Colonne 2 : Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { href: '/', label: 'Accueil' },
                  { href: '/produits', label: 'Catalogue' },
                  { href: '/suivi', label: 'Suivi de commande' },
                  { href: '/compte', label: 'Mon compte' },
                  { href: '/connexion', label: 'Connexion' },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-[#B8860B] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : Légal & Contact */}
            <div>
              <h4 className="text-white font-semibold mb-3">Informations</h4>
              <ul className="space-y-2 text-sm mb-4">
                {[
                  { href: '/cgv', label: 'Conditions générales de vente' },
                  { href: '/confidentialite', label: 'Politique de confidentialité' },
                  { href: '/mentions-legales', label: 'Mentions légales' },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-[#B8860B] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">
                📍 Lambanyi, Conakry – Guinée<br />
                📞 +224 623 457 689
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Marché Royal de Guinée. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* ============================================
          CART PANEL (Panneau du panier)
          ============================================ */}
      <CartPanel />

      {/* ============================================
          FLOATING WHATSAPP BUTTON
          ============================================ */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="whatsapp-btn text-white rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-transform"
          onClick={() => {
            gaEvent.whatsappClick('floating-button');
            window.open(generateWhatsAppLink('Bonjour, je suis intéressé par vos produits'), '_blank');
          }}
          aria-label="Nous contacter sur WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
