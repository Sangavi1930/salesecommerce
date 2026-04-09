"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice, discountPercentage } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/Toast";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      imageURL: product.imageURL,
      quantity: 1,
      stock: product.stock,
    });
    addToast(`${product.title} added to cart`, "success");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product._id);
    addToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      wishlisted ? "info" : "success"
    );
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? discountPercentage(product.compareAtPrice!, product.price)
    : 0;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-100 dark:bg-surface-800">
        <Image
          src={product.imageURL}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-108"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-error-500 text-white text-xs font-bold rounded-lg">
              -{discount}%
            </span>
          )}
          {product.stock <= 0 && (
            <span className="px-2.5 py-1 bg-surface-900/80 text-white text-xs font-bold rounded-lg">
              Out of Stock
            </span>
          )}
          {product.featured && product.stock > 0 && (
            <span className="px-2.5 py-1 bg-accent-500 text-white text-xs font-bold rounded-lg">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm",
            wishlisted
              ? "bg-error-500 text-white"
              : "bg-white/90 text-surface-500 hover:bg-white hover:text-error-500 dark:bg-surface-900/90 dark:hover:bg-surface-900"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={cn("w-4 h-4", wishlisted && "animate-heart-beat")}
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick add to cart */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
              product.stock > 0
                ? "bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
                : "bg-surface-300 text-surface-500 cursor-not-allowed"
            )}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < Math.round(product.rating)
                  ? "text-accent-400"
                  : "text-surface-200 dark:text-surface-700"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-[var(--muted)] ml-1">
            ({product.numReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--foreground)]">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--muted)] line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
