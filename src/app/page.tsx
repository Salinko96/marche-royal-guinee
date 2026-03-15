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
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

/* ============================================
   MARCHÉ ROYAL DE GUINÉE
   Boutique en ligne de montres et accessoires
   ============================================ */

// ============================================
// Types & Data
// ============================================

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  characteristics: string[];
  highlights: string[];
  image: string;
  images: string[];
  compatibility?: string[];
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

// Product Data - Contenu optimisé pour le marché guinéen
const products: Product[] = [
  {
    id: 1,
    name: "Montre Richard Mille – Édition Tendance",
    category: "Montres",
    price: 350000,
    shortDescription: "Style luxe inspiré des modèles Richard Mille, idéale pour vos sorties, événements spéciaux et cadeaux marquants.",
    longDescription: `La Montre Richard Mille – Édition Tendance incarne l'excellence horlogère rendue accessible au plus grand nombre en Guinée. Ce chef-d'œuvre de design s'inspire des lignes emblématiques et audacieuses de la maison Richard Mille, offrant un look résolument contemporain qui ne passera pas inaperçu au poignet. Son boîtier aux formes géométriques pures et son cadran sophistiqué avec détails raffinés en font l'accessoire parfait pour ceux qui souhaitent affirmer leur style avec confiance et originalité.

Cette montre tendance accompagne toutes vos occasions importantes : sorties entre amis à Conakry, soirées VIP, événements familiaux ou rencontres professionnelles décontractées. Elle constitue également un cadeau mémorable pour un proche qui mérite une attention spéciale. Le mariage parfait entre l'artisanat traditionnel et l'esthétique moderne se reflète dans chaque détail de cette pièce exceptionnelle. Son design unique capture l'essence du luxe contemporain tout en restant parfaitement portable au quotidien.

Conçue pour durer, cette montre allie robustesse et raffinement dans un équilibre remarquable. Son mécanisme de précision garantit une fiabilité absolue au fil des heures, tandis que son design audacieux traverse les modes sans jamais se démoder. Portez-la fièrement et laissez votre personnalité distinctive briller à travers cet accessoire qui en dit long sur votre goût pour l'excellence. Disponible exclusivement chez MARCHÉ ROYAL DE GUINÉE, avec livraison rapide à Conakry.

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
      "/rouge jaune vert noir.jpg",
      "/noir.jpg",
      "/rouge.jpg",
      "/jaune.jpg",
      "/bleu.jpg",
      "/belle vue bleu.jpg"
    ],
  },
  {
    id: 2,
    name: "Montre Cartier – Élégance Classique",
    category: "Montres",
    price: 500000,
    shortDescription: "L'élégance classique inspirée de la maison Cartier pour vos occasions officielles, cérémonies et moments importants.",
    longDescription: `La Montre Cartier – Élégance Classique représente le summum du raffinement et de la sophistication horlogère. Inspirée par l'héritage prestigieux de la maison Cartier, cette montre incarne un classicisme indémodable qui traverse les époques avec une grâce inaltérable. Son design épuré aux lignes harmonieuses et son cadran élégant en font le compagnon idéal des hommes et femmes d'affaires de Conakry qui comprennent que l'allure est le premier message que l'on adresse au monde.

Cette pièce d'exception est façonnée pour ceux qui apprécient les valeurs sûres de l'horlogerie classique. Son cadran raffiné avec aiguilles élégantes et index précis témoigne d'un savoir-faire artisanal remarquable. Que ce soit pour un mariage, une réunion d'affaires importante, une cérémonie officielle ou simplement pour affirmer votre statut social avec discrétion, cette montre Cartier sera votre alliée de confiance en toutes circonstances.

Offrir cette montre, c'est offrir bien plus qu'un simple accessoire : c'est transmettre un symbole de réussite, de bon goût et d'ambition. Son allure distinguée séduira instantanément les amateurs de belles pièces horlogères qui reconnaissent la qualité au premier regard. Le bracelet en cuir véritable apporte une touche de chaleur et de noblesse, tandis que le boîtier poli reflète la lumière avec une subtilité qui ne cherche pas à briller artificiellement.

Disponible à Lambanyi, Conakry, avec la garantie de qualité MARCHÉ ROYAL DE GUINÉE, cette pièce représente un investissement dans votre image. Elle accompagne les moments importants de votre vie avec une présence à la fois discrète et marquante. Le luxe véritable ne crie pas : il suggère, il inspire, il impressionne par sa maîtrise.`,
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
    image: "/precious duke.jpg",
    images: [
      "/precious duke.jpg", 
      "/_ (1).jpeg", 
      "/_ (2).jpeg",
      "/_ (6).jpeg",
      "/_ (8).jpeg",
      "/_ (9).jpeg",
      "/_.jpeg",
      "/7437519256192966656.png"
    ],
  },
  {
    id: 3,
    name: "Coque AG Glass Premium",
    category: "Accessoires Téléphone",
    price: 480000,
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
    image: "/Luxury Big Window AG Glass Matte.jpeg",
    images: ["/Luxury Big Window AG Glass Matte.jpeg", "/Luxury Big Window AG Glass Matte (1).jpeg", "/f9d01d82-379f-42b7-9d7b-49ea74dbe43e.jpg"],
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
    text: "J'ai commandé une montre Richard Mille pour mon frère. La qualité est exceptionnelle et la livraison a été rapide. Je recommande vivement MARCHÉ ROYAL DE GUINÉE !",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatou D.",
    location: "Dixinn, Conakry",
    text: "Service client au top ! J'ai eu un problème avec ma commande et ils ont été très réactifs sur WhatsApp. Ma montre Cartier est magnifique, merci infiniment.",
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

// Categories
const categories = ["Tous", "Montres", "Accessoires Téléphone"];

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
// Composant ProductCard optimisé avec memo
// ============================================
const ProductCard = memo(function ProductCard({ 
  product, 
  onSelect,
  onHover
}: { 
  product: Product; 
  onSelect: (product: Product) => void;
  onHover: (product: Product) => void;
}) {
  return (
    <Card
      className="premium-card border-0 shadow-lg overflow-hidden bg-white cursor-pointer"
      onClick={() => onSelect(product)}
      onMouseEnter={() => onHover(product)}
    >
      {/* Product Image */}
      <div className="product-image-container aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          loading="eager"
          priority={product.id === 1}
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-black/80 text-white">
            {product.category}
          </Badge>
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
        <p className="text-2xl font-bold text-[#B8860B] price-tag">
          {formatPrice(product.price)}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full bg-gold-gradient text-white hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
        >
          Voir le produit
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

  // Mémoriser les produits filtrés pour éviter les recalculs
  const filteredProducts = useMemo(() => {
    return activeCategory === "Tous"
      ? products
      : products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Callback optimisé pour sélectionner un produit
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setIsModalOpen(true);
  }, []);

  // Callback pour fermer le modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setActiveImageIndex(0);
  }, []);

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

  // Précharger toutes les images au montage du composant
  useEffect(() => {
    products.forEach(product => {
      preloadImage(product.image);
      product.images.forEach(img => preloadImage(img));
    });
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
                <div className="text-xl md:text-2xl font-bold">
                  <span className="text-black">MARCHÉ</span>
                  <span className="text-gold-gradient ml-1">ROYAL</span>
                  <span className="text-gray-600 text-sm md:text-base ml-1">DE GUINÉE</span>
                </div>
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
              <button
                onClick={() => scrollToSection('apropos')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium"
              >
                FAQ
              </button>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                onClick={() => scrollToSection('produits')}
                className="bg-gold-gradient text-white hover:opacity-90 shadow-lg"
              >
                Commander maintenant
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
              <button
                onClick={() => scrollToSection('apropos')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-[#B8860B] transition-colors font-medium text-left py-2"
              >
                FAQ
              </button>
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
          VIDEOS PRODUITS SHOWCASE
          ============================================ */}
      <section id="videos-produits" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
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
                  <h3 className="text-xl font-bold text-white mb-1">Richard Mille – Édition Tendance</h3>
                  <p className="text-gray-300 text-sm mb-3">Style luxe et design audacieux</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D4A418]">350 000 GNF</span>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const product = products.find(p => p.id === 1);
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
                    poster="/precious duke.jpg"
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
                  <h3 className="text-xl font-bold text-white mb-1">Cartier – Élégance Classique</h3>
                  <p className="text-gray-300 text-sm mb-3">Le raffinement à l'état pur</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D4A418]">500 000 GNF</span>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const product = products.find(p => p.id === 2);
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
                    poster="/Luxury Big Window AG Glass Matte.jpeg"
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
                        const product = products.find(p => p.id === 3);
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
                onHover={handleProductHover}
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
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="premium-card border-0 shadow-lg overflow-hidden bg-white cursor-pointer"
                onClick={() => handleSelectProduct(product)}
              >
                {/* Product Image */}
                <div className="product-image-container aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/80 text-white">
                      {product.category}
                    </Badge>
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
                  <p className="text-2xl font-bold text-[#B8860B] price-tag">
                    {formatPrice(product.price)}
                  </p>
                </CardContent>

                <CardFooter className="pt-0 gap-2">
                  <Button
                    className="flex-1 bg-gold-gradient text-white hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProduct(product);
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
                      window.open(generateWhatsAppLink(product.name), '_blank');
                    }}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
                  <img
                    src="/7437519256192966656.png"
                    alt="MARCHÉ ROYAL DE GUINÉE"
                    className="w-full h-full object-cover"
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
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" placeholder="+224 XX XX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      rows={4}
                    />
                  </div>
                  {/* Cloudflare Turnstile */}
                  <div className="cf-turnstile" data-sitekey="0x4AAAAAACq_AhKdQSJlv5q6"></div>
                  <Button className="w-full bg-gold-gradient text-white hover:opacity-90">
                    Envoyer le message
                  </Button>
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
                      <p className="text-[#B8860B] font-medium">+224 623 45 76 89</p>
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
                  <button
                    onClick={() => scrollToSection('apropos')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    À propos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-[#D4A418]">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#D4A418]" />
                  +224 623 45 76 89
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#D4A418]" />
                  Lambanyi, Conakry
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D4A418]" />
                  Lun-Sam : 9h-19h
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-8" />

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
                  {selectedProduct.id === 3 && (
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
                          poster="/Luxury Big Window AG Glass Matte.jpeg"
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
                      Livraison disponible à Conakry et environs
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="h-4 w-4 text-[#B8860B]" />
                      Paiement à la livraison possible
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <Button
                    className="w-full whatsapp-btn text-white text-lg py-6"
                    onClick={() => window.open(generateWhatsAppLink(selectedProduct.name), '_blank')}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Commander sur WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================
          FLOATING WHATSAPP BUTTON
          ============================================ */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="whatsapp-btn text-white rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-transform"
          onClick={() => window.open(generateWhatsAppLink('Bonjour, je suis intéressé par vos produits'), '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
