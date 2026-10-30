"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

/**
 * The cart only remembers product ids and quantities. Names and prices always
 * come fresh from POST /cart/validate, so they can never go stale.
 */
interface CartState {
  lines: CartLine[];
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId);
          if (!existing) {
            return { lines: [...state.lines, { productId, quantity }] };
          }
          return {
            lines: state.lines.map((l) =>
              l.productId === productId
                ? { ...l, quantity: l.quantity + quantity }
                : l,
            ),
          };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.max(1, quantity) }
              : l,
          ),
        })),
      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "albaraka-cart" },
  ),
);

export const useCartCount = () =>
  useCart((state) => state.lines.reduce((sum, l) => sum + l.quantity, 0));
