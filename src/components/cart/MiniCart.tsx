"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Mini-panier persistant avec icône + nombre d'articles
 * S'ouvre en panneau latéral (Sheet) pour ne pas quitter la page.
 */

// Format prix en GNF
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
};

// Génère le lien WhatsApp avec le récapitulatif du panier
const generateCartWhatsAppLink = (
  items: { name: string; quantity: number; price: number }[]
): string => {
  const itemsList = items
    .map(
      (item) =>
        `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = encodeURIComponent(
    `Bonjour, je souhaite commander :\n\n${itemsList}\n\nTotal : ${formatPrice(total)}\n\nMerci de confirmer ma commande.`
  );

  return `https://wa.me/224623457689?text=${message}`;
};

export function CartButton() {
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-700 hover:text-[#B8860B] transition-colors"
      aria-label={`Panier (${totalItems} articles)`}
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full p-0 px-1.5 animate-in zoom-in duration-200">
          {totalItems}
        </Badge>
      )}
    </button>
  );
}

export function CartPanel() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const router = useRouter();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#B8860B]" />
            Mon Panier
            {totalItems > 0 && (
              <Badge className="bg-[#B8860B] text-white ml-2">
                {totalItems} article{totalItems > 1 ? "s" : ""}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Contenu du panier */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                Votre panier est vide
              </p>
              <p className="text-gray-400 text-sm">
                Ajoutez des produits pour commencer votre commande
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}:${item.variant ?? ''}`}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  {/* Image produit */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={item.image}
                      alt={`${item.name} dans le panier`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Infos produit */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.name}
                    </h4>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                    )}
                    <p className="text-[#B8860B] font-bold text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Contrôles quantité */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1, item.variant)
                        }
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1, item.variant)
                        }
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3 w-3" />
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => removeItem(item.id, item.variant)}
                        className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                        aria-label={`Supprimer ${item.name} du panier`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bouton vider le panier */}
              {items.length > 1 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:text-red-600 transition-colors underline w-full text-center"
                >
                  Vider le panier
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer avec total et CTA */}
        {items.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="flex-col gap-3 pt-4">
              {/* Total */}
              <div className="flex justify-between items-center w-full px-1">
                <span className="text-gray-600 font-medium">Total</span>
                <span className="text-2xl font-bold text-[#B8860B]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Bouton principal : Passer la commande */}
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6 font-bold shadow-md"
                onClick={handleCheckout}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Passer la commande
              </Button>

              {/* Option secondaire : WhatsApp */}
              <Button
                variant="outline"
                className="w-full text-green-700 border-green-300 hover:bg-green-50"
                onClick={() =>
                  window.open(generateCartWhatsAppLink(items), "_blank")
                }
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Ou commander via WhatsApp
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Paiement à la livraison disponible à Conakry
              </p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
