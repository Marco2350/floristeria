"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CustomBouquetConfig } from "./types";
import { getFlower, getWrap, products } from "./data";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addProduct: (productId: string, qty?: number) => void;
  addCustom: (config: CustomBouquetConfig, price: number) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

function genKey() {
  return Math.random().toString(36).slice(2, 10);
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addProduct: (productId, qty = 1) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.type === "product" && i.productId === productId,
          );
          if (existing && existing.type === "product") {
            return {
              items: s.items.map((i) =>
                i.key === existing.key ? { ...i, qty: i.qty + qty } : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...s.items,
              { type: "product", key: genKey(), productId, qty },
            ],
            isOpen: true,
          };
        }),
      addCustom: (config, price) =>
        set((s) => ({
          items: [
            ...s.items,
            {
              type: "custom",
              key: genKey(),
              config,
              qty: 1,
              computedPrice: price,
            },
          ],
          isOpen: true,
        })),
      updateQty: (key, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      remove: (key) =>
        set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "petalo-tallo-cart",
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export function calculateCustomPrice(config: CustomBouquetConfig) {
  const flowerSubtotal = config.flowers.reduce((sum, s) => {
    const f = getFlower(s.flowerId);
    return sum + (f?.pricePerStem ?? 0) * s.qty;
  }, 0);
  const wrap = getWrap(config.wrapId);
  return flowerSubtotal + (wrap?.price ?? 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    if (item.type === "product") {
      const p = products.find((p) => p.id === item.productId);
      return sum + (p?.price ?? 0) * item.qty;
    }
    return sum + item.computedPrice * item.qty;
  }, 0);
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function describeCartItem(item: CartItem) {
  if (item.type === "product") {
    const p = getProductById(item.productId);
    return {
      title: p?.name ?? "Producto",
      subtitle: p?.shortDescription ?? "",
    };
  }
  const totalStems = item.config.flowers.reduce((s, f) => s + f.qty, 0);
  const wrap = getWrap(item.config.wrapId);
  return {
    title: "Ramo personalizado",
    subtitle: `${totalStems} tallos · ${wrap?.name ?? ""}`,
  };
}
