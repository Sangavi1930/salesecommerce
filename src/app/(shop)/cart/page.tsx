"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems, isLoading } = useCart();
  const { addToast } = useToast();

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added any items to your cart yet. Start exploring our products!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          Continue Shopping
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => {
            clearCart();
            addToast("Cart cleared", "info");
          }}
          className="text-sm text-[var(--muted)] hover:text-error-500 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:shadow-card transition-shadow animate-fade-in"
            >
              <Link
                href={`/products/${item.productId}`}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 shrink-0"
              >
                <Image
                  src={item.imageURL}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="text-sm font-semibold hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-lg font-bold mt-1">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-[var(--input-border)] rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1.5 text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold border-x border-[var(--input-border)]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                      className="px-3 py-1.5 text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      removeItem(item.productId);
                      addToast("Item removed from cart", "info");
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--muted)] hover:text-error-500 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <p className={cn("text-lg font-bold", item.quantity > 1 && "text-primary-600 dark:text-primary-400")}>
                  {formatPrice(item.price * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-[var(--muted)]">
                    {formatPrice(item.price)} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-card">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-success-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Tax</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-[var(--divider)] pt-3 flex justify-between">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-base">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="mt-3 text-xs text-[var(--muted)] bg-accent-50 dark:bg-accent-900/20 px-3 py-2 rounded-lg">
                💡 Add {formatPrice(50 - totalPrice)} more for free shipping!
              </p>
            )}

            <Link href="/orders/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <Link
              href="/products"
              className="block mt-3 text-center text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
