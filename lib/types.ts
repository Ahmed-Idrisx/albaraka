/**
 * Shapes returned by the API. Every document has `id` (never `_id`).
 * Text the admin types has an English twin (`nameEn`…); an empty one means
 * "show the Arabic" — see useLocalized().
 */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  image: string;
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  /** Populated (names + slug) on lists and details, a bare id on home sections. */
  category: Pick<Category, "id" | "name" | "nameEn" | "slug"> | string;
  price: number;
  discountPrice?: number | null;
  unit: string;
  unitEn?: string;
  stock: number;
  image: string;
  isAvailable: boolean;
}

export interface HomeSection {
  category: Category;
  /** How many products in the category are available right now. */
  availableCount: number;
  products: Product[];
}

export type ProductSort = "newest" | "price_asc" | "price_desc";

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface DeliveryArea {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  isActive: boolean;
  order: number;
}

/** A unit of sale in both languages, e.g. { ar: "كجم", en: "kg" }. */
export interface Unit {
  ar: string;
  en: string;
}

export interface Settings {
  storeName: string;
  storeNameEn?: string;
  storePhone: string;
  workingHours: string;
  workingHoursEn?: string;
  units: Unit[];
}

export interface CartLine {
  productId: string;
  quantity: number;
}

/** Why a cart line can't be ordered as is (translated under "cartIssues"). */
export type CartIssue =
  | "removed"
  | "unavailable"
  | "out_of_stock"
  | "limited_stock";

export interface ValidatedCartItem {
  productId: string;
  quantity: number;
  name?: string;
  nameEn?: string;
  slug?: string;
  image?: string;
  unit?: string;
  unitEn?: string;
  price?: number;
  lineTotal?: number;
  stock?: number;
  /** Null when the line can be ordered as is. */
  issue: CartIssue | null;
}

export interface ValidatedCart {
  items: ValidatedCartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  canCheckout: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export interface OrderItem {
  product: string;
  name: string;
  nameEn?: string;
  price: number;
  unit: string;
  unitEn?: string;
  quantity: number;
}

/** A row in the dashboard's orders table. */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  customer: { name: string; phone: string };
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Order extends OrderSummary {
  customer: { name: string; phone: string; address: string; notes?: string };
  items: OrderItem[];
  deliveryArea?: { name: string; nameEn?: string; price: number };
  subtotal: number;
  deliveryFee: number;
}

/** What the public tracking page gets — no customer details. */
export type TrackedOrder = Pick<
  Order,
  | "orderNumber"
  | "status"
  | "items"
  | "subtotal"
  | "deliveryFee"
  | "total"
  | "createdAt"
>;

export interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

export interface OrderAnalytics {
  daily: { date: string; orders: number; revenue: number }[];
  byStatus: { status: OrderStatus; count: number }[];
  topProducts: {
    name: string;
    nameEn?: string;
    quantity: number;
    revenue: number;
  }[];
}

export type UserRole = "superadmin" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** A row in the admins list. */
export interface Admin extends AuthUser {
  createdAt: string;
}
