import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

/**
 * Store Zustand pour le mini-panier persistant (localStorage)
 * Gère l'ajout, la suppression et le comptage des articles.
 * Les données survivent au rechargement de la page.
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  variant?: string; // ex: "Couleur: Noir / Taille: M"
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-GN").format(price) + " GNF";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        set((state) => {
          // Considérer la variante comme partie de l'identité de l'article
          const existingItem = state.items.find(
            (item) => item.id === product.id && item.variant === product.variant
          );

          if (existingItem) {
            toast.success(`Quantité mise à jour`, {
              description: `${product.name} — ${existingItem.quantity + 1} dans le panier`,
              duration: 2500,
            });
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.variant === product.variant
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }

          toast.success(`Ajouté au panier 🛒`, {
            description: `${product.name} — ${formatPrice(product.price)}`,
            duration: 2500,
          });
          return {
            items: [...state.items, { ...product, quantity: 1 }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, variant) => {
        const item = get().items.find(
          (i) => i.id === productId && i.variant === variant
        );
        if (item) {
          toast.info(`Retiré du panier`, { description: item.name, duration: 2000 });
        }
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === productId && i.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "marche-royal-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
