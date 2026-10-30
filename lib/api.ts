import { apiClient } from "@/lib/apiClient";
import type {
  Admin,
  AuthUser,
  CartLine,
  Category,
  DeliveryArea,
  HomeSection,
  Order,
  OrderAnalytics,
  OrderStats,
  OrderStatus,
  OrderSummary,
  Paginated,
  PaymentStatus,
  Product,
  ProductFilters,
  Settings,
  TrackedOrder,
  ValidatedCart,
} from "@/lib/types";

/** Every call to the backend lives here, grouped by resource. */

const get = <T>(url: string, params?: object) =>
  apiClient.get<T>(url, { params }).then((res) => res.data);

export const productsApi = {
  list: (filters: ProductFilters) =>
    get<Paginated<Product>>("/products", filters),
  home: () => get<HomeSection[]>("/products/home"),
  priceRange: () => get<{ min: number; max: number }>("/products/price-range"),
  bySlug: (slug: string) =>
    get<Product>(`/products/slug/${encodeURIComponent(slug)}`),
  byId: (id: string) => get<Product>(`/products/${id}`),
  // Product writes are multipart because of the image.
  create: (form: FormData) =>
    apiClient.post<Product>("/products", form).then((res) => res.data),
  update: (id: string, form: FormData) =>
    apiClient.patch<Product>(`/products/${id}`, form).then((res) => res.data),
  remove: (id: string) => apiClient.delete(`/products/${id}`),
};

export const categoriesApi = {
  list: () => get<Category[]>("/categories"),
  create: (form: FormData) =>
    apiClient.post<Category>("/categories", form).then((res) => res.data),
  update: (id: string, form: FormData) =>
    apiClient.patch<Category>(`/categories/${id}`, form).then((res) => res.data),
  remove: (id: string) => apiClient.delete(`/categories/${id}`),
};

export const deliveryAreasApi = {
  list: (activeOnly = false) =>
    get<DeliveryArea[]>("/delivery-areas", activeOnly ? { activeOnly } : {}),
  create: (data: Partial<DeliveryArea>) =>
    apiClient.post<DeliveryArea>("/delivery-areas", data).then((r) => r.data),
  update: (id: string, data: Partial<DeliveryArea>) =>
    apiClient
      .patch<DeliveryArea>(`/delivery-areas/${id}`, data)
      .then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/delivery-areas/${id}`),
};

export const settingsApi = {
  get: () => get<Settings>("/settings"),
  update: (data: Partial<Settings>) =>
    apiClient.patch<Settings>("/settings", data).then((res) => res.data),
};

export const cartApi = {
  validate: (items: CartLine[], deliveryAreaId?: string) =>
    apiClient
      .post<ValidatedCart>("/cart/validate", { items, deliveryAreaId })
      .then((res) => res.data),
};

export const ordersApi = {
  create: (data: {
    customer: { name: string; phone: string; address: string; notes?: string };
    items: CartLine[];
    deliveryAreaId?: string;
  }) =>
    apiClient
      .post<{ orderNumber: string; total: number }>("/orders", data)
      .then((res) => res.data),
  track: (orderNumber: string) =>
    get<TrackedOrder>("/orders/track", { orderNumber }),
  list: (params: { status?: OrderStatus; page?: number; limit?: number }) =>
    get<Paginated<OrderSummary>>("/orders", params),
  byId: (id: string) => get<Order>(`/orders/${id}`),
  stats: () => get<OrderStats>("/orders/stats"),
  analytics: (days: number) =>
    get<OrderAnalytics>("/orders/analytics", { days }),
  setStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data),
  setPayment: (id: string, paymentStatus: PaymentStatus) =>
    apiClient
      .patch<Order>(`/orders/${id}/payment`, { paymentStatus })
      .then((r) => r.data),
};

export const authApi = {
  login: (values: { email: string; password: string }) =>
    apiClient
      .post<{ user: AuthUser; token: string }>("/auth/login", values)
      .then((res) => res.data),
  logout: () => apiClient.post("/auth/logout"),
  me: () => get<AuthUser>("/auth/me"),
};

export const adminsApi = {
  list: () => get<Admin[]>("/admins"),
  create: (data: { name: string; email: string; password: string }) =>
    apiClient.post<AuthUser>("/admins", data).then((res) => res.data),
  remove: (id: string) => apiClient.delete(`/admins/${id}`),
};
