import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => ({ items: [...state.items, product] }));
        toast.success("Ajouté aux favoris ❤️", { description: product.name, duration: 2000 });
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        if (item) toast.info("Retiré des favoris", { description: item.name, duration: 2000 });
      },

      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      clear: () => set({ items: [] }),
    }),
    {
      name: "marche-royal-wishlist",
    }
  )
);
