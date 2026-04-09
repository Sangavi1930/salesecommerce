"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { IProduct } from "@/types";

export default function WishlistPage() {
  const { items: wishlistIds, toggleItem, isLoading: wishlistLoading } = useWishlist();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlistLoading) return;
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch all products and filter by IDs (simple approach for small datasets)
        const res = await fetch(`/api/products?limit=100`);
        const data = await res.json();
        if (data.success) {
          const filtered = data.data.items.filter((p: IProduct) =>
            wishlistIds.includes(p._id)
          );
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlistProducts();
  }, [wishlistIds, wishlistLoading]);

  const handleMoveToCart = (product: IProduct) => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      imageURL: product.imageURL,
      quantity: 1,
      stock: product.stock,
    });
    toggleItem(product._id);
    addToast(`${product.title} moved to cart`, "success");
  };

  if (loading || wishlistLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 animate-skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
        <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
          Save items you love by clicking the heart icon on any product.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-[var(--muted)] mt-1">{products.length} item{products.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] shadow-card hover:shadow-card-hover transition-all animate-fade-in"
          >
            <Link href={`/products/${product._id}`} className="block relative aspect-[4/3] overflow-hidden">
              <Image
                src={product.imageURL}
                alt={product.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </Link>
            <div className="p-4">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">{product.category}</p>
              <Link
                href={`/products/${product._id}`}
                className="text-sm font-semibold line-clamp-2 hover:text-primary-600 transition-colors"
              >
                {product.title}
              </Link>
              <p className="text-lg font-bold mt-2">{formatPrice(product.price)}</p>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleMoveToCart(product)}
                  size="sm"
                  className="flex-1"
                  disabled={product.stock <= 0}
                >
                  Move to Cart
                </Button>
                <button
                  onClick={() => {
                    toggleItem(product._id);
                    addToast("Removed from wishlist", "info");
                  }}
                  className="p-2 rounded-xl border border-[var(--input-border)] hover:bg-red-50 hover:border-red-200 hover:text-error-500 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
