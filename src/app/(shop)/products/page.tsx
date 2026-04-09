"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import type { IProduct } from "@/types";
import { cn } from "@/lib/utils";

function ProductListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Read filters from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentCategory) params.set("category", currentCategory);
      if (debouncedSearch) params.set("search", debouncedSearch);
      params.set("sort", currentSort);
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.items);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
        if (data.data.categories) setCategories(data.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentSort, currentPage, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {currentCategory || "All Products"}
        </h1>
        <p className="text-[var(--muted)]">
          {loading ? "Loading..." : `${total} product${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold mb-3">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter("category", "")}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                    !currentCategory
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-400/10 dark:text-primary-400 font-medium"
                      : "text-[var(--muted)] hover:bg-surface-100 dark:hover:bg-surface-800"
                  )}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter("category", cat)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                      currentCategory === cat
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-400/10 dark:text-primary-400 font-medium"
                        : "text-[var(--muted)] hover:bg-surface-100 dark:hover:bg-surface-800"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort (mobile) */}
            <div className="lg:hidden">
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={currentSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Desktop sort bar */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-[var(--divider)]">
            <p className="text-sm text-[var(--muted)]">
              Showing {products.length} of {total} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--muted)]">Sort:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter("sort", opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    currentSort === opt.value
                      ? "bg-primary-600 text-white"
                      : "bg-surface-100 text-[var(--muted)] hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-[var(--muted)] mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchInput("");
                  router.push("/products");
                }}
                className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => updateFilter("page", (currentPage - 1).toString())}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => updateFilter("page", page.toString())}
                        className={cn(
                          "w-10 h-10 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                          page === currentPage
                            ? "bg-primary-600 text-white"
                            : "bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700"
                        )}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => updateFilter("page", (currentPage + 1).toString())}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ProductGridSkeleton count={12} /></div>}>
      <ProductListingContent />
    </Suspense>
  );
}
