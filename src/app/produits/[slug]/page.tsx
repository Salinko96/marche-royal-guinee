"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star,
  MessageCircle,
  ShoppingCart,
  ArrowLeft,
  Phone,
  MapPin,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  Share2,
  Loader2,
  PackageX,
  ThumbsUp,
  Send,
} from "lucide-react";
import ProductImageViewer from "@/components/product/ProductImageViewer";
import { toast } from "sonner";
import { CartButton, CartPanel } from "@/components/cart/MiniCart";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useCartStore } from "@/store/cartStore";
import { fbPixelEvent } from "@/components/tracking/FacebookPixel";
import { gaEvent } from "@/components/tracking/GoogleAnalytics";

// ============================================
// Composant avis clients
// ============================================
interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
          aria-label={`${s} étoile${s > 1 ? "s" : ""}`}
        >
          <Star
            className={`${sz} transition-colors ${
              s <= (hovered || value)
                ? "fill-[#D4A418] text-[#D4A418]"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ productId, productName }: { productId: string; productName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ customerName: "", rating: 0, comment: "" });

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || form.rating === 0 || !form.comment.trim()) {
      toast.error("Veuillez remplir tous les champs et donner une note");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...form }),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ customerName: "", rating: 0, comment: "" });
        toast.success("Avis envoyé !", {
          description: "Merci ! Votre avis sera publié après modération.",
        });
      } else {
        toast.error("Erreur lors de l'envoi de l'avis");
      }
    } catch {
      toast.error("Erreur réseau, réessayez");
    }
    setSubmitting(false);
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <ThumbsUp className="h-6 w-6 text-[#B8860B]" />
        Avis clients
        {total > 0 && (
          <Badge className="bg-[#FFF9E6] text-[#B8860B] border-[#B8860B]/20 ml-2">
            {total} avis
          </Badge>
        )}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Résumé des notes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border p-6 text-center mb-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-24 mx-auto rounded-lg" />
                <Skeleton className="h-5 w-32 mx-auto rounded" />
                <Skeleton className="h-4 w-20 mx-auto rounded" />
              </div>
            ) : (
              <>
                <p className="text-6xl font-black text-[#B8860B] leading-none">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </p>
                <div className="flex justify-center mt-2 mb-1">
                  <StarRating value={Math.round(avgRating)} readonly size="md" />
                </div>
                <p className="text-sm text-gray-500">{total} avis vérifiés</p>
              </>
            )}
          </div>

          {/* Répartition par étoile */}
          {!loading && total > 0 && (
            <div className="bg-white rounded-2xl border p-4 space-y-2">
              {ratingBreakdown.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-gray-500 text-right">{star}</span>
                  <Star className="h-3.5 w-3.5 fill-[#D4A418] text-[#D4A418] flex-shrink-0" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-[#D4A418] rounded-full transition-all duration-500"
                      style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="w-4 text-gray-400 text-xs">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liste des avis + formulaire */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avis existants */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl border p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
              <ThumbsUp className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Aucun avis pour le moment</p>
              <p className="text-sm mt-1">Soyez le premier à donner votre avis !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl border p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4A418] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.customerName}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly size="sm" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire d'avis */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Partagez votre expérience
            </h3>
            {submitted ? (
              <div className="flex items-center gap-3 py-4 text-green-700 bg-green-50 rounded-xl px-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Avis envoyé avec succès !</p>
                  <p className="text-sm text-green-600">Merci pour votre retour. Il sera publié après modération.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Votre note *</Label>
                  <StarRating
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                    size="lg"
                  />
                  {form.rating > 0 && (
                    <p className="text-xs text-[#B8860B]">
                      {["", "Très mauvais", "Mauvais", "Moyen", "Bien", "Excellent !"][form.rating]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewName">Votre nom *</Label>
                  <Input
                    id="reviewName"
                    placeholder="Ex: Mamadou D."
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    maxLength={60}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewComment">Votre avis *</Label>
                  <Textarea
                    id="reviewComment"
                    placeholder={`Partagez votre expérience avec ${productName}...`}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right">{form.comment.length}/500</p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#B8860B] hover:bg-[#996F0A] text-white gap-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitting ? "Envoi..." : "Publier mon avis"}
                </Button>

                <p className="text-xs text-gray-400">
                  Les avis sont vérifiés avant publication. Nous ne tolérons pas les avis frauduleux.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Types
// ============================================
interface ProductVariantOption {
  label: string;
  extraPrice?: number;
}
interface ProductVariant {
  name: string;
  options: ProductVariantOption[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  longDescription: string;
  characteristics: string;
  highlights: string;
  image: string;
  images: string;
  compatibility?: string;
  variants?: string; // JSON string
  rating: number;
  featured: boolean;
  inStock: boolean;
}

interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

// Format prix en GNF
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
};

// Lien WhatsApp
const generateWhatsAppLink = (productName: string): string => {
  const message = encodeURIComponent(
    `Bonjour, je souhaite commander : ${productName}`
  );
  return `https://wa.me/224623457689?text=${message}`;
};

// Parse JSON sécurisé
function safeJsonParse<T>(value: string | T[], fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// ============================================
// Page détail produit
// ============================================
export default function ProduitDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);

  const addToCart = useCartStore((state) => state.addItem);

  // Charger le produit + produits similaires
  useEffect(() => {
    if (!slug) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          fbPixelEvent.viewContent({ ...data, id: String(data.id) });
          gaEvent.viewItem({ ...data, id: String(data.id) });

          // Charger les produits similaires de la même catégorie
          const simRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}&limit=4`);
          if (simRes.ok) {
            const simData = await simRes.json();
            setSimilarProducts(
              (Array.isArray(simData) ? simData : simData.products ?? [])
                .filter((p: SimilarProduct) => p.slug !== slug)
                .slice(0, 4)
            );
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erreur chargement produit:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // Parser les données JSON
  const images = product ? safeJsonParse<string>(product.images) : [];
  const allImages = product ? [product.image, ...images.filter((img) => img !== product.image)] : [];
  const characteristics = product ? safeJsonParse<string>(product.characteristics) : [];
  const highlights = product ? safeJsonParse<string>(product.highlights) : [];
  const compatibility = product?.compatibility ? safeJsonParse<string>(product.compatibility) : [];
  const variants: ProductVariant[] = product?.variants ? (() => {
    try { return JSON.parse(product.variants!); } catch { return []; }
  })() : [];

  // Prix final avec extra prix des variantes sélectionnées
  const variantExtraPrice = variants.reduce((total, variant) => {
    const selectedLabel = selectedVariants[variant.name];
    const option = variant.options.find((o) => o.label === selectedLabel);
    return total + (option?.extraPrice ?? 0);
  }, 0);
  const finalPrice = (product?.price ?? 0) + variantExtraPrice;

  // Label variante pour le panier
  const variantLabel = Object.entries(selectedVariants)
    .map(([name, val]) => `${name}: ${val}`)
    .join(' / ') || undefined;

  // Ajout panier
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    // Vérifier que toutes les variantes requises sont sélectionnées
    const missingVariant = variants.find((v) => !selectedVariants[v.name]);
    if (missingVariant) {
      toast.error(`Veuillez choisir : ${missingVariant.name}`);
      return;
    }
    addToCart({
      id: String(product.id),
      name: product.name,
      price: finalPrice,
      image: product.image,
      category: product.category,
      variant: variantLabel,
    });
    fbPixelEvent.addToCart({ ...product, id: String(product.id) });
    gaEvent.addToCart({ ...product, id: String(product.id) });
  }, [product, addToCart, variants, selectedVariants, finalPrice, variantLabel]);

  // Partager
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [product]);

  // ============================================
  // États de chargement / erreur
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#B8860B] mx-auto mb-4" />
          <p className="text-gray-500">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PackageX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Produit introuvable
          </h2>
          <p className="text-gray-500 mb-6">
            Ce produit n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Button asChild className="bg-[#B8860B] hover:bg-[#9A7209] text-white">
            <Link href="/produits">Voir tous les produits</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/produits"
              className="flex items-center gap-2 text-[#B8860B] hover:opacity-80 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">Produits</span>
            </Link>

            <BrandLogo size="sm" href="/" />

            <CartButton />
          </div>
        </div>
      </header>

      <CartPanel />

      {/* ============================================
          BREADCRUMB
          ============================================ */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-[#B8860B] transition">
              Accueil
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/produits" className="hover:text-[#B8860B] transition">
              Produits
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ============================================
          CONTENU PRODUIT
          ============================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ---- COLONNE GAUCHE : IMAGES ---- */}
          <div>
            <ProductImageViewer images={allImages} productName={product.name} />
          </div>

          {/* ---- COLONNE DROITE : INFOS ---- */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <Badge className="bg-black/80 text-white">
                {product.category}
              </Badge>
              {product.featured && (
                <Badge className="bg-[#B8860B] text-white">Populaire</Badge>
              )}
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" /> En stock
                </Badge>
              ) : (
                <Badge variant="destructive">Rupture de stock</Badge>
              )}
            </div>

            {/* Nom */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating)
                        ? "fill-[#D4A418] text-[#D4A418]"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.rating.toFixed(1)})
              </span>
            </div>

            {/* Prix */}
            <p className="text-3xl sm:text-4xl font-bold text-[#B8860B] mb-1 price-tag">
              {formatPrice(finalPrice)}
            </p>

            {/* Prix barré si promotion */}
            {product.originalPrice && product.originalPrice > finalPrice && (
              <p className="text-lg text-gray-400 line-through mb-1">
                {formatPrice(product.originalPrice)}
              </p>
            )}

            {/* Description courte */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Sélecteur de variantes */}
            {variants.length > 0 && (
              <div className="space-y-4 mb-6">
                {variants.map((variant) => (
                  <div key={variant.name}>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {variant.name}
                      {selectedVariants[variant.name] && (
                        <span className="ml-2 text-[#B8860B] font-normal">
                          — {selectedVariants[variant.name]}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [variant.name]: option.label,
                            }))
                          }
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedVariants[variant.name] === option.label
                              ? "border-[#B8860B] bg-[#FFF9E6] text-[#B8860B]"
                              : "border-gray-200 text-gray-700 hover:border-[#B8860B] hover:text-[#B8860B]"
                          }`}
                        >
                          {option.label}
                          {option.extraPrice && option.extraPrice > 0 && (
                            <span className="ml-1 text-xs text-gray-400">
                              +{formatPrice(option.extraPrice)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                className="flex-1 bg-gold-gradient text-white hover:opacity-90 h-12 text-base"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base"
                onClick={() =>
                  window.open(generateWhatsAppLink(product.name), "_blank")
                }
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Commander WhatsApp
              </Button>
            </div>

            {/* Actions secondaires */}
            <div className="flex gap-3 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-gray-600"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Livraison rapide
                  </p>
                  <p className="text-xs text-gray-500">24-48h à Conakry</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Qualité garantie
                  </p>
                  <p className="text-xs text-gray-500">30 jours de garantie</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Paiement flexible
                  </p>
                  <p className="text-xs text-gray-500">
                    Cash, Orange Money, MTN
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* ---- ACCORDÉONS ---- */}
            <Accordion
              type="multiple"
              defaultValue={["description", "highlights"]}
              className="space-y-2"
            >
              {/* Description longue */}
              <AccordionItem value="description" className="bg-white rounded-lg border px-4">
                <AccordionTrigger className="text-base font-semibold">
                  Description détaillée
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.longDescription}
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Points forts */}
              {highlights.length > 0 && (
                <AccordionItem value="highlights" className="bg-white rounded-lg border px-4">
                  <AccordionTrigger className="text-base font-semibold">
                    Points forts
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Caractéristiques */}
              {characteristics.length > 0 && (
                <AccordionItem value="characteristics" className="bg-white rounded-lg border px-4">
                  <AccordionTrigger className="text-base font-semibold">
                    Caractéristiques techniques
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {characteristics.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <span className="text-[#B8860B] font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Compatibilité */}
              {compatibility.length > 0 && (
                <AccordionItem value="compatibility" className="bg-white rounded-lg border px-4">
                  <AccordionTrigger className="text-base font-semibold">
                    Compatibilité
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {compatibility.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </main>

      {/* ============================================
          BARRE CTA FIXE MOBILE
          ============================================ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 flex gap-3 lg:hidden z-40">
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">Prix</p>
          <p className="text-lg font-bold text-[#B8860B]">
            {formatPrice(finalPrice)}
          </p>
        </div>
        <Button
          className="flex-1 bg-gold-gradient text-white hover:opacity-90 h-11"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Panier
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white h-11 px-4"
          onClick={() =>
            window.open(generateWhatsAppLink(product.name), "_blank")
          }
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* ============================================
          SECTION AVIS CLIENTS
          ============================================ */}
      <ReviewsSection productId={product.id} productName={product.name} />

      {/* Spacer pour la barre mobile */}
      <div className="h-20 lg:hidden" />

      {/* ============================================
          PRODUITS SIMILAIRES
          ============================================ */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((sim) => (
              <Link
                key={sim.id}
                href={`/produits/${sim.slug}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden border border-transparent hover:border-[#B8860B] transition-all duration-200"
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={sim.image}
                    alt={sim.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-1">{sim.category}</p>
                  <p className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-[#B8860B] transition-colors">
                    {sim.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(sim.rating)
                            ? "fill-[#D4A418] text-[#D4A418]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[#B8860B] font-bold text-sm">
                    {formatPrice(sim.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" href="/" invert />
          </div>
          <p className="text-sm">
            Lambanyi, Conakry – Guinée | +224 623 457 689
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
            <a href="/cgv" className="hover:text-gray-400 transition-colors">CGV</a>
            <span>·</span>
            <a href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions légales</a>
            <span>·</span>
            <a href="/confidentialite" className="hover:text-gray-400 transition-colors">Confidentialité</a>
          </div>
          <p className="text-xs mt-3">
            © {new Date().getFullYear()} MARCHÉ ROYAL DE GUINÉE. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
