import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

/** Every query key in the app starts here, so invalidation stays predictable. */
export const queryKeys = {
  me: ["auth", "me"] as const,
  categories: ["categories"] as const,
  home: ["products", "home"] as const,
  products: (filters: object) => ["products", "list", filters] as const,
  priceRange: ["products", "price-range"] as const,
  product: (key: string) => ["products", "one", key] as const,
  deliveryAreas: (activeOnly: boolean) =>
    ["delivery-areas", activeOnly] as const,
  settings: ["settings"] as const,
  cart: (lines: object, areaId?: string) => ["cart", lines, areaId] as const,
  orders: (filters: object) => ["orders", "list", filters] as const,
  order: (id: string) => ["orders", "one", id] as const,
  orderStats: ["orders", "stats"] as const,
  orderAnalytics: (days: number) => ["orders", "analytics", days] as const,
  admins: ["admins"] as const,
};
