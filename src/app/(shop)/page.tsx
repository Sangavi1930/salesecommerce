"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import type { IProduct } from "@/types";

/* ── Category data ── */
const categories = [
  { name: "Electronics", icon: "⚡", color: "from-blue-500 to-indigo-600", href: "/products?category=Electronics" },
  { name: "Clothing", icon: "👔", color: "from-pink-500 to-rose-600", href: "/products?category=Clothing" },
  { name: "Home", icon: "🏠", color: "from-emerald-500 to-teal-600", href: "/products?category=Home" },
  { name: "Sports", icon: "🏃", color: "from-orange-500 to-amber-600", href: "/products?category=Sports" },
  { name: "Books", icon: "📚", color: "from-purple-500 to-violet-600", href: "/products?category=Books" },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch("/api/products?featured=true&limit=4"),
          fetch("/api/products?sort=newest&limit=8"),
        ]);
        const featuredData = await featuredRes.json();
        const newData = await newRes.json();

        if (featuredData.success) setFeaturedProducts(featuredData.data.items);
        if (newData.success) setNewArrivals(newData.data.items);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-surface-950 dark:via-surface-900 dark:to-primary-900/20" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                New Collection 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Elevate Your{" "}
                <span className="gradient-text">Everyday</span>{" "}
                Style
              </h1>

              <p className="text-lg text-[var(--muted)] max-w-lg mb-8 leading-relaxed">
                Discover curated collections of premium products designed to
                enhance your life. From cutting-edge tech to timeless fashion.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Shop Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[var(--card-border)] font-semibold rounded-2xl hover:border-primary-400 hover:text-primary-600 transition-all duration-300"
                >
                  View Featured
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-[var(--divider)]">
                {[
                  { value: "2K+", label: "Products" },
                  { value: "15K+", label: "Customers" },
                  { value: "4.9", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden lg:block animate-slide-up">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-[2rem] rotate-6 opacity-20 blur-sm" />
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-surface-100 dark:bg-surface-800">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                    alt="Premium shopping experience"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-[var(--card-bg)] rounded-2xl shadow-xl p-4 border border-[var(--card-border)] animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Free Shipping</p>
                      <p className="text-xs text-[var(--muted)]">On orders $50+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-[var(--muted)]">Browse our curated collections</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-[var(--card-bg)] border border-[var(--card-border)]"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-3xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <p className="font-semibold text-sm">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-[var(--muted)]">Handpicked just for you</p>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ PROMO BANNER ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                Limited Time Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Up to 40% Off on Premium Collection
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Don&apos;t miss out on our biggest sale of the season. Premium quality at unbeatable prices.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
              >
                Shop the Sale
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-white/5 rounded-full" />
                <div className="absolute inset-8 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&h=300&fit=crop"
                    alt="Sale promotion"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ NEW ARRIVALS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-[var(--muted)]">The latest additions to our store</p>
          </div>
          <Link
            href="/products?sort=newest"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {newArrivals.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-3xl p-8 sm:p-12 shadow-glass">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Stay in the Loop</h2>
            <p className="text-[var(--muted)] mb-6">
              Subscribe to get exclusive deals, new arrivals, and style tips
              delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
