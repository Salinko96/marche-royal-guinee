'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function FavorisPage() {
  const { items, removeItem, clear } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    toast.success('Ajouté au panier', { description: item.name, duration: 2000 });
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/produits">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#D4A418] fill-[#D4A418]" />
              <h1 className="text-white font-semibold text-lg">Mes Favoris</h1>
              {items.length > 0 && (
                <span className="bg-[#D4A418] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { clear(); toast.info('Favoris vidés'); }}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
              <Heart className="h-12 w-12 text-white/20" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold mb-2">Aucun favori pour l&apos;instant</h2>
              <p className="text-white/50 text-sm max-w-xs">
                Parcourez notre catalogue et ajoutez des articles à vos favoris pour les retrouver facilement.
              </p>
            </div>
            <Link href="/produits">
              <Button className="bg-[#D4A418] hover:bg-[#B8860B] text-black font-semibold px-6">
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/60 text-sm">
                {items.length} article{items.length > 1 ? 's' : ''} dans vos favoris
              </p>
              <Link href="/produits">
                <Button variant="ghost" size="sm" className="text-[#D4A418] hover:text-[#B8860B] text-sm">
                  Continuer mes achats →
                </Button>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4A418]/40 transition-all duration-300"
                >
                  {/* Image */}
                  <Link href={`/produits/${item.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-black">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-3">
                    <Link href={`/produits/${item.slug}`}>
                      <h3 className="text-white font-medium text-sm line-clamp-2 mb-1 hover:text-[#D4A418] transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 text-[#D4A418] fill-[#D4A418]" />
                      <span className="text-white/50 text-xs">{item.category}</span>
                    </div>

                    <p className="text-[#D4A418] font-bold text-base mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-[#D4A418] hover:bg-[#B8860B] text-black font-semibold text-xs h-8"
                      >
                        <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                        Ajouter
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10 flex-shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 text-white/40 text-sm">
                <Package className="h-4 w-4" />
                Livraison disponible à Conakry et dans toute la Guinée
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
