/* ──────────────────────────────────────────────
   Shared TypeScript interfaces for the app
   ────────────────────────────────────────────── */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  imageURL: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: string;
}

export interface ICartItem {
  productId: string;
  title: string;
  price: number;
  imageURL: string;
  quantity: number;
  stock: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
}

export interface IWishlistItem {
  _id: string;
  title: string;
  price: number;
  imageURL: string;
  category: string;
  stock: number;
}

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageURL: string;
}

export interface IShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  createdAt: string;
}

/* ── API response types ── */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

/* ── Filter / Query types ── */
export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "rating";
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}
