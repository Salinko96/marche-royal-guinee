"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MessageCircle,
  ShoppingCart,
  Zap,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  PackageX,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CartButton, CartPanel } from "@/components/cart/MiniCart";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { fbPixelEvent } from "@/components/tracking/FacebookPixel";
import { gaEvent } from "@/components/tracking/GoogleAnalytics";
import NewsletterForm from "@/components/NewsletterForm";

const ITEMS_PER_PAGE = 12;

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  image: string;
  images: string;
  rating: number;
  featured: boolean;
  inStock: boolean;
  isNew?: boolean;
  badge?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-GN").format(price) + " GNF";

const generateWhatsAppLink = (productName: string) =>
  `https://wa.me/224623457689?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${productName}`)}`;

// ─── Carte produit ────────────────────────────────────────────────────────────
const ProductCard = memo(function ProductCard({
  product,
  onQuickBuy,
}: {
  product: Product;
  onQuickBuy: (p: Product) => void;
}) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/produits/${product.slug}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <Card className="premium-card border-0 shadow-lg overflow-hidden bg-white group relative">
      {/* Image */}
      <Link href={`/produits/${product.slug}`}>
        <div className="product-image-container aspect-square bg-white relative cursor-pointer overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.name} – ${product.category} – MARCHÉ ROYAL DE GUINÉE Conakry`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges superposés */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            <Badge className="bg-black/80 text-white text-xs w-fit">{product.category}</Badge>
            {product.featured && <Badge className="bg-[#B8860B] text-white text-xs w-fit">⭐ Populaire</Badge>}
            {product.isNew && <Badge className="bg-blue-600 text-white text-xs w-fit">Nouveau</Badge>}
            {discount > 0 && <Badge className="bg-red-500 text-white text-xs w-fit">-{discount}%</Badge>}
            {product.badge && <Badge className="bg-purple-600 text-white text-xs w-fit">{product.badge}</Badge>}
          </div>

          {/* Actions flottantes */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem({ id: product.id, name: product.name, slug: product.slug, price: product.price, image: product.image, category: product.category }); }}
              className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:text-red-500'}`}
              aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#B8860B] transition-all"
              aria-label="Partager"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Overlay achat rapide */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-end justify-center pb-4">
            <Button
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#B8860B] hover:bg-[#FFF9E6] shadow-xl transform translate-y-3 group-hover:translate-y-0 text-sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickBuy(product); }}
              aria-label={`Achat rapide : ${product.name}`}
            >
              <Zap className="mr-1.5 h-4 w-4" />
              Achat rapide
            </Button>
          </div>

          {/* Rupture de stock */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Rupture de stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Infos */}
      <CardHeader className="pb-1 pt-3 px-4">
        <Link href={`/produits/${product.slug}`}>
          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-[#B8860B] transition-colors cursor-pointer leading-snug">
            {product.name}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="pb-3 px-4">
        <p className="text-gray-500 text-xs line-clamp-2 mb-2">{product.shortDescription}</p>

        {/* Étoiles */}
        <div className="flex items-center gap-1 mb-2" aria-label={`${product.rating} sur 5`}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-[#D4A418] text-[#D4A418]" : "fill-gray-200 text-gray-200"}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.rating.toFixed(1)})</span>
        </div>

        {/* Prix */}
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-[#B8860B] price-tag">{formatPrice(product.price)}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-4 gap-2">
        <Button className="flex-1 bg-gold-gradient text-white hover:opacity-90 h-9 text-sm" asChild>
          <Link href={`/produits/${product.slug}`}>
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Voir le produit
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-green-500 text-green-500 hover:bg-green-50 flex-shrink-0"
          onClick={() => {
            fbPixelEvent.purchase({ ...product, id: String(product.id) });
            gaEvent.whatsappClick(product.name);
            window.open(generateWhatsAppLink(product.name), "_blank");
          }}
          aria-label={`Commander ${product.name} sur WhatsApp`}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Button
        variant="outline" size="icon"
        onClick={() => onChange(page - 1)} disabled={page === 1}
        className="h-9 w-9"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const isNear = Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
        if (!isNear) {
          if (p === 2 && page > 3) return <span key={p} className="text-gray-400 text-sm px-1">…</span>;
          if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="text-gray-400 text-sm px-1">…</span>;
          return null;
        }
        return (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            onClick={() => onChange(p)}
            className={`h-9 w-9 text-sm ${p === page ? "bg-[#B8860B] hover:bg-[#9A7209] border-[#B8860B]" : ""}`}
          >
            {p}
          </Button>
        );
      })}

      <Button
        variant="outline" size="icon"
        onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="h-9 w-9"
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ProduitsPage() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [sortBy, setSortBy]             = useState("featured");
  const [page, setPage]                 = useState(1);

  const addToCart = useCartStore((s) => s.addItem);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) setProducts(await res.json());
      } catch (e) {
        console.error("Erreur chargement produits:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["Tous", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let r = products;
    if (activeCategory !== "Tous") r = r.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc":  return [...r].sort((a, b) => a.price - b.price);
      case "price-desc": return [...r].sort((a, b) => b.price - a.price);
      case "name":       return [...r].sort((a, b) => a.name.localeCompare(b.name));
      case "promo":      return [...r].sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0));
      default:           return [...r].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [products, activeCategory, searchQuery, sortBy]);

  // Reset page quand filtre change
  useEffect(() => { setPage(1); }, [activeCategory, searchQuery, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const handleQuickBuy = useCallback((product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    fbPixelEvent.addToCart({ ...product, id: product.id });
    gaEvent.addToCart({ ...product, id: product.id });
  }, [addToCart]);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <ArrowLeft className="h-5 w-5 text-[#B8860B]" />
              <BrandLogo size="sm" href="" />
            </Link>

            <h1 className="text-xl font-bold text-gray-900">Nos Produits</h1>

            <div className="flex items-center gap-3">
              {/* Favoris */}
              <Link href="/favoris" className="relative p-2 text-gray-500 hover:text-red-500 transition">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <CartButton />
            </div>
          </div>
        </div>
      </header>

      <CartPanel />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Collection Exclusive</h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto">
            Montres de luxe et accessoires premium, disponibles à Conakry avec livraison rapide.
          </p>
          <div className="flex items-center justify-center gap-6 mt-5 text-sm text-gray-400">
            <span>📞 +224 623 457 689</span>
            <span>📍 Lambanyi, Conakry</span>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 bg-white border-b">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto">
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs h-8 ${activeCategory === cat ? "bg-[#B8860B] hover:bg-[#9A7209] text-white" : "hover:border-[#B8860B] hover:text-[#B8860B]"}`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Populaires</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="promo">Promotions</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          {activeCategory !== "Tous" && ` dans « ${activeCategory} »`}
          {searchQuery && ` pour « ${searchQuery} »`}
          {filteredProducts.length > ITEMS_PER_PAGE && ` · Page ${page} / ${Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}`}
        </p>
      </section>

      {/* Grille produits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageX className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {searchQuery ? `Aucun résultat pour « ${searchQuery} ». Essayez un autre terme.` : "Aucun produit dans cette catégorie pour le moment."}
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("Tous"); }}>
              Voir tous les produits
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={`${product.id}`} product={product} onQuickBuy={handleQuickBuy} />
              ))}
            </div>

            <Pagination
              page={page}
              total={filteredProducts.length}
              perPage={ITEMS_PER_PAGE}
              onChange={handlePageChange}
            />

            <p className="text-center text-xs text-gray-400 mt-4">
              Affichage {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}–{Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} sur {filteredProducts.length} produits
            </p>
          </>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Recevez nos offres exclusives 👑</h3>
          <p className="text-gray-300 mb-6 text-sm">
            Inscrivez-vous pour être le premier informé des nouveautés et promotions MARCHÉ ROYAL.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="bg-green-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold mb-2">Besoin d&apos;aide pour choisir ?</h3>
          <p className="text-green-100 mb-4">Notre équipe vous conseille gratuitement sur WhatsApp !</p>
          <Button
            className="bg-white text-green-700 hover:bg-green-50 font-semibold"
            onClick={() => window.open(generateWhatsAppLink("Conseil pour choisir un produit"), "_blank")}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Discuter sur WhatsApp
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" href="/" invert />
          </div>
          <p className="text-sm">Lambanyi, Conakry – Guinée | +224 623 457 689</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
            <a href="/cgv" className="hover:text-gray-400 transition-colors">CGV</a>
            <span>·</span>
            <a href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions légales</a>
            <span>·</span>
            <a href="/confidentialite" className="hover:text-gray-400 transition-colors">Confidentialité</a>
            <span>·</span>
            <a href="/contact" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
          <p className="text-xs mt-3">© {new Date().getFullYear()} MARCHÉ ROYAL DE GUINÉE. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
