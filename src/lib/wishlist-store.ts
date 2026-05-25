"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) =>
        set((s) => {
          const exists = s.productIds.includes(id);
          return {
            productIds: exists
              ? s.productIds.filter((x) => x !== id)
              : [...s.productIds, id],
          };
        }),
      has: (id) => get().productIds.includes(id),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: "lirios-wishlist",
      partialize: (s) => ({ productIds: s.productIds }),
    },
  ),
);
