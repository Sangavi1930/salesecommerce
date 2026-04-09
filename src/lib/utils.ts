import { type ClassValue, clsx } from "clsx";

/**
 * Merge class names conditionally – a tiny alternative to clsx+twMerge.
 * Since we're on Tailwind v4 we don't need tw-merge; clsx is sufficient
 * because v4 handles specificity via layers.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a number as USD currency.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Calculate discount percentage between original and sale price.
 */
export function discountPercentage(
  original: number,
  sale: number
): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate star rating display info.
 */
export function getStarRating(rating: number): {
  full: number;
  half: boolean;
  empty: number;
} {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}
