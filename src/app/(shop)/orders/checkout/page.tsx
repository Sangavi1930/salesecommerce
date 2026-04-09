"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            imageURL: item.imageURL,
          })),
          shippingAddress: form,
          paymentMethod: "mock",
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        addToast("Order placed successfully! 🎉", "success");
        router.push("/orders");
      } else {
        addToast(data.error || "Failed to place order", "error");
      }
    } catch {
      addToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
        <p className="text-[var(--muted)] mb-6">Add some products to your cart first.</p>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
              <h2 className="text-lg font-bold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <Input label="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required placeholder="John Doe" />
                <Input label="Street Address" value={form.street} onChange={(e) => updateField("street", e.target.value)} required placeholder="123 Main St, Apt 4" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} required placeholder="New York" />
                  <Input label="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} required placeholder="NY" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="ZIP Code" value={form.zip} onChange={(e) => updateField("zip", e.target.value)} required placeholder="10001" />
                  <Input label="Country" value={form.country} onChange={(e) => updateField("country", e.target.value)} required placeholder="US" />
                </div>
              </div>
            </div>

            {/* Payment (mock) */}
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Mock Payment</p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/60">Payment will be simulated for demo purposes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-card">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 bg-surface-100 dark:bg-surface-800 rounded-md flex items-center justify-center text-xs font-medium shrink-0">
                      {item.quantity}
                    </span>
                    <span className="flex-1 truncate">{item.title}</span>
                    <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-[var(--divider)] pt-4">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-success-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--divider)] pt-2 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button type="submit" isLoading={loading} className="w-full mt-6" size="lg">
                Place Order — {formatPrice(grandTotal)}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
