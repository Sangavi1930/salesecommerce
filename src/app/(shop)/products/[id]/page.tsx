"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice, discountPercentage, cn } from "@/lib/utils";
import type { IProduct } from "@/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "shipping">("description");

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          // Fetch related products from same category
          const relRes = await fetch(
            `/api/products?category=${encodeURIComponent(data.data.category)}&limit=4`
          );
          const relData = await relRes.json();
          if (relData.success) {
            setRelated(
              relData.data.items.filter((p: IProduct) => p._id !== id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-[var(--muted)] mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products" className="text-primary-600 font-semibold hover:text-primary-700">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product._id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount ? discountPercentage(product.compareAtPrice!, product.price) : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      imageURL: product.imageURL,
      quantity,
      stock: product.stock,
    });
    addToast(`${product.title} added to cart`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--foreground)] transition-colors">Products</Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[var(--foreground)] transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 animate-fade-in">
        {/* Image section */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-800 shadow-lg">
            <Image
              src={product.imageURL}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <span className="px-3 py-1.5 bg-error-500 text-white text-sm font-bold rounded-xl shadow-md">
                -{discount}% OFF
              </span>
            )}
            {!inStock && (
              <span className="px-3 py-1.5 bg-surface-900/80 text-white text-sm font-bold rounded-xl">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wider mb-2">
            {product.category}
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < Math.round(product.rating) ? "text-accent-400" : "text-surface-200 dark:text-surface-700"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[var(--muted)]">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-lg text-[var(--muted)] line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
            {hasDiscount && (
              <Badge variant="success" size="md">Save {discount}%</Badge>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-6">
            {inStock ? (
              <Badge variant="success" dot>
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="error" dot>
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center border border-[var(--input-border)] rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                disabled={!inStock}
              >
                −
              </button>
              <span className="px-5 py-3 font-semibold text-center min-w-[3rem] border-x border-[var(--input-border)]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                disabled={!inStock}
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <button
              onClick={() => {
                toggleItem(product._id);
                addToast(
                  wishlisted ? "Removed from wishlist" : "Added to wishlist",
                  wishlisted ? "info" : "success"
                );
              }}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer",
                wishlisted
                  ? "bg-red-50 border-red-200 text-error-500 dark:bg-red-900/20 dark:border-red-800"
                  : "border-[var(--input-border)] hover:border-red-300 hover:text-error-500 dark:hover:border-red-700"
              )}
              aria-label="Toggle wishlist"
            >
              <svg
                className="w-5 h-5"
                fill={wishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-[var(--divider)]">
            {[
              { icon: "🚚", label: "Free Shipping", sub: "Orders $50+" },
              { icon: "🔄", label: "Easy Returns", sub: "30-day policy" },
              { icon: "🛡️", label: "Warranty", sub: "1 year" },
            ].map((feature) => (
              <div key={feature.label} className="text-center">
                <span className="text-2xl mb-1 block">{feature.icon}</span>
                <p className="text-xs font-semibold">{feature.label}</p>
                <p className="text-xs text-[var(--muted)]">{feature.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 mb-4 border-b border-[var(--divider)]">
              {(["description", "shipping"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium border-b-2 -mb-[1px] transition-colors cursor-pointer capitalize",
                    activeTab === tab
                      ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-sm text-[var(--muted)] leading-relaxed">
              {activeTab === "description" && <p>{product.description}</p>}
              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p>• Free standard shipping on orders over $50</p>
                  <p>• Express shipping available (2-3 business days)</p>
                  <p>• International shipping to select countries</p>
                  <p>• Easy 30-day return policy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {related.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
